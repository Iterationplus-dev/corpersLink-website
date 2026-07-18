import type {
  BookingStatus,
  PaymentGateway,
  PaymentStatus,
  SeatPosition,
  SeatStatus,
  VehicleStatus,
} from './booking.dto';

export interface Vehicle {
  id: number;
  institutionId: number;
  name: string;
  departureTime: string;
  route: string;
  pickupPoint: string;
  destination: string;
  totalSeats: number;
  filledSeats: number;
  heldSeats: number;
  remainingSeats: number;
  fare: string;
  status: VehicleStatus;
}

export interface Seat {
  id: number;
  vehicleId: number;
  label: string;
  row: number;
  col: number;
  position: SeatPosition;
  status: SeatStatus;
  holdExpiresAt: Date | null;
}

export interface SeatHold {
  id: number;
  vehicleId: number;
  seatId: number;
  seatLabel: string;
  expiresAt: Date;
  fare: string;
}

export interface Payment {
  id: number;
  bookingId: number | null;
  gateway: PaymentGateway | null;
  reference: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  failureReason: string | null;
  paidAt: Date | null;
}

export interface Booking {
  id: number;
  reference: string;
  status: BookingStatus;
  institutionName: string | null;
  vehicleName: string | null;
  route: string | null;
  pickupPoint: string | null;
  seatLabel: string | null;
  seatPosition: SeatPosition | null;
  /** Raw ISO instant — kept alongside the formatted `departureAt` display
   * string for consumers (like the dashboard) that need to do their own date
   * math (days-until-departure, manifest-close cutoff, etc). */
  departureAtIso: string;
  departureAt: string;
  fare: string;
  passengerName: string | null;
  stateCode: string | null;
  callUpNumber: string | null;
  qrPayload: string;
  paymentMethod: PaymentGateway | null;
  paidAt: string | null;
  payment: Payment;
}

/** A seat cell in the rendered grid — `aisle` is a client-only layout marker
 * with no backing seat. */
export interface SeatCell {
  seat: Seat | null;
  status: SeatStatus | 'aisle';
}
