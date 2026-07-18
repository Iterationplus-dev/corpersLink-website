import type { IAuthRepository } from '@/features/auth/repository';
import type { AuthSession, LoginResult, User } from '@/features/auth/types';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export class AuthService {
  constructor(private readonly repository: IAuthRepository) {}

  async login(identifier: string, password: string): Promise<LoginResult> {
    return this.repository.login(identifier.trim(), password);
  }

  async logout(): Promise<void> {
    return this.repository.logout();
  }

  async logoutAll(): Promise<void> {
    return this.repository.logoutAll();
  }

  async getCurrentUser(): Promise<User> {
    return this.repository.getCurrentUser();
  }

  async requestPasswordReset(email: string): Promise<void> {
    return this.repository.forgotPassword(normalizeEmail(email));
  }

  async resendPasswordResetOtp(email: string): Promise<void> {
    return this.repository.resendPasswordResetOtp(normalizeEmail(email));
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    return this.repository.resetPassword(normalizeEmail(email), code, newPassword);
  }

  async startRegistration(fullName: string, email: string, phone: string): Promise<string> {
    return this.repository.startRegistration(fullName.trim(), normalizeEmail(email), phone.trim());
  }

  async verifyRegistrationOtp(registrationId: string, code: string): Promise<void> {
    return this.repository.verifyRegistrationOtp(registrationId, code);
  }

  async resendRegistrationOtp(registrationId: string): Promise<void> {
    return this.repository.resendRegistrationOtp(registrationId);
  }

  async submitSchoolInfo(
    registrationId: string,
    institutionId: number,
    callUpNumber: string,
    stateCode: string | undefined,
    batch: string,
    stream: string,
  ): Promise<void> {
    return this.repository.submitSchoolInfo(
      registrationId,
      institutionId,
      callUpNumber.trim(),
      stateCode?.trim() || undefined,
      batch.trim(),
      stream.trim(),
    );
  }

  async submitNextOfKin(
    registrationId: string,
    fullName: string,
    relationship: string,
    phone: string,
    address: string,
  ): Promise<void> {
    return this.repository.submitNextOfKin(
      registrationId,
      fullName.trim(),
      relationship.trim(),
      phone.trim(),
      address.trim(),
    );
  }

  async completeRegistration(registrationId: string, password: string): Promise<AuthSession> {
    return this.repository.completeRegistration(registrationId, password);
  }
}
