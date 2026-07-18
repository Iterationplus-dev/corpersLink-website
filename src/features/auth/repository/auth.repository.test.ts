import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { LoginResponseDTO, UserDTO } from '@/features/auth/types';

import { AuthRepository } from './auth.repository.impl';

function createFakeClient(overrides: Partial<ApiClient> = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

const userDTO: UserDTO = {
  id: 1,
  fullName: 'Adaeze Okafor',
  email: 'adaeze.o@gmail.com',
  emailVerified: true,
  phone: '0803',
  avatarUrl: null,
  avatarInitials: 'AO',
  institution: null,
  callUpNumber: 'NYSC/1',
  stateCode: 'LA/26B/0412',
  batch: 'B',
  stream: '1',
  twoFactorEnabled: false,
  notificationPreferences: {
    booking_updates: true,
    seat_hold_alerts: true,
    departure_reminders: true,
    trip_changes: true,
    tips_announcements: false,
  },
  emergencyContact: null,
  lastLoginAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('AuthRepository', () => {
  it('login posts identifier/password and maps a non-2FA session', async () => {
    const response: LoginResponseDTO = {
      requiresTwoFactor: false,
      user: userDTO,
      tokens: { accessToken: 'tok_123', refreshToken: 'tok_123', expiresIn: 31536000 },
    };
    const post = vi.fn().mockResolvedValue(response);
    const repository = new AuthRepository(createFakeClient({ post }));

    const result = await repository.login('adaeze.o@gmail.com', 'password123');

    expect(post).toHaveBeenCalledWith(ApiEndpoints.auth.login, {
      identifier: 'adaeze.o@gmail.com',
      password: 'password123',
    });
    expect(result.requiresTwoFactor).toBe(false);
    if (!result.requiresTwoFactor) {
      expect(result.session.accessToken).toBe('tok_123');
      expect(result.session.user.fullName).toBe('Adaeze Okafor');
    }
  });

  it('login surfaces a 2FA challenge without a session', async () => {
    const response: LoginResponseDTO = {
      requiresTwoFactor: true,
      challengeToken: 'chal_1',
      expiresIn: 300,
    };
    const post = vi.fn().mockResolvedValue(response);
    const repository = new AuthRepository(createFakeClient({ post }));

    const result = await repository.login('a@b.com', 'pw');

    expect(result).toEqual({ requiresTwoFactor: true, challengeToken: 'chal_1' });
  });

  it('startRegistration posts personal details and returns the registration id', async () => {
    const post = vi.fn().mockResolvedValue({ registrationId: 'reg_1', otpExpiresAt: '2026-01-01T00:10:00.000Z' });
    const repository = new AuthRepository(createFakeClient({ post }));

    const registrationId = await repository.startRegistration('Adaeze Okafor', 'a@b.com', '0803');

    expect(post).toHaveBeenCalledWith(ApiEndpoints.auth.registerStart, {
      fullName: 'Adaeze Okafor',
      acceptedTerms: true,
      email: 'a@b.com',
      phone: '0803',
    });
    expect(registrationId).toBe('reg_1');
  });

  it('submitSchoolInfo patches the registration-scoped school endpoint', async () => {
    const patch = vi.fn().mockResolvedValue({ callUpNumberVerified: true });
    const repository = new AuthRepository(createFakeClient({ patch }));

    await repository.submitSchoolInfo('reg_1', 1, 'NYSC/1', 'LA/26B/0412', 'B', '1');

    expect(patch).toHaveBeenCalledWith(ApiEndpoints.auth.registerSchool('reg_1'), {
      institutionId: 1,
      callUpNumber: 'NYSC/1',
      stateCode: 'LA/26B/0412',
      batch: 'B',
      stream: '1',
    });
  });

  it('submitNextOfKin patches the registration-scoped next-of-kin endpoint with a nested body', async () => {
    const patch = vi.fn().mockResolvedValue({ accepted: true });
    const repository = new AuthRepository(createFakeClient({ patch }));

    await repository.submitNextOfKin('reg_1', 'Chinedu Okafor', 'Brother', '0805', 'Lagos');

    expect(patch).toHaveBeenCalledWith(ApiEndpoints.auth.registerNextOfKin('reg_1'), {
      emergencyContact: {
        fullName: 'Chinedu Okafor',
        relationship: 'Brother',
        phone: '0805',
        address: 'Lagos',
      },
    });
  });

  it('completeRegistration posts the password and maps the returned session', async () => {
    const post = vi.fn().mockResolvedValue({
      user: userDTO,
      tokens: { accessToken: 'tok_456', refreshToken: 'tok_456', expiresIn: 31536000 },
    });
    const repository = new AuthRepository(createFakeClient({ post }));

    const session = await repository.completeRegistration('reg_1', 'password123');

    expect(post).toHaveBeenCalledWith(ApiEndpoints.auth.registerComplete('reg_1'), {
      password: 'password123',
    });
    expect(session.accessToken).toBe('tok_456');
  });

  it('getCurrentUser fetches /profile and maps the user', async () => {
    const get = vi.fn().mockResolvedValue(userDTO);
    const repository = new AuthRepository(createFakeClient({ get }));

    const user = await repository.getCurrentUser();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.profile.show);
    expect(user.fullName).toBe('Adaeze Okafor');
  });
});
