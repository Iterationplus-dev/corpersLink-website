export interface UserInstitution {
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

export interface NextOfKin {
  id: number | null;
  fullName: string | null;
  relationship: string | null;
  phone: string | null;
  alternatePhone: string | null;
  address: string | null;
  applyToAllBookings: boolean | null;
}

export interface NotificationPreferences {
  bookingUpdates: boolean;
  seatHoldAlerts: boolean;
  departureReminders: boolean;
  tripChanges: boolean;
  tipsAnnouncements: boolean;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  avatarUrl: string | null;
  avatarInitials: string;
  institution: UserInstitution | null;
  callUpNumber: string | null;
  stateCode: string | null;
  batch: string | null;
  stream: string | null;
  twoFactorEnabled: boolean;
  notificationPreferences: NotificationPreferences;
  emergencyContact: NextOfKin | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}

/** Only `accessToken` is persisted — see `token-storage.ts` and
 * `auth.store.ts` for why `refreshToken`/`expiresIn` aren't kept. */
export interface AuthSession {
  accessToken: string;
  user: User;
}

/** Result of `POST auth/login` — either a session, or (unsupported today) a
 * 2FA challenge. */
export type LoginResult =
  | { requiresTwoFactor: true; challengeToken: string }
  | { requiresTwoFactor: false; session: AuthSession };
