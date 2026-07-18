import type { AuthSession, LoginResult, User } from '@/features/auth/types';

export interface IAuthRepository {
  login(identifier: string, password: string): Promise<LoginResult>;
  /** Not wired into any view yet — no seed/real user has 2FA enabled. Kept
   * on the interface so the branch is representable once it's needed. */
  verifyTwoFactor(challengeToken: string, code: string): Promise<AuthSession>;
  logout(): Promise<void>;
  logoutAll(): Promise<void>;
  getCurrentUser(): Promise<User>;

  forgotPassword(email: string): Promise<void>;
  resendPasswordResetOtp(email: string): Promise<void>;
  resetPassword(email: string, code: string, newPassword: string): Promise<void>;

  startRegistration(fullName: string, email: string, phone: string): Promise<string>;
  verifyRegistrationOtp(registrationId: string, code: string): Promise<void>;
  resendRegistrationOtp(registrationId: string): Promise<void>;
  submitSchoolInfo(
    registrationId: string,
    institutionId: number,
    callUpNumber: string,
    stateCode: string | undefined,
    batch: string,
    stream: string,
  ): Promise<void>;
  submitNextOfKin(
    registrationId: string,
    fullName: string,
    relationship: string,
    phone: string,
    address: string,
  ): Promise<void>;
  completeRegistration(registrationId: string, password: string): Promise<AuthSession>;
}
