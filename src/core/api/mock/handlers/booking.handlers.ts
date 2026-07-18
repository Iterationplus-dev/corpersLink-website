import { HttpStatus } from '@/core/constants/http-status';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { formatDeparture } from '@/core/utils/format-date';
import type {
  BookingDTO,
  CreateBookingResponseDTO,
  InitializePaymentResponseDTO,
  PaymentDTO,
  ReceiptResponseDTO,
  SeatDTO,
  SeatHoldResponseDTO,
  SeatPosition,
  SeatStatus,
  VehicleDTO,
  VehicleStatus,
} from '@/features/booking/types';

import { mockRouter } from '../mock-router';
import { mockError, mockNotFoundError, mockSuccess } from '../mock-response';
import {
  bookingsDb,
  FAILING_SEAT_NUMBER,
  getCurrentHold,
  nextBookingId,
  nextBookingReference,
  nextHoldId,
  nextPaymentId,
  paymentsDb,
  seededUser,
  setCurrentHold,
  vehiclesDb,
  type BookingRecord,
  type MockPaymentGateway,
  type PaymentRecord,
} from '../state/mock-db';

const HOLD_DURATION_MS = 15 * 60 * 1000;

function formatNaira(kobo: number): string {
  return `₦${Math.round(kobo / 100).toLocaleString('en-US')}`;
}

function seatLayout(seatNumber: number): { row: number; col: number; position: SeatPosition } {
  const row = Math.floor((seatNumber - 1) / 4);
  const positionInRow = (seatNumber - 1) % 4;
  const col = positionInRow < 2 ? positionInRow : positionInRow + 1;
  const position: SeatPosition = positionInRow === 0 || positionInRow === 3 ? 'window' : 'aisle';
  return { row, col, position };
}

function buildVehicleDTO(vehicle: (typeof vehiclesDb)[number]): VehicleDTO {
  const hold = getCurrentHold();
  const holdIsLive = hold !== null && new Date(hold.expiresAt).getTime() > Date.now();
  const heldByYouCount = holdIsLive && hold?.vehicleId === vehicle.id ? 1 : 0;
  const filled = vehicle.occupiedSeatNumbers.length;
  const held = vehicle.staticHeldSeatNumbers.length + heldByYouCount;
  const remaining = Math.max(0, vehicle.totalSeats - filled - held);
  const status: VehicleStatus =
    remaining <= 0 ? 'full' : remaining <= Math.ceil(vehicle.totalSeats * 0.2) ? 'filling_fast' : 'open';

  return {
    id: vehicle.id,
    institutionId: vehicle.institutionId,
    name: vehicle.name,
    departureTime: formatDeparture(vehicle.departureAtIso),
    departureDate: vehicle.departureAtIso,
    route: `${vehicle.pickupPoint} → ${vehicle.destination}`,
    pickupPoint: vehicle.pickupPoint,
    destination: vehicle.destination,
    totalSeats: vehicle.totalSeats,
    filledSeats: filled,
    heldSeats: held,
    remainingSeats: remaining,
    fareKobo: vehicle.fareKobo,
    fareDisplay: formatNaira(vehicle.fareKobo),
    status,
    isActive: true,
  };
}

function buildSeats(vehicle: (typeof vehiclesDb)[number]): SeatDTO[] {
  const hold = getCurrentHold();
  const holdIsLive = hold !== null && new Date(hold.expiresAt).getTime() > Date.now();
  const seats: SeatDTO[] = [];

  for (let seatNumber = 1; seatNumber <= vehicle.totalSeats; seatNumber += 1) {
    const { row, col, position } = seatLayout(seatNumber);
    let status: SeatStatus = 'available';
    let holdExpiresAt: string | null = null;

    if (vehicle.occupiedSeatNumbers.includes(seatNumber)) {
      status = 'occupied';
    } else if (holdIsLive && hold?.vehicleId === vehicle.id && hold.seatNumber === seatNumber) {
      status = 'held_by_you';
      holdExpiresAt = hold.expiresAt;
    } else if (vehicle.staticHeldSeatNumbers.includes(seatNumber)) {
      status = 'held';
    }

    seats.push({
      id: vehicle.id * 1000 + seatNumber,
      vehicleId: vehicle.id,
      label: String(seatNumber),
      row,
      col,
      position,
      status,
      holdExpiresAt,
    });
  }

  return seats;
}

function buildPaymentDTO(payment: PaymentRecord): PaymentDTO {
  return {
    id: payment.id,
    bookingId: payment.bookingId,
    gateway: payment.gateway,
    reference: payment.reference,
    amountKobo: payment.amountKobo,
    amountDisplay: formatNaira(payment.amountKobo),
    currency: 'NGN',
    status: payment.status,
    failureReason: payment.failureReason,
    paidAt: payment.paidAtIso,
  };
}

function buildBookingDTO(record: BookingRecord, payment: PaymentRecord): BookingDTO {
  const { position } = seatLayout(record.seatNumber);
  return {
    id: record.id,
    reference: record.reference,
    status: record.status,
    institution: { id: record.institutionId, name: record.institutionName },
    vehicle: {
      id: record.vehicleId,
      name: record.vehicleName,
      route: `${record.pickupPoint} → ${record.destination}`,
      pickupPoint: record.pickupPoint,
    },
    seat: { id: record.seatId, label: String(record.seatNumber), position },
    departureAt: record.departureAtIso,
    fareKobo: record.fareKobo,
    fareDisplay: formatNaira(record.fareKobo),
    passengerName: seededUser.fullName,
    stateCode: seededUser.stateCode,
    callUpNumber: seededUser.callUpNumber,
    qrPayload: `${record.reference}|${record.institutionId}|SEAT${record.seatNumber}|${seededUser.stateCode}`,
    paymentMethod: payment.gateway,
    paidAt: payment.paidAtIso,
    payment: buildPaymentDTO(payment),
    createdAt: record.createdAtIso,
  };
}

function findPaymentForBooking(bookingId: number): PaymentRecord {
  const payment = paymentsDb.find((p) => p.bookingId === bookingId);
  if (!payment) throw new Error(`No payment seeded for booking ${bookingId} — fix the mock seed.`);
  return payment;
}

mockRouter.register('get', '/institutions/:institutionId/vehicles', ({ params }) => {
  const institutionId = Number(params.institutionId);
  const vehicles = vehiclesDb.filter((v) => v.institutionId === institutionId).map(buildVehicleDTO);
  return mockSuccess(vehicles);
});

mockRouter.register('get', '/vehicles/:vehicleId/seats', ({ params }) => {
  const vehicle = vehiclesDb.find((v) => v.id === Number(params.vehicleId));
  if (!vehicle) return mockNotFoundError('Vehicle');
  return mockSuccess(buildSeats(vehicle));
});

mockRouter.register('post', '/vehicles/:vehicleId/seats/:seatId/hold', ({ params }) => {
  const vehicleId = Number(params.vehicleId);
  const seatId = Number(params.seatId);
  const vehicle = vehiclesDb.find((v) => v.id === vehicleId);
  if (!vehicle) return mockNotFoundError('Vehicle');

  const seatNumber = seatId - vehicleId * 1000;
  if (seatNumber < 1 || seatNumber > vehicle.totalSeats) return mockNotFoundError('Seat');

  const alreadyTaken =
    vehicle.occupiedSeatNumbers.includes(seatNumber) ||
    vehicle.staticHeldSeatNumbers.includes(seatNumber);
  if (alreadyTaken) {
    const freeSeat = Array.from({ length: vehicle.totalSeats }, (_, i) => i + 1).find(
      (n) => !vehicle.occupiedSeatNumbers.includes(n) && !vehicle.staticHeldSeatNumbers.includes(n),
    );
    return mockError(
      HttpStatus.CONFLICT,
      'That seat was just taken. Please pick another.',
      'seat_unavailable',
      freeSeat ? { suggested_seat_number: [String(freeSeat)] } : undefined,
    );
  }

  // Holding a new seat auto-releases any previous hold — same as the real backend.
  const holdId = nextHoldId();
  const expiresAt = new Date(Date.now() + HOLD_DURATION_MS).toISOString();
  setCurrentHold({ id: holdId, vehicleId, seatId, seatNumber, expiresAt });

  const response: SeatHoldResponseDTO = {
    id: holdId,
    vehicleId,
    seatId,
    seatLabel: String(seatNumber),
    expiresAt,
    secondsRemaining: Math.round(HOLD_DURATION_MS / 1000),
    fareKobo: vehicle.fareKobo,
    fareDisplay: formatNaira(vehicle.fareKobo),
  };
  return mockSuccess(response);
});

mockRouter.register('post', ApiEndpoints.booking.bookings, ({ body }) => {
  const payload = body as { holdId?: unknown } | null;
  const holdId = typeof payload?.holdId === 'number' ? payload.holdId : NaN;

  const hold = getCurrentHold();
  if (!hold || hold.id !== holdId || new Date(hold.expiresAt).getTime() <= Date.now()) {
    return mockError(
      HttpStatus.GONE,
      'This seat hold has expired or does not belong to you.',
      'hold_expired',
    );
  }

  const vehicle = vehiclesDb.find((v) => v.id === hold.vehicleId);
  if (!vehicle) return mockNotFoundError('Vehicle');

  const booking: BookingRecord = {
    id: nextBookingId(),
    reference: nextBookingReference(),
    status: 'pending_payment',
    institutionId: vehicle.institutionId,
    institutionName: seededUser.institutionName,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    pickupPoint: vehicle.pickupPoint,
    destination: vehicle.destination,
    seatId: hold.seatId,
    seatNumber: hold.seatNumber,
    departureAtIso: vehicle.departureAtIso,
    fareKobo: vehicle.fareKobo,
    createdAtIso: new Date().toISOString(),
  };
  bookingsDb.unshift(booking);

  const payment: PaymentRecord = {
    id: nextPaymentId(),
    bookingId: booking.id,
    gateway: null,
    reference: `CL-PAY-${booking.reference.replace('CL-', '')}`,
    amountKobo: vehicle.fareKobo,
    status: 'pending',
    failureReason: null,
    paidAtIso: null,
  };
  paymentsDb.unshift(payment);

  const response: CreateBookingResponseDTO = {
    booking: buildBookingDTO(booking, payment),
    payment: buildPaymentDTO(payment),
  };
  return mockSuccess(response);
});

mockRouter.register('post', '/payments/:paymentId/initialize', ({ params, body }) => {
  const payment = paymentsDb.find((p) => p.id === Number(params.paymentId));
  if (!payment) return mockNotFoundError('Payment');

  const payload = body as { gateway?: unknown } | null;
  const gateway = payload?.gateway as MockPaymentGateway | undefined;
  if (!gateway) return mockError(HttpStatus.UNPROCESSABLE_ENTITY, 'A payment gateway is required.', 'validation_error');
  payment.gateway = gateway;

  const booking = bookingsDb.find((b) => b.id === payment.bookingId);
  const institutionId = booking?.institutionId ?? 1;

  const response: InitializePaymentResponseDTO = {
    authorizationUrl: `${window.location.origin}/book/${institutionId}/pay/return?trxref=${payment.reference}`,
    reference: payment.reference,
  };
  return mockSuccess(response);
});

mockRouter.register('post', '/payments/:paymentId/verify', ({ params }) => {
  const payment = paymentsDb.find((p) => p.id === Number(params.paymentId));
  if (!payment) return mockNotFoundError('Payment');
  const booking = bookingsDb.find((b) => b.id === payment.bookingId);
  if (!booking) return mockNotFoundError('Booking');

  // Deterministic demo hook: this seat always fails payment.
  if (booking.seatNumber === FAILING_SEAT_NUMBER) {
    payment.status = 'failed';
    payment.failureReason = 'Your bank declined the transaction or the network timed out.';
    return mockError(
      HttpStatus.UNPROCESSABLE_ENTITY,
      "Payment didn't go through. Your bank declined the transaction or the network timed out. No booking was made.",
      'payment_failed',
    );
  }

  payment.status = 'successful';
  payment.paidAtIso = new Date().toISOString();
  booking.status = 'confirmed';

  const vehicle = vehiclesDb.find((v) => v.id === booking.vehicleId);
  if (vehicle && !vehicle.occupiedSeatNumbers.includes(booking.seatNumber)) {
    vehicle.occupiedSeatNumbers.push(booking.seatNumber);
  }

  const hold = getCurrentHold();
  if (hold && hold.vehicleId === booking.vehicleId && hold.seatNumber === booking.seatNumber) {
    setCurrentHold(null);
  }

  return mockSuccess(buildBookingDTO(booking, payment));
});

mockRouter.register('get', ApiEndpoints.booking.bookings, () => {
  const dtos = bookingsDb.map((record) => buildBookingDTO(record, findPaymentForBooking(record.id)));
  return mockSuccess(dtos);
});

mockRouter.register('get', '/bookings/:id/receipt', ({ params }) => {
  const booking = bookingsDb.find((b) => b.id === Number(params.id));
  if (!booking) return mockNotFoundError('Booking');
  const payment = findPaymentForBooking(booking.id);
  const dto = buildBookingDTO(booking, payment);
  const response: ReceiptResponseDTO = { booking: dto, qrPayload: dto.qrPayload };
  return mockSuccess(response);
});
