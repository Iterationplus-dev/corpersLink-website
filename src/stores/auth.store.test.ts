import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppError } from '@/core/types/app-error';
import type { User } from '@/features/auth/types';

const login = vi.fn();
const logout = vi.fn();
const getCurrentUser = vi.fn();
const requestPasswordReset = vi.fn();
const resendPasswordResetOtp = vi.fn();
const resetPassword = vi.fn();
const startRegistration = vi.fn();
const verifyRegistrationOtp = vi.fn();
const resendRegistrationOtp = vi.fn();
const submitSchoolInfo = vi.fn();
const submitNextOfKin = vi.fn();
const completeRegistration = vi.fn();

vi.mock('@/features/auth/services', () => ({
  authService: {
    login: (...args: unknown[]) => login(...args),
    logout: (...args: unknown[]) => logout(...args),
    getCurrentUser: (...args: unknown[]) => getCurrentUser(...args),
    requestPasswordReset: (...args: unknown[]) => requestPasswordReset(...args),
    resendPasswordResetOtp: (...args: unknown[]) => resendPasswordResetOtp(...args),
    resetPassword: (...args: unknown[]) => resetPassword(...args),
    startRegistration: (...args: unknown[]) => startRegistration(...args),
    verifyRegistrationOtp: (...args: unknown[]) => verifyRegistrationOtp(...args),
    resendRegistrationOtp: (...args: unknown[]) => resendRegistrationOtp(...args),
    submitSchoolInfo: (...args: unknown[]) => submitSchoolInfo(...args),
    submitNextOfKin: (...args: unknown[]) => submitNextOfKin(...args),
    completeRegistration: (...args: unknown[]) => completeRegistration(...args),
  },
}));

const { useAuthStore } = await import('./auth.store');

const fakeUser: User = {
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
    bookingUpdates: true,
    seatHoldAlerts: true,
    departureReminders: true,
    tripChanges: true,
    tipsAnnouncements: false,
  },
  emergencyContact: null,
  lastLoginAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts unauthenticated when no token is persisted', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });

  describe('login', () => {
    it('persists the access token and user on success', async () => {
      login.mockResolvedValue({
        requiresTwoFactor: false,
        session: { accessToken: 'tok_123', user: fakeUser },
      });
      const store = useAuthStore();

      await store.login('adaeze.o@gmail.com', 'password123');

      expect(store.isAuthenticated).toBe(true);
      expect(store.user).toEqual(fakeUser);
      expect(localStorage.getItem('corperslink.auth.token')).toBe('tok_123');
    });

    it('surfaces the AppError and stays unauthenticated on failure', async () => {
      login.mockRejectedValue(new AppError({ message: 'Invalid credentials', kind: 'validation' }));
      const store = useAuthStore();

      await expect(store.login('bad@example.com', 'wrong')).rejects.toThrow('Invalid credentials');

      expect(store.isAuthenticated).toBe(false);
      expect(store.error?.message).toBe('Invalid credentials');
    });

    it('throws a clear error instead of crashing when 2FA is required', async () => {
      login.mockResolvedValue({ requiresTwoFactor: true, challengeToken: 'chal_1' });
      const store = useAuthStore();

      await expect(store.login('a@b.com', 'pw')).rejects.toThrow(/two-factor/i);
      expect(store.isAuthenticated).toBe(false);
    });
  });

  it('signOut clears the session even if the server call fails', async () => {
    login.mockResolvedValue({
      requiresTwoFactor: false,
      session: { accessToken: 'tok_123', user: fakeUser },
    });
    logout.mockRejectedValue(new Error('network down'));
    const store = useAuthStore();
    await store.login('a@b.com', 'pw');

    await expect(store.signOut()).rejects.toThrow();

    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
    expect(localStorage.getItem('corperslink.auth.token')).toBeNull();
  });

  describe('forgot password flow', () => {
    it('threads the email from request through to reset', async () => {
      requestPasswordReset.mockResolvedValue(undefined);
      resetPassword.mockResolvedValue(undefined);
      const store = useAuthStore();

      await store.requestPasswordReset('adaeze.o@gmail.com');
      expect(store.resetEmail).toBe('adaeze.o@gmail.com');

      await store.resetPassword('1234', 'newpass123');
      expect(resetPassword).toHaveBeenCalledWith('adaeze.o@gmail.com', '1234', 'newpass123');
      expect(store.resetEmail).toBeNull();
    });

    it('refuses to reset the password without an active reset-email session', async () => {
      const store = useAuthStore();
      await expect(store.resetPassword('1234', 'newpass123')).rejects.toThrow();
    });

    it('refuses to resend without an active reset-email session', async () => {
      const store = useAuthStore();
      await expect(store.resendPasswordReset()).rejects.toThrow();
    });
  });

  describe('registration flow', () => {
    it('threads the registration id through every step to a signed-in session', async () => {
      startRegistration.mockResolvedValue('reg_1');
      verifyRegistrationOtp.mockResolvedValue(undefined);
      submitSchoolInfo.mockResolvedValue(undefined);
      submitNextOfKin.mockResolvedValue(undefined);
      completeRegistration.mockResolvedValue({ accessToken: 'tok_456', user: fakeUser });
      const store = useAuthStore();

      await store.startRegistration('Adaeze Okafor', 'adaeze.o@gmail.com', '0803');
      expect(store.registrationId).toBe('reg_1');

      await store.verifyRegistrationEmail('1234');
      expect(verifyRegistrationOtp).toHaveBeenCalledWith('reg_1', '1234');

      await store.submitSchoolInfo(1, 'NYSC/1', 'LA/26B/0412', 'B', '1');
      expect(submitSchoolInfo).toHaveBeenCalledWith('reg_1', 1, 'NYSC/1', 'LA/26B/0412', 'B', '1');

      await store.submitNextOfKin('Chinedu Okafor', 'Brother', '0805', 'Lagos');
      expect(submitNextOfKin).toHaveBeenCalledWith('reg_1', 'Chinedu Okafor', 'Brother', '0805', 'Lagos');

      await store.completeRegistration('password123');
      expect(store.isAuthenticated).toBe(true);
      expect(store.user).toEqual(fakeUser);
      expect(store.registrationId).toBeNull();
    });

    it('refuses to verify registration email without a started registration', async () => {
      const store = useAuthStore();
      await expect(store.verifyRegistrationEmail('1234')).rejects.toThrow();
    });
  });
});
