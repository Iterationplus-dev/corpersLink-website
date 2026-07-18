import { defineStore } from 'pinia';

import type { PaymentGateway, SeatPosition } from '@/features/booking/types';

interface BookingState {
  institutionId: number | null;
  vehicleId: number | null;
  vehicleName: string | null;
  route: string | null;
  pickupPoint: string | null;
  departureTime: string | null;
  fare: string | null;
  holdId: number | null;
  seatId: number | null;
  seatLabel: string | null;
  seatRow: number | null;
  seatPosition: SeatPosition | null;
  expiresAt: string | null;
  bookingId: number | null;
  paymentId: number | null;
  paymentMethod: PaymentGateway;
}

/**
 * Holds the in-progress seat selection and booking across the seat-map and
 * payment pages. Cleared once a booking is confirmed (the receipt page
 * fetches its own data from the backend by id instead). Note this state does
 * NOT survive a real payment-gateway redirect (full page navigation) — see
 * `payment-return-storage.ts` for the piece that does.
 */
export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    institutionId: null,
    vehicleId: null,
    vehicleName: null,
    route: null,
    pickupPoint: null,
    departureTime: null,
    fare: null,
    holdId: null,
    seatId: null,
    seatLabel: null,
    seatRow: null,
    seatPosition: null,
    expiresAt: null,
    bookingId: null,
    paymentId: null,
    paymentMethod: 'paystack',
  }),

  getters: {
    hasActiveHold: (state): boolean => {
      if (!state.holdId || !state.expiresAt) return false;
      return new Date(state.expiresAt).getTime() > Date.now();
    },
    isHoldExpired: (state): boolean => {
      if (!state.holdId || !state.expiresAt) return false;
      return new Date(state.expiresAt).getTime() <= Date.now();
    },
  },

  actions: {
    setHold(params: {
      institutionId: number;
      vehicleId: number;
      vehicleName: string;
      route: string;
      pickupPoint: string;
      departureTime: string;
      fare: string;
      holdId: number;
      seatId: number;
      seatLabel: string;
      seatRow: number;
      seatPosition: SeatPosition;
      expiresAt: string;
    }): void {
      this.institutionId = params.institutionId;
      this.vehicleId = params.vehicleId;
      this.vehicleName = params.vehicleName;
      this.route = params.route;
      this.pickupPoint = params.pickupPoint;
      this.departureTime = params.departureTime;
      this.fare = params.fare;
      this.holdId = params.holdId;
      this.seatId = params.seatId;
      this.seatLabel = params.seatLabel;
      this.seatRow = params.seatRow;
      this.seatPosition = params.seatPosition;
      this.expiresAt = params.expiresAt;
      this.bookingId = null;
      this.paymentId = null;
    },

    setBooking(bookingId: number, paymentId: number): void {
      this.bookingId = bookingId;
      this.paymentId = paymentId;
    },

    setPaymentMethod(method: PaymentGateway): void {
      this.paymentMethod = method;
    },

    clear(): void {
      this.institutionId = null;
      this.vehicleId = null;
      this.vehicleName = null;
      this.route = null;
      this.pickupPoint = null;
      this.departureTime = null;
      this.fare = null;
      this.holdId = null;
      this.seatId = null;
      this.seatLabel = null;
      this.seatRow = null;
      this.seatPosition = null;
      this.expiresAt = null;
      this.bookingId = null;
      this.paymentId = null;
    },
  },
});
