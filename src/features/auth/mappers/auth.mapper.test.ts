import { describe, expect, it } from 'vitest';

import type { AuthTokensDTO, NextOfKinDTO, UserDTO, UserInstitutionDTO } from '@/features/auth/types';

import { mapAuthSession, mapNextOfKin, mapUser, mapUserInstitution } from './auth.mapper';

const institutionDTO: UserInstitutionDTO = {
  id: 1,
  name: 'University of Lagos',
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
};

const nextOfKinDTO: NextOfKinDTO = {
  id: 5,
  fullName: 'Chinedu Okafor',
  relationship: 'Brother',
  phone: '0805',
  alternatePhone: null,
  address: 'Lagos',
  applyToAllBookings: true,
};

const userDTO: UserDTO = {
  id: 42,
  fullName: 'Adaeze Okafor',
  email: 'adaeze.o@gmail.com',
  emailVerified: true,
  phone: '0803 412 8890',
  avatarUrl: null,
  avatarInitials: 'AO',
  institution: institutionDTO,
  callUpNumber: 'NYSC/UNILAG/2026/74812',
  stateCode: 'LA/26B/0412',
  batch: 'B',
  stream: '1',
  twoFactorEnabled: false,
  notificationPreferences: {
    booking_updates: true,
    seat_hold_alerts: true,
    departure_reminders: false,
    trip_changes: true,
    tips_announcements: false,
  },
  emergencyContact: nextOfKinDTO,
  lastLoginAt: '2026-07-01T09:00:00.000Z',
  createdAt: '2026-01-15T12:00:00.000Z',
};

describe('mapUserInstitution', () => {
  it('maps every field through unchanged (already camelCase on the wire)', () => {
    expect(mapUserInstitution(institutionDTO)).toEqual(institutionDTO);
  });
});

describe('mapNextOfKin', () => {
  it('maps every field through unchanged', () => {
    expect(mapNextOfKin(nextOfKinDTO)).toEqual(nextOfKinDTO);
  });

  it('preserves an all-null next-of-kin object (no emergency contact set)', () => {
    const empty: NextOfKinDTO = {
      id: null,
      fullName: null,
      relationship: null,
      phone: null,
      alternatePhone: null,
      address: null,
      applyToAllBookings: null,
    };
    expect(mapNextOfKin(empty)).toEqual(empty);
  });
});

describe('mapUser', () => {
  it('maps camelCase DTO fields to the domain model, parsing dates and nested resources', () => {
    const user = mapUser(userDTO);

    expect(user.id).toBe(42);
    expect(user.fullName).toBe('Adaeze Okafor');
    expect(user.institution).toEqual(institutionDTO);
    expect(user.emergencyContact).toEqual(nextOfKinDTO);
    expect(user.lastLoginAt).toEqual(new Date('2026-07-01T09:00:00.000Z'));
    expect(user.createdAt).toEqual(new Date('2026-01-15T12:00:00.000Z'));
  });

  it('groups the snake_case notificationPreferences into camelCase', () => {
    const user = mapUser(userDTO);
    expect(user.notificationPreferences).toEqual({
      bookingUpdates: true,
      seatHoldAlerts: true,
      departureReminders: false,
      tripChanges: true,
      tipsAnnouncements: false,
    });
  });

  it('handles a user with no institution and no emergency contact', () => {
    const user = mapUser({ ...userDTO, institution: null, emergencyContact: null, lastLoginAt: null });
    expect(user.institution).toBeNull();
    expect(user.emergencyContact).toBeNull();
    expect(user.lastLoginAt).toBeNull();
  });
});

describe('mapAuthSession', () => {
  it('keeps only the access token alongside the mapped user', () => {
    const tokens: AuthTokensDTO = {
      accessToken: 'tok_123',
      refreshToken: 'tok_123',
      expiresIn: 31536000,
    };
    const session = mapAuthSession(userDTO, tokens);

    expect(session.accessToken).toBe('tok_123');
    expect(session.user.fullName).toBe('Adaeze Okafor');
  });
});
