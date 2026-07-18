export type VehicleStatus = 'open' | 'filling_fast' | 'full';

export interface VehicleDTO {
  id: number;
  institutionId: number;
  name: string;
  /** Pre-formatted display string, e.g. "Tue 14 Jul · 7:00 AM". */
  departureTime: string;
  departureDate: string;
  route: string;
  pickupPoint: string;
  destination: string;
  totalSeats: number;
  filledSeats: number;
  heldSeats: number;
  remainingSeats: number;
  fareKobo: number;
  fareDisplay: string;
  status: VehicleStatus;
  isActive: boolean;
}

/** No "selected" status exists server-side — that's pure client UI state
 * (see `SeatCell` in the model) layered on top of `held_by_you`. */
export type SeatStatus = 'available' | 'held' | 'held_by_you' | 'occupied';
export type SeatPosition = 'window' | 'aisle';

export interface SeatDTO {
  id: number;
  vehicleId: number;
  label: string;
  row: number;
  col: number;
  position: SeatPosition;
  status: SeatStatus;
  /** Only non-null when `status === 'held_by_you'`. */
  holdExpiresAt: string | null;
}

export interface SeatHoldResponseDTO {
  id: number;
  vehicleId: number;
  seatId: number;
  seatLabel: string;
  expiresAt: string;
  secondsRemaining: number;
  fareKobo: number;
  fareDisplay: string;
}

export interface CreateBookingRequestDTO {
  holdId: number;
}

export type BookingStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'expired';
export type PaymentGateway = 'paystack' | 'flutterwave' | 'monnify';
export type PaymentStatus = 'pending' | 'successful' | 'failed';

export interface PaymentDTO {
  id: number;
  bookingId: number | null;
  gateway: PaymentGateway | null;
  reference: string;
  amountKobo: number;
  amountDisplay: string;
  currency: string;
  status: PaymentStatus;
  failureReason: string | null;
  paidAt: string | null;
}

export interface BookingDTO {
  id: number;
  reference: string;
  status: BookingStatus;
  institution: { id: number; name: string } | null;
  vehicle: { id: number; name: string; route: string; pickupPoint: string } | null;
  seat: { id: number; label: string; position: SeatPosition } | null;
  departureAt: string;
  fareKobo: number;
  fareDisplay: string;
  passengerName: string | null;
  stateCode: string | null;
  callUpNumber: string | null;
  qrPayload: string;
  paymentMethod: PaymentGateway | null;
  paidAt: string | null;
  payment: PaymentDTO;
  createdAt: string;
}

export interface CreateBookingResponseDTO {
  booking: BookingDTO;
  payment: PaymentDTO;
}

export interface ReceiptResponseDTO {
  booking: BookingDTO;
  qrPayload: string;
}

export interface InitializePaymentRequestDTO {
  gateway: PaymentGateway;
}

export interface InitializePaymentResponseDTO {
  authorizationUrl: string;
  reference: string;
}

export interface VerifyPaymentRequestDTO {
  reference?: string;
}
