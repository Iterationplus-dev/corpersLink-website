import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { BookingDTO, SeatHoldResponseDTO } from '@/features/booking/types';

import { BookingRepository } from './booking.repository.impl';

function createFakeClient(overrides: Partial<ApiClient> = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

const bookingDTO: BookingDTO = {
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
  callUpNumber: 'NYSC/1',
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

describe('BookingRepository', () => {
  it('holdSeat posts to the vehicle/seat-scoped endpoint with no body and maps the hold', async () => {
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
    const post = vi.fn().mockResolvedValue(dto);
    const repository = new BookingRepository(createFakeClient({ post }));

    const hold = await repository.holdSeat(1, 1014);

    expect(post).toHaveBeenCalledWith(ApiEndpoints.booking.hold(1, 1014));
    expect(hold.id).toBe(1);
    expect(hold.expiresAt).toBeInstanceOf(Date);
  });

  it('createBooking posts the holdId and maps the resulting booking + payment', async () => {
    const post = vi.fn().mockResolvedValue({
      booking: bookingDTO,
      payment: bookingDTO.payment,
    });
    const repository = new BookingRepository(createFakeClient({ post }));

    const { booking, payment } = await repository.createBooking(1);

    expect(post).toHaveBeenCalledWith(ApiEndpoints.booking.bookings, { holdId: 1 });
    expect(booking.reference).toBe('CL-2026-08412');
    expect(payment.gateway).toBe('paystack');
  });

  it('initializePayment posts the gateway to the payment-scoped endpoint', async () => {
    const post = vi.fn().mockResolvedValue({ authorizationUrl: 'https://pay.example/x', reference: 'ref_1' });
    const repository = new BookingRepository(createFakeClient({ post }));

    const result = await repository.initializePayment(1, 'paystack');

    expect(post).toHaveBeenCalledWith(ApiEndpoints.booking.paymentInitialize(1), { gateway: 'paystack' });
    expect(result.authorizationUrl).toBe('https://pay.example/x');
  });

  it('verifyPayment posts the optional reference and maps the confirmed booking', async () => {
    const post = vi.fn().mockResolvedValue(bookingDTO);
    const repository = new BookingRepository(createFakeClient({ post }));

    const booking = await repository.verifyPayment(1, 'trxref_1');

    expect(post).toHaveBeenCalledWith(ApiEndpoints.booking.paymentVerify(1), { reference: 'trxref_1' });
    expect(booking.status).toBe('confirmed');
  });

  it('getVehicles fetches vehicles scoped to the institution', async () => {
    const get = vi.fn().mockResolvedValue([]);
    const repository = new BookingRepository(createFakeClient({ get }));

    await repository.getVehicles(1);

    expect(get).toHaveBeenCalledWith(ApiEndpoints.booking.vehicles(1));
  });

  it('getReceipt fetches the receipt endpoint scoped to the booking id', async () => {
    const get = vi.fn().mockResolvedValue({ booking: bookingDTO, qrPayload: bookingDTO.qrPayload });
    const repository = new BookingRepository(createFakeClient({ get }));

    const receipt = await repository.getReceipt(7);

    expect(get).toHaveBeenCalledWith(ApiEndpoints.booking.receipt(7));
    expect(receipt.qrPayload).toBe(bookingDTO.qrPayload);
  });
});
