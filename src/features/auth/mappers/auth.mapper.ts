import type {
  AuthSession,
  AuthTokensDTO,
  NextOfKin,
  NextOfKinDTO,
  NotificationPreferences,
  NotificationPreferencesDTO,
  User,
  UserDTO,
  UserInstitution,
  UserInstitutionDTO,
} from '@/features/auth/types';

export function mapUserInstitution(dto: UserInstitutionDTO): UserInstitution {
  return {
    id: dto.id,
    name: dto.name,
    abbreviation: dto.abbreviation,
    type: dto.type,
    typeLabel: dto.typeLabel,
    state: dto.state,
    status: dto.status,
    campDestination: dto.campDestination,
    vehicleCount: dto.vehicleCount,
    verified: dto.verified,
    logoUrl: dto.logoUrl,
    isActive: dto.isActive,
    supportPhone: dto.supportPhone,
    supportEmail: dto.supportEmail,
    supportHours: dto.supportHours,
  };
}

export function mapNextOfKin(dto: NextOfKinDTO): NextOfKin {
  return {
    id: dto.id,
    fullName: dto.fullName,
    relationship: dto.relationship,
    phone: dto.phone,
    alternatePhone: dto.alternatePhone,
    address: dto.address,
    applyToAllBookings: dto.applyToAllBookings,
  };
}

function mapNotificationPreferences(
  dto: NotificationPreferencesDTO,
): NotificationPreferences {
  return {
    bookingUpdates: dto.booking_updates,
    seatHoldAlerts: dto.seat_hold_alerts,
    departureReminders: dto.departure_reminders,
    tripChanges: dto.trip_changes,
    tipsAnnouncements: dto.tips_announcements,
  };
}

export function mapUser(dto: UserDTO): User {
  return {
    id: dto.id,
    fullName: dto.fullName,
    email: dto.email,
    emailVerified: dto.emailVerified,
    phone: dto.phone,
    avatarUrl: dto.avatarUrl,
    avatarInitials: dto.avatarInitials,
    institution: dto.institution ? mapUserInstitution(dto.institution) : null,
    callUpNumber: dto.callUpNumber,
    stateCode: dto.stateCode,
    batch: dto.batch,
    stream: dto.stream,
    twoFactorEnabled: dto.twoFactorEnabled,
    notificationPreferences: mapNotificationPreferences(dto.notificationPreferences),
    emergencyContact: dto.emergencyContact ? mapNextOfKin(dto.emergencyContact) : null,
    lastLoginAt: dto.lastLoginAt ? new Date(dto.lastLoginAt) : null,
    createdAt: new Date(dto.createdAt),
  };
}

/** Only `tokens.accessToken` survives into the domain model — see
 * `AuthSession`'s doc comment for why. */
export function mapAuthSession(user: UserDTO, tokens: AuthTokensDTO): AuthSession {
  return { accessToken: tokens.accessToken, user: mapUser(user) };
}
