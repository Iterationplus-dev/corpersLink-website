import { defineStore } from 'pinia';

import { clearToken, getToken, setToken } from '@/core/auth/token-storage';
import { AppError } from '@/core/types/app-error';
import { authService } from '@/features/auth/services';
import type { User } from '@/features/auth/types';

interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'error';
  error: AppError | null;
  /** Transient state threaded through the multi-step registration flow. */
  registrationId: string | null;
  registrationEmail: string | null;
  /** Transient state threaded through the forgot-password flow. */
  resetEmail: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: getToken(),
    user: null,
    status: 'idle',
    error: null,
    registrationId: null,
    registrationEmail: null,
    resetEmail: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => state.token !== null,
    isLoading: (state): boolean => state.status === 'loading',
  },

  actions: {
    setSession(accessToken: string, user: User): void {
      this.token = accessToken;
      this.user = user;
      setToken(accessToken);
    },

    /**
     * Clears local session state only — no API call. Used when a 401 from
     * any request proves the stored token is already dead server-side, where
     * calling the real sign-out endpoint would itself 401-loop.
     */
    forceSignOut(): void {
      this.token = null;
      this.user = null;
      clearToken();
    },

    async login(identifier: string, password: string): Promise<void> {
      this.status = 'loading';
      this.error = null;
      try {
        const result = await authService.login(identifier, password);
        if (result.requiresTwoFactor) {
          // No seed/real user has 2FA enabled yet and there's no UI for this
          // challenge — surface a clear error instead of silently failing.
          // TODO(2FA): wire up `authService`'s `verifyTwoFactor` once a
          // two-factor-enabled account needs to sign in.
          throw new AppError({
            message: "Two-factor sign-in isn't supported in this app yet — contact support.",
            kind: 'unknown',
          });
        }
        this.setSession(result.session.accessToken, result.session.user);
        this.status = 'idle';
      } catch (error) {
        this.status = 'idle';
        this.error = error instanceof AppError ? error : null;
        throw error;
      }
    },

    async signOut(): Promise<void> {
      try {
        await authService.logout();
      } finally {
        this.forceSignOut();
      }
    },

    async fetchCurrentUser(): Promise<void> {
      if (!this.token) return;
      this.user = await authService.getCurrentUser();
    },

    async requestPasswordReset(email: string): Promise<void> {
      await authService.requestPasswordReset(email);
      this.resetEmail = email;
    },

    async resendPasswordReset(): Promise<void> {
      if (!this.resetEmail) {
        throw new AppError({ message: 'Start the password reset flow again.', kind: 'unknown' });
      }
      await authService.resendPasswordResetOtp(this.resetEmail);
    },

    async resetPassword(code: string, newPassword: string): Promise<void> {
      if (!this.resetEmail) {
        throw new AppError({ message: 'Start the password reset flow again.', kind: 'unknown' });
      }
      await authService.resetPassword(this.resetEmail, code, newPassword);
      this.resetEmail = null;
    },

    async startRegistration(fullName: string, email: string, phone: string): Promise<void> {
      this.registrationId = await authService.startRegistration(fullName, email, phone);
      this.registrationEmail = email;
    },

    async verifyRegistrationEmail(code: string): Promise<void> {
      if (!this.registrationId) {
        throw new AppError({ message: 'Start registration again.', kind: 'unknown' });
      }
      await authService.verifyRegistrationOtp(this.registrationId, code);
    },

    async resendRegistrationOtp(): Promise<void> {
      if (!this.registrationId) {
        throw new AppError({ message: 'Start registration again.', kind: 'unknown' });
      }
      await authService.resendRegistrationOtp(this.registrationId);
    },

    async submitSchoolInfo(
      institutionId: number,
      callUpNumber: string,
      stateCode: string | undefined,
      batch: string,
      stream: string,
    ): Promise<void> {
      if (!this.registrationId) {
        throw new AppError({ message: 'Start registration again.', kind: 'unknown' });
      }
      await authService.submitSchoolInfo(
        this.registrationId,
        institutionId,
        callUpNumber,
        stateCode,
        batch,
        stream,
      );
    },

    async submitNextOfKin(
      fullName: string,
      relationship: string,
      phone: string,
      address: string,
    ): Promise<void> {
      if (!this.registrationId) {
        throw new AppError({ message: 'Start registration again.', kind: 'unknown' });
      }
      await authService.submitNextOfKin(this.registrationId, fullName, relationship, phone, address);
    },

    async completeRegistration(password: string): Promise<void> {
      if (!this.registrationId) {
        throw new AppError({ message: 'Start registration again.', kind: 'unknown' });
      }
      const session = await authService.completeRegistration(this.registrationId, password);
      this.setSession(session.accessToken, session.user);
      this.registrationId = null;
      this.registrationEmail = null;
    },
  },
});
