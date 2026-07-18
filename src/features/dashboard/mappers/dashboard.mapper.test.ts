import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { User } from '@/features/auth/types';
import type { Booking } from '@/features/booking/types';

import { buildDashboardContent } from './dashboard.mapper';

const user: User = {
  id: 1,
  fullName: 'Adaeze Okafor',
  email: 'adaeze.o@gmail.com',
  emailVerified: true,
  phone: '0803',
  avatarUrl: null,
  avatarInitials: 'AO',
  institution: {
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
    supportPhone: null,
    supportEmail: null,
    supportHours: null,
  },
  callUpNumber: 'NYSC/UNILAG/2026/74812',
  stateCode: 'LA/26B/0412',
  batch: 'B',
  stream: '1',
  twoFactorEnabled: false,
  notificationPreferences: {
    bookingUpdates: true,
    seatHoldAlerts: true,
    departureReminders: true,
    tripChanges: true,
    tipsAnnouncements: false,
  },
  emergencyContact: null,
  lastLoginAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

function makeBooking(overrides: Partial<Booking> & { id: number }): Booking {
  return {
    reference: `CL-2026-${overrides.id}`,
    status: 'confirmed',
    institutionName: 'University of Lagos',
    vehicleName: 'Coaster Bus A',
    route: 'UNILAG Main Gate → Iyana-Ipaja Camp',
    pickupPoint: 'UNILAG Main Gate',
    seatLabel: '14',
    seatPosition: 'window',
    departureAtIso: '2026-03-14T07:00:00.000Z',
    departureAt: 'Sat 14 Mar · 7:00 AM',
    fare: '₦4,500',
    passengerName: 'Adaeze Okafor',
    stateCode: 'LA/26B/0412',
    callUpNumber: 'NYSC/UNILAG/2026/74812',
    qrPayload: 'CL-2026-1|1|SEAT14|LA/26B/0412',
    paymentMethod: 'paystack',
    paidAt: '01 Mar 2026',
    payment: {
      id: 1,
      bookingId: overrides.id,
      gateway: 'paystack',
      reference: 'CL-PAY-1',
      amount: '₦4,500',
      currency: 'NGN',
      status: 'successful',
      failureReason: null,
      paidAt: new Date('2026-03-01T10:00:00.000Z'),
    },
    ...overrides,
  };
}

describe('buildDashboardContent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-02T07:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('picks the confirmed booking as the upcoming trip and derives its labels', () => {
    const bookings = [
      makeBooking({ id: 1, status: 'confirmed' }),
      makeBooking({ id: 2, status: 'expired', seatLabel: '2' }),
    ];

    const content = buildDashboardContent(user, bookings);

    expect(content.fullName).toBe('Adaeze Okafor');
    expect(content.meta).toBe('LA/26B/0412 · University of Lagos · Batch B, Stream 1');
    expect(content.upcomingTrip?.seatLabel).toBe('14');
    expect(content.upcomingTrip?.departureDateLabel).toBe('Sat, 14 Mar 2026');
    expect(content.upcomingTrip?.daysUntilDeparture).toBe(12);
    expect(content.upcomingTrip?.countdownLabel).toBe('12 days');
    expect(content.manifestClosesAt).toContain('13 Mar');
  });

  it('includes every booking in history with a derived status label/color', () => {
    const bookings = [
      makeBooking({ id: 1, status: 'confirmed' }),
      makeBooking({ id: 2, status: 'expired' }),
    ];

    const content = buildDashboardContent(user, bookings);

    expect(content.history).toHaveLength(2);
    expect(content.history[0]?.statusLabel).toBe('CONFIRMED');
    expect(content.history[0]?.statusColor.fg).toBe('#16815A');
    expect(content.history[1]?.statusLabel).toBe('EXPIRED');
  });

  it('has no upcoming trip when nothing is confirmed', () => {
    const content = buildDashboardContent(user, [makeBooking({ id: 1, status: 'expired' })]);

    expect(content.upcomingTrip).toBeNull();
    expect(content.manifestClosesAt).toBeNull();
    expect(content.history).toHaveLength(1);
  });

  it('handles a user with no bookings at all', () => {
    const content = buildDashboardContent(user, []);
    expect(content.upcomingTrip).toBeNull();
    expect(content.history).toEqual([]);
  });
});
