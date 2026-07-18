import type { PaymentGateway } from '@/features/booking/types';
import type { Booking, Payment, Seat, SeatHold, Vehicle } from '@/features/booking/types';

export interface IBookingRepository {
  getVehicles(institutionId: number): Promise<Vehicle[]>;
  getSeats(vehicleId: number): Promise<Seat[]>;
  holdSeat(vehicleId: number, seatId: number): Promise<SeatHold>;
  createBooking(holdId: number): Promise<{ booking: Booking; payment: Payment }>;
  initializePayment(
    paymentId: number,
    gateway: PaymentGateway,
  ): Promise<{ authorizationUrl: string; reference: string }>;
  verifyPayment(paymentId: number, reference?: string): Promise<Booking>;
  getBookings(): Promise<Booking[]>;
  getReceipt(bookingId: number): Promise<{ booking: Booking; qrPayload: string }>;
}
