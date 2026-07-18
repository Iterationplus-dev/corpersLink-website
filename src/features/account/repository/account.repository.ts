import type { NextOfKin, User } from '@/features/auth/types';

import type { Session } from '../types';

export interface IAccountRepository {
  getProfile(): Promise<User>;
  updateProfile(fullName?: string, phone?: string, stateCode?: string): Promise<User>;
  deleteAccount(password: string): Promise<void>;

  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  requestEmailChange(newEmail: string, password: string): Promise<void>;
  confirmEmailChange(newEmail: string, code: string): Promise<string>;

  /** Always a `NextOfKin` object (possibly all-null fields), never a bare
   * `null` — unlike `User.emergencyContact`, which the profile-show endpoint
   * does return as a top-level `null` when unset. */
  getEmergencyContact(): Promise<NextOfKin>;
  updateEmergencyContact(
    fullName: string,
    relationship: string,
    phone: string,
    address: string,
    alternatePhone?: string,
  ): Promise<NextOfKin>;
  deleteEmergencyContact(): Promise<void>;

  getSessions(): Promise<Session[]>;
  revokeSession(tokenId: number): Promise<void>;
  revokeAllSessions(): Promise<void>;
}
