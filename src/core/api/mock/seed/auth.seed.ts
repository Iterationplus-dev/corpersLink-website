import type { UserDTO } from '@/features/auth/types';

import type { MockUserRecord } from '../state/mock-db';

/** Builds a real-shaped `UserDTO` from the mock DB's flatter internal record.
 * Institution/notification-preference fields not tracked by `MockUserRecord`
 * get reasonable static demo values. */
export function toUserDTO(record: MockUserRecord): UserDTO {
  return {
    id: 1,
    fullName: record.fullName,
    email: record.email,
    emailVerified: true,
    phone: record.phone,
    avatarUrl: null,
    avatarInitials: record.initials,
    institution: {
      id: 1,
      name: record.institutionName,
      abbreviation: 'UNILAG',
      type: 'federal_university',
      typeLabel: 'Federal University',
      state: 'Lagos',
      status: 'open',
      campDestination: 'Iyana-Ipaja Camp',
      vehicleCount: 3,
      verified: true,
      logoUrl: null,
      isActive: true,
      supportPhone: '0700-CORPERSLINK',
      supportEmail: 'transport@unilag.edu.ng',
      supportHours: 'Mon–Fri, 9 AM–5 PM',
    },
    callUpNumber: record.callUpNumber,
    stateCode: record.stateCode,
    batch: 'B',
    stream: '1',
    twoFactorEnabled: false,
    notificationPreferences: {
      booking_updates: true,
      seat_hold_alerts: true,
      departure_reminders: true,
      trip_changes: true,
      tips_announcements: false,
    },
    emergencyContact: {
      id: 1,
      fullName: record.nextOfKin.fullName,
      relationship: record.nextOfKin.relationship,
      phone: record.nextOfKin.phone,
      alternatePhone: null,
      address: record.nextOfKin.address,
      applyToAllBookings: true,
    },
    lastLoginAt: new Date().toISOString(),
    createdAt: '2026-01-15T12:00:00.000Z',
  };
}
