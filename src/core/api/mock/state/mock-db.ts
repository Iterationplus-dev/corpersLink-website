/**
 * In-memory, module-scoped state for stateful mock flows (registration,
 * seat holds, bookings). Resets on full page reload — that's an accepted
 * limitation of a client-only mock backend, documented in the README.
 */

export interface MockUserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  initials: string;
  institutionName: string;
  stateCode: string;
  callUpNumber: string;
  batchStream: string;
  nextOfKin: {
    fullName: string;
    relationship: string;
    phone: string;
    address: string;
  };
}

export const seededUser: MockUserRecord = {
  id: 'user_adaeze',
  fullName: 'Adaeze Okafor',
  email: 'adaeze.o@gmail.com',
  phone: '0803 412 8890',
  initials: 'AO',
  institutionName: 'University of Lagos',
  stateCode: 'LA/26B/0412',
  callUpNumber: 'NYSC/UNILAG/2026/74812',
  batchStream: 'Batch B, Stream 1',
  nextOfKin: {
    fullName: 'Chinedu Okafor',
    relationship: 'Brother',
    phone: '0805 221 0374',
    address: '14 Adeola Close, Surulere, Lagos',
  },
};

interface RegistrationDraft {
  fullName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  institutionId?: number;
  stateCode?: string;
  callUpNumber?: string;
  batch?: string;
  stream?: string;
  nextOfKin?: {
    fullName: string;
    relationship: string;
    phone: string;
    alternatePhone?: string;
    address: string;
    applyToAllBookings?: boolean;
  };
}

export const registrationDrafts = new Map<string, RegistrationDraft>();

export interface VehicleRecord {
  id: number;
  institutionId: number;
  name: string;
  /** Raw ISO instant — the real backend's VehicleResource formats a display
   * string server-side too, which the mock derives from this at request time. */
  departureAtIso: string;
  pickupPoint: string;
  destination: string;
  fareKobo: number;
  totalSeats: number;
  /** Seats with a confirmed booking. */
  occupiedSeatNumbers: number[];
  /** Demo seats always shown "held by someone else" for visual variety —
   * distinct from `currentHold`, which is the single mock user's own hold. */
  staticHeldSeatNumbers: number[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Keeps demo departures a realistic ~N days out no matter when the app is opened. */
function daysFromNowAt7am(days: number): string {
  const date = new Date(Date.now() + days * DAY_MS);
  date.setUTCHours(7, 0, 0, 0);
  return date.toISOString();
}

export const vehiclesDb: VehicleRecord[] = [
  {
    id: 1,
    institutionId: 1,
    name: 'Coaster Bus A',
    departureAtIso: daysFromNowAt7am(12),
    pickupPoint: 'UNILAG Main Gate',
    destination: 'Iyana-Ipaja Camp',
    fareKobo: 450_000,
    totalSeats: 40,
    occupiedSeatNumbers: [2, 5, 6, 9, 11, 16, 19, 23, 27, 30, 34, 36, 40],
    staticHeldSeatNumbers: [7, 21],
  },
  {
    id: 2,
    institutionId: 1,
    name: 'Coaster Bus B',
    departureAtIso: daysFromNowAt7am(12).replace('07:00', '07:30'),
    pickupPoint: 'UNILAG Main Gate',
    destination: 'Iyana-Ipaja Camp',
    fareKobo: 450_000,
    totalSeats: 40,
    occupiedSeatNumbers: [1, 4, 10, 15, 20, 25, 31],
    staticHeldSeatNumbers: [12],
  },
  {
    id: 3,
    institutionId: 1,
    name: 'Hiace Shuttle C',
    departureAtIso: daysFromNowAt7am(12).replace('07:00', '06:30'),
    pickupPoint: 'Faculty of Arts',
    destination: 'Iyana-Ipaja Camp',
    fareKobo: 400_000,
    totalSeats: 18,
    occupiedSeatNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18],
    staticHeldSeatNumbers: [],
  },
  {
    id: 4,
    institutionId: 2,
    name: 'Coaster Bus A',
    departureAtIso: daysFromNowAt7am(12),
    pickupPoint: 'LASU Main Gate',
    destination: 'Iyana-Ipaja Camp',
    fareKobo: 420_000,
    totalSeats: 40,
    occupiedSeatNumbers: [3, 8, 14, 22, 29],
    staticHeldSeatNumbers: [17],
  },
  {
    id: 5,
    institutionId: 3,
    name: 'Coaster Bus A',
    departureAtIso: daysFromNowAt7am(12),
    pickupPoint: 'Yabatech Main Gate',
    destination: 'Iyana-Ipaja Camp',
    fareKobo: 380_000,
    totalSeats: 40,
    occupiedSeatNumbers: Array.from({ length: 32 }, (_, i) => i + 1),
    staticHeldSeatNumbers: [33, 34],
  },
  {
    id: 6,
    institutionId: 4,
    name: 'Coaster Bus A',
    departureAtIso: daysFromNowAt7am(12),
    pickupPoint: 'UI Main Gate',
    destination: 'Iyana-Ipaja Camp',
    fareKobo: 500_000,
    totalSeats: 40,
    occupiedSeatNumbers: [2, 6, 9, 13, 18, 24, 28, 33, 37],
    staticHeldSeatNumbers: [11],
  },
];

/** The one active hold, mirroring the real backend's one-hold-per-user
 * constraint — this mock has exactly one (seeded) user. */
export interface HoldRecord {
  id: number;
  vehicleId: number;
  seatId: number;
  seatNumber: number;
  expiresAt: string;
}

let currentHoldState: HoldRecord | null = null;
export function getCurrentHold(): HoldRecord | null {
  return currentHoldState;
}
export function setCurrentHold(hold: HoldRecord | null): void {
  currentHoldState = hold;
}

export type MockPaymentGateway = 'paystack' | 'flutterwave' | 'monnify';
export type MockBookingStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'expired';
export type MockPaymentStatus = 'pending' | 'successful' | 'failed';

export interface BookingRecord {
  id: number;
  reference: string;
  status: MockBookingStatus;
  institutionId: number;
  institutionName: string;
  vehicleId: number;
  vehicleName: string;
  pickupPoint: string;
  destination: string;
  seatId: number;
  seatNumber: number;
  departureAtIso: string;
  fareKobo: number;
  createdAtIso: string;
}

export interface PaymentRecord {
  id: number;
  bookingId: number;
  gateway: MockPaymentGateway | null;
  reference: string;
  amountKobo: number;
  status: MockPaymentStatus;
  failureReason: string | null;
  paidAtIso: string | null;
}

export const bookingsDb: BookingRecord[] = [
  {
    id: 1,
    reference: 'CL-2026-08412',
    status: 'confirmed',
    institutionId: 1,
    institutionName: 'University of Lagos',
    vehicleId: 1,
    vehicleName: 'Coaster Bus A',
    pickupPoint: 'UNILAG Main Gate',
    destination: 'Iyana-Ipaja Camp',
    seatId: 1014,
    seatNumber: 14,
    departureAtIso: daysFromNowAt7am(12),
    fareKobo: 450_000,
    createdAtIso: daysFromNowAt7am(-15),
  },
  {
    id: 2,
    reference: 'CL-2025-99114',
    status: 'confirmed',
    institutionId: 1,
    institutionName: 'University of Lagos',
    vehicleId: 1,
    vehicleName: 'Coaster Bus A',
    pickupPoint: 'UNILAG Main Gate',
    destination: 'Iyana-Ipaja Camp',
    seatId: 1008,
    seatNumber: 8,
    departureAtIso: '2026-01-12T07:00:00.000Z',
    fareKobo: 400_000,
    createdAtIso: '2025-12-20T10:00:00.000Z',
  },
];

export const paymentsDb: PaymentRecord[] = [
  {
    id: 1,
    bookingId: 1,
    gateway: 'paystack',
    reference: 'CL-PAY-SEED0001',
    amountKobo: 450_000,
    status: 'successful',
    failureReason: null,
    paidAtIso: daysFromNowAt7am(-15),
  },
  {
    id: 2,
    bookingId: 2,
    gateway: 'monnify',
    reference: 'CL-PAY-SEED0002',
    amountKobo: 400_000,
    status: 'successful',
    failureReason: null,
    paidAtIso: '2025-12-20T10:00:00.000Z',
  },
];

let bookingIdCounter = 100;
export function nextBookingId(): number {
  bookingIdCounter += 1;
  return bookingIdCounter;
}

let paymentIdCounter = 500;
export function nextPaymentId(): number {
  paymentIdCounter += 1;
  return paymentIdCounter;
}

let bookingReferenceCounter = 8413;
export function nextBookingReference(): string {
  bookingReferenceCounter += 1;
  return `CL-2026-${bookingReferenceCounter}`;
}

let holdIdCounter = 0;
export function nextHoldId(): number {
  holdIdCounter += 1;
  return holdIdCounter;
}

let registrationCounter = 0;
export function nextRegistrationId(): string {
  registrationCounter += 1;
  return `reg_${registrationCounter}`;
}

export const MOCK_TOKEN = 'mock-session-token';
export const OTP_CODE = '1234';
/** Deterministic demo hook: a booking on this seat number always fails
 * payment verification (see booking.handlers.ts's `verify` handler). */
export const FAILING_SEAT_NUMBER = 13;
