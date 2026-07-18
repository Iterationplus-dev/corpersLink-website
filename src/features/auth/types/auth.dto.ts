/** Nested institution shape as returned inside `UserDTO.institution`. */
export interface UserInstitutionDTO {
  id: number;
  name: string;
  abbreviation: string | null;
  type: string;
  typeLabel: string;
  state: string;
  status: 'open' | 'full';
  campDestination: string | null;
  vehicleCount: number;
  verified: boolean;
  logoUrl: string | null;
  isActive: boolean;
  supportPhone: string | null;
  supportEmail: string | null;
  supportHours: string | null;
}

/** Always present with every key, even when the user has no next-of-kin set
 * (the backend returns an all-null object, not a 404 or omitted field). */
export interface NextOfKinDTO {
  id: number | null;
  fullName: string | null;
  relationship: string | null;
  phone: string | null;
  alternatePhone: string | null;
  address: string | null;
  applyToAllBookings: boolean | null;
}

/** The one part of `UserDTO` the backend does NOT camelCase. */
export interface NotificationPreferencesDTO {
  booking_updates: boolean;
  seat_hold_alerts: boolean;
  departure_reminders: boolean;
  trip_changes: boolean;
  tips_announcements: boolean;
}

export interface UserDTO {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  avatarUrl: string | null;
  avatarInitials: string;
  institution: UserInstitutionDTO | null;
  callUpNumber: string | null;
  stateCode: string | null;
  batch: string | null;
  stream: string | null;
  twoFactorEnabled: boolean;
  notificationPreferences: NotificationPreferencesDTO;
  emergencyContact: NextOfKinDTO | null;
  lastLoginAt: string | null;
  createdAt: string;
}

/**
 * `accessToken`/`refreshToken` are the same opaque Sanctum token under the
 * hood, and `expiresIn` is a fixed 365-day constant, not a real TTL — see
 * `auth.store.ts` for how this is handled.
 */
export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequestDTO {
  identifier: string;
  password: string;
}

/** `POST auth/login` is a discriminated union: 2FA-enabled accounts get a
 * challenge instead of a session. No current user has 2FA enabled and there
 * is no UI for it yet — `auth.store.ts`'s `login()` throws a clear error if
 * this branch is ever hit rather than silently mishandling it. */
export type LoginResponseDTO =
  | { requiresTwoFactor: true; challengeToken: string; expiresIn: number }
  | { requiresTwoFactor: false; user: UserDTO; tokens: AuthTokensDTO };

export interface TwoFactorVerifyRequestDTO {
  challengeToken: string;
  code: string;
}

export interface TwoFactorVerifyResponseDTO {
  user: UserDTO;
  tokens: AuthTokensDTO;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ForgotPasswordResponseDTO {
  otpExpiresAt: string;
}

export interface ResetPasswordRequestDTO {
  email: string;
  code: string;
  newPassword: string;
}

export interface RegisterStartRequestDTO {
  fullName: string;
  acceptedTerms: boolean;
  email: string;
  phone: string;
}

export interface RegisterStartResponseDTO {
  registrationId: string;
  otpExpiresAt: string;
}

export interface OtpVerifyRequestDTO {
  registrationId: string;
  code: string;
}

export type OtpResendContext = 'register' | 'reset_password' | 'change_email';

export interface OtpResendRequestDTO {
  context: OtpResendContext;
  registrationId?: string;
  email?: string;
}

export interface OtpResendResponseDTO {
  otpExpiresAt: string;
}

export interface RegisterSchoolRequestDTO {
  institutionId: number;
  callUpNumber: string;
  stateCode?: string;
  batch: string;
  stream: string;
}

export interface RegisterSchoolResponseDTO {
  callUpNumberVerified: boolean;
}

export interface RegisterNextOfKinRequestDTO {
  emergencyContact: {
    fullName: string;
    relationship: string;
    phone: string;
    alternatePhone?: string;
    address: string;
    applyToAllBookings?: boolean;
  };
}

export interface RegisterNextOfKinResponseDTO {
  accepted: boolean;
}

export interface RegisterCompleteRequestDTO {
  password: string;
}

export interface RegisterCompleteResponseDTO {
  user: UserDTO;
  tokens: AuthTokensDTO;
}
