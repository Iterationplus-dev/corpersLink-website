import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useBookingStore } from './booking.store';

const HOLD = {
  institutionId: 1,
  vehicleId: 1,
  vehicleName: 'Coaster Bus A',
  route: 'UNILAG Main Gate → Iyana-Ipaja Camp',
  pickupPoint: 'UNILAG Main Gate',
  departureTime: 'Sat 14 Mar · 7:00 AM',
  fare: '₦4,500',
  holdId: 1,
  seatId: 1014,
  seatLabel: '14',
  seatRow: 3,
  seatPosition: 'window' as const,
};

describe('useBookingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('starts with no active hold', () => {
    const store = useBookingStore();
    expect(store.hasActiveHold).toBe(false);
    expect(store.isHoldExpired).toBe(false);
  });

  it('hasActiveHold is true while expiresAt is in the future', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const store = useBookingStore();

    store.setHold({ ...HOLD, expiresAt: new Date('2026-01-01T00:15:00.000Z').toISOString() });

    expect(store.hasActiveHold).toBe(true);
    expect(store.isHoldExpired).toBe(false);
    vi.useRealTimers();
  });

  it('flips to expired once expiresAt is in the past', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const store = useBookingStore();
    store.setHold({ ...HOLD, expiresAt: new Date('2026-01-01T00:15:00.000Z').toISOString() });

    vi.setSystemTime(new Date('2026-01-01T00:15:01.000Z'));

    expect(store.hasActiveHold).toBe(false);
    expect(store.isHoldExpired).toBe(true);
    vi.useRealTimers();
  });

  it('setBooking records the created booking/payment ids', () => {
    const store = useBookingStore();
    store.setHold({ ...HOLD, expiresAt: new Date().toISOString() });

    store.setBooking(42, 99);

    expect(store.bookingId).toBe(42);
    expect(store.paymentId).toBe(99);
  });

  it('setHold clears any previous booking/payment ids (a fresh hold means a fresh booking)', () => {
    const store = useBookingStore();
    store.setHold({ ...HOLD, expiresAt: new Date().toISOString() });
    store.setBooking(42, 99);

    store.setHold({ ...HOLD, holdId: 2, expiresAt: new Date().toISOString() });

    expect(store.bookingId).toBeNull();
    expect(store.paymentId).toBeNull();
  });

  it('clear() resets the hold fields but keeps the chosen payment method', () => {
    const store = useBookingStore();
    store.setHold({ ...HOLD, expiresAt: new Date().toISOString() });
    store.setPaymentMethod('monnify');

    store.clear();

    expect(store.holdId).toBeNull();
    expect(store.seatId).toBeNull();
    expect(store.institutionId).toBeNull();
    expect(store.paymentMethod).toBe('monnify');
  });

  it('setPaymentMethod updates the selected gateway', () => {
    const store = useBookingStore();
    expect(store.paymentMethod).toBe('paystack');
    store.setPaymentMethod('flutterwave');
    expect(store.paymentMethod).toBe('flutterwave');
  });
});
