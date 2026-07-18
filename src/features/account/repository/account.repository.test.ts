import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { NextOfKinDTO, UserDTO } from '@/features/auth/types';

import { AccountRepository } from './account.repository.impl';

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

describe('AccountRepository', () => {
  it('getProfile fetches /profile and maps it', async () => {
    const get = vi.fn().mockResolvedValue(userDTO);
    const repository = new AccountRepository(createFakeClient({ get }));

    const profile = await repository.getProfile();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.profile.show);
    expect(profile.fullName).toBe('Adaeze Okafor');
  });

  it('updateProfile patches only the provided fields', async () => {
    const patch = vi.fn().mockResolvedValue(userDTO);
    const repository = new AccountRepository(createFakeClient({ patch }));

    await repository.updateProfile('New Name', undefined, undefined);

    expect(patch).toHaveBeenCalledWith(ApiEndpoints.profile.update, {
      fullName: 'New Name',
      phone: undefined,
      stateCode: undefined,
    });
  });

  it('deleteAccount sends the password to DELETE /profile', async () => {
    const del = vi.fn().mockResolvedValue({ deleted: true });
    const repository = new AccountRepository(createFakeClient({ delete: del }));

    await repository.deleteAccount('correct-password');

    expect(del).toHaveBeenCalledWith(ApiEndpoints.profile.delete, { password: 'correct-password' });
  });

  it('changePassword posts current and new password', async () => {
    const post = vi.fn().mockResolvedValue({ changed: true });
    const repository = new AccountRepository(createFakeClient({ post }));

    await repository.changePassword('old-pass', 'new-pass');

    expect(post).toHaveBeenCalledWith(ApiEndpoints.profile.changePassword, {
      currentPassword: 'old-pass',
      newPassword: 'new-pass',
    });
  });

  it('getEmergencyContact fetches and maps the next-of-kin resource', async () => {
    const dto: NextOfKinDTO = {
      id: 5,
      fullName: 'Chinedu Okafor',
      relationship: 'Brother',
      phone: '0805',
      alternatePhone: null,
      address: 'Lagos',
      applyToAllBookings: true,
    };
    const get = vi.fn().mockResolvedValue(dto);
    const repository = new AccountRepository(createFakeClient({ get }));

    const contact = await repository.getEmergencyContact();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.profile.emergencyContact);
    expect(contact.fullName).toBe('Chinedu Okafor');
  });

  it('getSessions fetches and maps the sessions array', async () => {
    const get = vi.fn().mockResolvedValue([
      { id: 1, deviceName: 'Chrome', lastUsedAt: null, createdAt: '2026-01-01T00:00:00.000Z', current: true },
    ]);
    const repository = new AccountRepository(createFakeClient({ get }));

    const sessions = await repository.getSessions();

    expect(get).toHaveBeenCalledWith(ApiEndpoints.profile.sessions);
    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.deviceName).toBe('Chrome');
  });

  it('revokeSession deletes the token-scoped session path', async () => {
    const del = vi.fn().mockResolvedValue(null);
    const repository = new AccountRepository(createFakeClient({ delete: del }));

    await repository.revokeSession(9);

    expect(del).toHaveBeenCalledWith(ApiEndpoints.profile.session(9));
  });
});
