import type { NextOfKin, User } from '@/features/auth/types';

import type { IAccountRepository } from '@/features/account/repository';
import type { Session } from '@/features/account/types';

export class AccountService {
  constructor(private readonly repository: IAccountRepository) {}

  async loadProfile(): Promise<User> {
    return this.repository.getProfile();
  }

  async updateProfile(fullName?: string, phone?: string, stateCode?: string): Promise<User> {
    return this.repository.updateProfile(fullName?.trim(), phone?.trim(), stateCode?.trim());
  }

  async deleteAccount(password: string): Promise<void> {
    return this.repository.deleteAccount(password);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.repository.changePassword(currentPassword, newPassword);
  }

  async requestEmailChange(newEmail: string, password: string): Promise<void> {
    return this.repository.requestEmailChange(newEmail.trim().toLowerCase(), password);
  }

  async confirmEmailChange(newEmail: string, code: string): Promise<string> {
    return this.repository.confirmEmailChange(newEmail.trim().toLowerCase(), code);
  }

  async getEmergencyContact(): Promise<NextOfKin> {
    return this.repository.getEmergencyContact();
  }

  async updateEmergencyContact(
    fullName: string,
    relationship: string,
    phone: string,
    address: string,
    alternatePhone?: string,
  ): Promise<NextOfKin> {
    return this.repository.updateEmergencyContact(
      fullName.trim(),
      relationship.trim(),
      phone.trim(),
      address.trim(),
      alternatePhone?.trim(),
    );
  }

  async deleteEmergencyContact(): Promise<void> {
    return this.repository.deleteEmergencyContact();
  }

  async getSessions(): Promise<Session[]> {
    return this.repository.getSessions();
  }

  async revokeSession(tokenId: number): Promise<void> {
    return this.repository.revokeSession(tokenId);
  }

  async revokeAllSessions(): Promise<void> {
    return this.repository.revokeAllSessions();
  }
}
