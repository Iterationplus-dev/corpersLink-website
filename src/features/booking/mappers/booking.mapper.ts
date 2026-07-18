import { formatDeparture, formatShortDate } from '@/core/utils/format-date';
import type {
  Booking,
  BookingDTO,
  Payment,
  PaymentDTO,
  Seat,
  SeatDTO,
  SeatHold,
  SeatHoldResponseDTO,
  Vehicle,
  VehicleDTO,
} from '@/features/booking/types';

export function mapVehicle(dto: VehicleDTO): Vehicle {
  return {
    id: dto.id,
    institutionId: dto.institutionId,
    name: dto.name,
    departureTime: dto.departureTime,
    route: dto.route,
    pickupPoint: dto.pickupPoint,
    destination: dto.destination,
    totalSeats: dto.totalSeats,
    filledSeats: dto.filledSeats,
    heldSeats: dto.heldSeats,
    remainingSeats: dto.remainingSeats,
    fare: dto.fareDisplay,
    status: dto.status,
  };
}

export function mapSeat(dto: SeatDTO): Seat {
  return {
    id: dto.id,
    vehicleId: dto.vehicleId,
    label: dto.label,
    row: dto.row,
    col: dto.col,
    position: dto.position,
    status: dto.status,
    holdExpiresAt: dto.holdExpiresAt ? new Date(dto.holdExpiresAt) : null,
  };
}

export function mapSeatHold(dto: SeatHoldResponseDTO): SeatHold {
  return {
    id: dto.id,
    vehicleId: dto.vehicleId,
    seatId: dto.seatId,
    seatLabel: dto.seatLabel,
    expiresAt: new Date(dto.expiresAt),
    fare: dto.fareDisplay,
  };
}

export function mapPayment(dto: PaymentDTO): Payment {
  return {
    id: dto.id,
    bookingId: dto.bookingId,
    gateway: dto.gateway,
    reference: dto.reference,
    amount: dto.amountDisplay,
    currency: dto.currency,
    status: dto.status,
    failureReason: dto.failureReason,
    paidAt: dto.paidAt ? new Date(dto.paidAt) : null,
  };
}

export function mapBooking(dto: BookingDTO): Booking {
  return {
    id: dto.id,
    reference: dto.reference,
    status: dto.status,
    institutionName: dto.institution?.name ?? null,
    vehicleName: dto.vehicle?.name ?? null,
    route: dto.vehicle?.route ?? null,
    pickupPoint: dto.vehicle?.pickupPoint ?? null,
    seatLabel: dto.seat?.label ?? null,
    seatPosition: dto.seat?.position ?? null,
    departureAtIso: dto.departureAt,
    departureAt: formatDeparture(dto.departureAt),
    fare: dto.fareDisplay,
    passengerName: dto.passengerName,
    stateCode: dto.stateCode,
    callUpNumber: dto.callUpNumber,
    qrPayload: dto.qrPayload,
    paymentMethod: dto.paymentMethod,
    paidAt: dto.paidAt ? formatShortDate(dto.paidAt) : null,
    payment: mapPayment(dto.payment),
  };
}
