import { formatDepartureDate, formatDepartureTime, formatManifestClose } from '@/core/utils/format-date';
import type { User } from '@/features/auth/types';
import type { Booking, BookingStatus } from '@/features/booking/types';
import type { DashboardContent, DashboardHistoryItem, DashboardTrip } from '@/features/dashboard/types';

const STATUS_STYLES: Record<BookingStatus, { label: string; bg: string; fg: string }> = {
  pending_payment: { label: 'PENDING', bg: '#FCF6EA', fg: '#B7791F' },
  confirmed: { label: 'CONFIRMED', bg: '#E2F1EB', fg: '#16815A' },
  cancelled: { label: 'CANCELLED', bg: '#FBEFEF', fg: '#B54545' },
  expired: { label: 'EXPIRED', bg: '#EDEFF3', fg: '#5A6472' },
};

const DAY_MS = 24 * 60 * 60 * 1000;

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / DAY_MS));
}

function formatCountdownLabel(days: number): string {
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
}

/** The real backend has no manifest-close field — the rule (cutoff is 6 PM
 * the evening before departure) lives client-side, same as it did in the
 * mock before this feature was wired to the real API. */
function manifestCloseFor(departureAtIso: string): string {
  const closeDate = new Date(new Date(departureAtIso).getTime() - DAY_MS);
  closeDate.setUTCHours(18, 0, 0, 0);
  return formatManifestClose(closeDate.toISOString());
}

export function mapDashboardTrip(booking: Booking): DashboardTrip {
  const days = daysUntil(booking.departureAtIso);
  return {
    bookingId: booking.id,
    reference: booking.reference,
    vehicleName: booking.vehicleName ?? '',
    route: booking.route ?? '',
    seatLabel: booking.seatLabel ?? '',
    departureDateLabel: formatDepartureDate(booking.departureAtIso),
    departureTimeLabel: formatDepartureTime(booking.departureAtIso),
    pickupPoint: booking.pickupPoint ?? '',
    fare: booking.fare,
    paymentMethod: booking.paymentMethod,
    paidAt: booking.paidAt,
    daysUntilDeparture: days,
    countdownLabel: formatCountdownLabel(days),
  };
}

export function mapDashboardHistoryItem(booking: Booking): DashboardHistoryItem {
  const style = STATUS_STYLES[booking.status];
  return {
    bookingId: booking.id,
    reference: booking.reference,
    trip: `${booking.institutionName ?? ''} — ${booking.vehicleName ?? ''}`,
    seatLabel: booking.seatLabel ?? '',
    amount: booking.fare,
    status: booking.status,
    statusLabel: style.label,
    statusColor: { bg: style.bg, fg: style.fg },
  };
}

function buildMeta(user: User): string {
  const batchStream = user.batch && user.stream ? `Batch ${user.batch}, Stream ${user.stream}` : null;
  return [user.stateCode, user.institution?.name, batchStream].filter(Boolean).join(' · ');
}

export function buildDashboardContent(user: User, bookings: Booking[]): DashboardContent {
  const upcoming = bookings.find((b) => b.status === 'confirmed') ?? null;

  return {
    fullName: user.fullName,
    meta: buildMeta(user),
    upcomingTrip: upcoming ? mapDashboardTrip(upcoming) : null,
    manifestClosesAt: upcoming ? manifestCloseFor(upcoming.departureAtIso) : null,
    history: bookings.map(mapDashboardHistoryItem),
  };
}
