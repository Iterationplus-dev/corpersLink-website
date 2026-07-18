import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapAuthSession, mapUser } from '@/features/auth/mappers/auth.mapper';
import type {
  AuthSession,
  ForgotPasswordResponseDTO,
  LoginResponseDTO,
  LoginResult,
  OtpResendRequestDTO,
  OtpResendResponseDTO,
  RegisterCompleteResponseDTO,
  RegisterNextOfKinRequestDTO,
  RegisterSchoolRequestDTO,
  RegisterSchoolResponseDTO,
  RegisterStartRequestDTO,
  RegisterStartResponseDTO,
  TwoFactorVerifyResponseDTO,
  User,
  UserDTO,
} from '@/features/auth/types';

import type { IAuthRepository } from './auth.repository';

export class AuthRepository implements IAuthRepository {
  constructor(private readonly client: ApiClient) {}

  async login(identifier: string, password: string): Promise<LoginResult> {
    const dto = await this.client.post<LoginResponseDTO>(ApiEndpoints.auth.login, {
      identifier,
      password,
    });

    if (dto.requiresTwoFactor) {
      return { requiresTwoFactor: true, challengeToken: dto.challengeToken };
    }
    return { requiresTwoFactor: false, session: mapAuthSession(dto.user, dto.tokens) };
  }

  async verifyTwoFactor(challengeToken: string, code: string): Promise<AuthSession> {
    const dto = await this.client.post<TwoFactorVerifyResponseDTO>(
      ApiEndpoints.auth.loginTwoFactorVerify,
      { challengeToken, code },
    );
    return mapAuthSession(dto.user, dto.tokens);
  }

  async logout(): Promise<void> {
    await this.client.post<null>(ApiEndpoints.auth.logout);
  }

  async logoutAll(): Promise<void> {
    await this.client.post<null>(ApiEndpoints.auth.logoutAll);
  }

  async getCurrentUser(): Promise<User> {
    const dto = await this.client.get<UserDTO>(ApiEndpoints.profile.show);
    return mapUser(dto);
  }

  async forgotPassword(email: string): Promise<void> {
    await this.client.post<ForgotPasswordResponseDTO>(ApiEndpoints.auth.forgotPassword, {
      email,
    });
  }

  async resendPasswordResetOtp(email: string): Promise<void> {
    const body: OtpResendRequestDTO = { context: 'reset_password', email };
    await this.client.post<OtpResendResponseDTO>(ApiEndpoints.auth.otpResend, body);
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await this.client.post<{ reset: boolean }>(ApiEndpoints.auth.resetPassword, {
      email,
      code,
      newPassword,
    });
  }

  async startRegistration(fullName: string, email: string, phone: string): Promise<string> {
    const body: RegisterStartRequestDTO = { fullName, acceptedTerms: true, email, phone };
    const dto = await this.client.post<RegisterStartResponseDTO>(
      ApiEndpoints.auth.registerStart,
      body,
    );
    return dto.registrationId;
  }

  async verifyRegistrationOtp(registrationId: string, code: string): Promise<void> {
    await this.client.post<{ verified: boolean }>(ApiEndpoints.auth.otpVerify, {
      registrationId,
      code,
    });
  }

  async resendRegistrationOtp(registrationId: string): Promise<void> {
    const body: OtpResendRequestDTO = { context: 'register', registrationId };
    await this.client.post<OtpResendResponseDTO>(ApiEndpoints.auth.otpResend, body);
  }

  async submitSchoolInfo(
    registrationId: string,
    institutionId: number,
    callUpNumber: string,
    stateCode: string | undefined,
    batch: string,
    stream: string,
  ): Promise<void> {
    const body: RegisterSchoolRequestDTO = {
      institutionId,
      callUpNumber,
      stateCode,
      batch,
      stream,
    };
    await this.client.patch<RegisterSchoolResponseDTO>(
      ApiEndpoints.auth.registerSchool(registrationId),
      body,
    );
  }

  async submitNextOfKin(
    registrationId: string,
    fullName: string,
    relationship: string,
    phone: string,
    address: string,
  ): Promise<void> {
    const body: RegisterNextOfKinRequestDTO = {
      emergencyContact: { fullName, relationship, phone, address },
    };
    await this.client.patch<{ accepted: boolean }>(
      ApiEndpoints.auth.registerNextOfKin(registrationId),
      body,
    );
  }

  async completeRegistration(registrationId: string, password: string): Promise<AuthSession> {
    const dto = await this.client.post<RegisterCompleteResponseDTO>(
      ApiEndpoints.auth.registerComplete(registrationId),
      { password },
    );
    return mapAuthSession(dto.user, dto.tokens);
  }
}
