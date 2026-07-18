import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapNextOfKin, mapUser } from '@/features/auth/mappers/auth.mapper';
import type { NextOfKinDTO, NextOfKin, User, UserDTO } from '@/features/auth/types';

import { mapSession } from '../mappers/account.mapper';
import type {
  ChangePasswordRequestDTO,
  ConfirmEmailChangeRequestDTO,
  ConfirmEmailChangeResponseDTO,
  RequestEmailChangeRequestDTO,
  Session,
  SessionDTO,
  UpdateProfileRequestDTO,
  UpsertNextOfKinRequestDTO,
} from '../types';
import type { IAccountRepository } from './account.repository';

export class AccountRepository implements IAccountRepository {
  constructor(private readonly client: ApiClient) {}

  async getProfile(): Promise<User> {
    const dto = await this.client.get<UserDTO>(ApiEndpoints.profile.show);
    return mapUser(dto);
  }

  async updateProfile(fullName?: string, phone?: string, stateCode?: string): Promise<User> {
    const body: UpdateProfileRequestDTO = { fullName, phone, stateCode };
    const dto = await this.client.patch<UserDTO>(ApiEndpoints.profile.update, body);
    return mapUser(dto);
  }

  async deleteAccount(password: string): Promise<void> {
    await this.client.delete<{ deleted: boolean }>(ApiEndpoints.profile.delete, { password });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const body: ChangePasswordRequestDTO = { currentPassword, newPassword };
    await this.client.post<{ changed: boolean }>(ApiEndpoints.profile.changePassword, body);
  }

  async requestEmailChange(newEmail: string, password: string): Promise<void> {
    const body: RequestEmailChangeRequestDTO = { newEmail, password };
    await this.client.post<{ otpExpiresAt: string }>(ApiEndpoints.profile.changeEmailRequest, body);
  }

  async confirmEmailChange(newEmail: string, code: string): Promise<string> {
    const body: ConfirmEmailChangeRequestDTO = { newEmail, code };
    const dto = await this.client.post<ConfirmEmailChangeResponseDTO>(
      ApiEndpoints.profile.changeEmailConfirm,
      body,
    );
    return dto.email;
  }

  async getEmergencyContact(): Promise<NextOfKin> {
    const dto = await this.client.get<NextOfKinDTO>(ApiEndpoints.profile.emergencyContact);
    return mapNextOfKin(dto);
  }

  async updateEmergencyContact(
    fullName: string,
    relationship: string,
    phone: string,
    address: string,
    alternatePhone?: string,
  ): Promise<NextOfKin> {
    const body: UpsertNextOfKinRequestDTO = {
      fullName,
      relationship,
      phone,
      address,
      alternatePhone,
    };
    const dto = await this.client.patch<NextOfKinDTO>(ApiEndpoints.profile.emergencyContact, body);
    return mapNextOfKin(dto);
  }

  async deleteEmergencyContact(): Promise<void> {
    await this.client.delete<null>(ApiEndpoints.profile.emergencyContact);
  }

  async getSessions(): Promise<Session[]> {
    const dtos = await this.client.get<SessionDTO[]>(ApiEndpoints.profile.sessions);
    return dtos.map(mapSession);
  }

  async revokeSession(tokenId: number): Promise<void> {
    await this.client.delete<null>(ApiEndpoints.profile.session(tokenId));
  }

  async revokeAllSessions(): Promise<void> {
    await this.client.delete<null>(ApiEndpoints.profile.sessions);
  }
}
