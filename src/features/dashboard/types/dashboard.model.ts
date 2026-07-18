import type { BookingStatus } from '@/features/booking/types';

/**
 * No dedicated dashboard endpoint exists on the real backend — this whole
 * feature is a view-model composed client-side from `GET bookings/` +
 * `GET profile/`. See `dashboard.mapper.ts`'s `buildDashboardContent`.
 */
export interface DashboardTrip {
  bookingId: number;
  reference: string;
  vehicleName: string;
  route: string;
  seatLabel: string;
  departureDateLabel: string;
  departureTimeLabel: string;
  pickupPoint: string;
  fare: string;
  paymentMethod: string | null;
  paidAt: string | null;
  daysUntilDeparture: number;
  countdownLabel: string;
}

export interface DashboardHistoryItem {
  bookingId: number;
  reference: string;
  trip: string;
  seatLabel: string;
  amount: string;
  status: BookingStatus;
  statusLabel: string;
  statusColor: { bg: string; fg: string };
}

export interface DashboardContent {
  fullName: string;
  meta: string;
  upcomingTrip: DashboardTrip | null;
  manifestClosesAt: string | null;
  history: DashboardHistoryItem[];
}
