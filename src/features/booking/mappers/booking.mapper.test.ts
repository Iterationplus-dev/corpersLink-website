import { describe, expect, it } from 'vitest';

import type { BookingDTO, PaymentDTO, SeatDTO, SeatHoldResponseDTO, VehicleDTO } from '@/features/booking/types';

import { mapBooking, mapPayment, mapSeat, mapSeatHold, mapVehicle } from './booking.mapper';

describe('mapVehicle', () => {
  it('maps camelCase fields and keeps the pre-formatted departure display', () => {
    const dto: VehicleDTO = {
      id: 1,
      institutionId: 1,
      name: 'Coaster Bus A',
      departureTime: 'Sat 14 Mar · 7:00 AM',
      departureDate: '2026-03-14T07:00:00.000Z',
      route: 'UNILAG Main Gate → Iyana-Ipaja Camp',
      pickupPoint: 'UNILAG Main Gate',
      destination: 'Iyana-Ipaja Camp',
      totalSeats: 40,
      filledSeats: 13,
      heldSeats: 2,
      remainingSeats: 25,
      fareKobo: 450_000,
      fareDisplay: '₦4,500',
      status: 'open',
      isActive: true,
    };

    const model = mapVehicle(dto);

    expect(model.institutionId).toBe(1);
    expect(model.pickupPoint).toBe('UNILAG Main Gate');
    expect(model.remainingSeats).toBe(25);
    expect(model.fare).toBe('₦4,500');
    expect(model.departureTime).toBe('Sat 14 Mar · 7:00 AM');
  });
});

describe('mapSeat', () => {
  it('maps camelCase fields and parses holdExpiresAt when present', () => {
    const dto: SeatDTO = {
      id: 1014,
      vehicleId: 1,
      label: '14',
      row: 3,
      col: 1,
      position: 'window',
      status: 'held_by_you',
      holdExpiresAt: '2026-03-14T07:15:00.000Z',
    };

    const seat = mapSeat(dto);

    expect(seat.status).toBe('held_by_you');
    expect(seat.holdExpiresAt).toEqual(new Date('2026-03-14T07:15:00.000Z'));
  });

  it('leaves holdExpiresAt null for a seat that is not held by you', () => {
    const seat = mapSeat({
      id: 1001,
      vehicleId: 1,
      label: '1',
      row: 0,
      col: 0,
      position: 'window',
      status: 'available',
      holdExpiresAt: null,
    });
    expect(seat.holdExpiresAt).toBeNull();
  });
});

describe('mapSeatHold', () => {
  it('parses expiresAt into a Date instance', () => {
    const dto: SeatHoldResponseDTO = {
      id: 1,
      vehicleId: 1,
      seatId: 1014,
      seatLabel: '14',
      expiresAt: '2026-03-14T07:15:00.000Z',
      secondsRemaining: 900,
      fareKobo: 450_000,
      fareDisplay: '₦4,500',
    };

    const model = mapSeatHold(dto);

    expect(model.id).toBe(1);
    expect(model.seatLabel).toBe('14');
    expect(model.expiresAt).toBeInstanceOf(Date);
    expect(model.expiresAt.toISOString()).toBe('2026-03-14T07:15:00.000Z');
  });
});

describe('mapPayment', () => {
  it('maps camelCase fields and parses paidAt', () => {
    const dto: PaymentDTO = {
      id: 1,
      bookingId: 7,
      gateway: 'paystack',
      reference: 'CL-PAY-ABC123',
      amountKobo: 450_000,
      amountDisplay: '₦4,500',
      currency: 'NGN',
      status: 'successful',
      failureReason: null,
      paidAt: '2026-03-01T10:00:00.000Z',
    };

    const payment = mapPayment(dto);

    expect(payment.gateway).toBe('paystack');
    expect(payment.paidAt).toEqual(new Date('2026-03-01T10:00:00.000Z'));
  });
});

describe('mapBooking', () => {
  it('maps every field to its domain equivalent, formatting dates', () => {
    const dto: BookingDTO = {
      id: 7,
      reference: 'CL-2026-08412',
      status: 'confirmed',
      institution: { id: 1, name: 'University of Lagos' },
      vehicle: { id: 1, name: 'Coaster Bus A', route: 'UNILAG Main Gate → Camp', pickupPoint: 'UNILAG Main Gate' },
      seat: { id: 1014, label: '14', position: 'window' },
      departureAt: '2026-03-14T07:00:00.000Z',
      fareKobo: 450_000,
      fareDisplay: '₦4,500',
      passengerName: 'Adaeze Okafor',
      stateCode: 'LA/26B/0412',
      callUpNumber: 'NYSC/UNILAG/2026/74812',
      qrPayload: 'CL-2026-08412|1|SEAT14|LA/26B/0412',
      paymentMethod: 'paystack',
      paidAt: '2026-03-01T10:00:00.000Z',
      payment: {
        id: 1,
        bookingId: 7,
        gateway: 'paystack',
        reference: 'CL-PAY-ABC123',
        amountKobo: 450_000,
        amountDisplay: '₦4,500',
        currency: 'NGN',
        status: 'successful',
        failureReason: null,
        paidAt: '2026-03-01T10:00:00.000Z',
      },
      createdAt: '2026-02-01T10:00:00.000Z',
    };

    const model = mapBooking(dto);

    expect(model.id).toBe(7);
    expect(model.reference).toBe('CL-2026-08412');
    expect(model.passengerName).toBe('Adaeze Okafor');
    expect(model.callUpNumber).toBe('NYSC/UNILAG/2026/74812');
    expect(model.seatLabel).toBe('14');
    expect(model.institutionName).toBe('University of Lagos');
    expect(model.paidAt).not.toBeNull();
    expect(model.payment.gateway).toBe('paystack');
  });

  it('handles null institution/vehicle/seat relations', () => {
    const dto: BookingDTO = {
      id: 8,
      reference: 'CL-2026-08413',
      status: 'pending_payment',
      institution: null,
      vehicle: null,
      seat: null,
      departureAt: '2026-03-14T07:00:00.000Z',
      fareKobo: 450_000,
      fareDisplay: '₦4,500',
      passengerName: null,
      stateCode: null,
      callUpNumber: null,
      qrPayload: '',
      paymentMethod: null,
      paidAt: null,
      payment: {
        id: 2,
        bookingId: 8,
        gateway: null,
        reference: 'CL-PAY-DEF456',
        amountKobo: 450_000,
        amountDisplay: '₦4,500',
        currency: 'NGN',
        status: 'pending',
        failureReason: null,
        paidAt: null,
      },
      createdAt: '2026-02-01T10:00:00.000Z',
    };

    const model = mapBooking(dto);
    expect(model.institutionName).toBeNull();
    expect(model.seatLabel).toBeNull();
    expect(model.paidAt).toBeNull();
  });
});
