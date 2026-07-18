import type { IBookingRepository } from '@/features/booking/repository';
import type { Booking, Payment, PaymentGateway, Seat, SeatHold, Vehicle } from '@/features/booking/types';

export class BookingService {
  constructor(private readonly repository: IBookingRepository) {}

  async getVehicles(institutionId: number): Promise<Vehicle[]> {
    return this.repository.getVehicles(institutionId);
  }

  async getSeats(vehicleId: number): Promise<Seat[]> {
    return this.repository.getSeats(vehicleId);
  }

  async holdSeat(vehicleId: number, seatId: number): Promise<SeatHold> {
    return this.repository.holdSeat(vehicleId, seatId);
  }

  async createBooking(holdId: number): Promise<{ booking: Booking; payment: Payment }> {
    return this.repository.createBooking(holdId);
  }

  async initializePayment(
    paymentId: number,
    gateway: PaymentGateway,
  ): Promise<{ authorizationUrl: string; reference: string }> {
    return this.repository.initializePayment(paymentId, gateway);
  }

  async verifyPayment(paymentId: number, reference?: string): Promise<Booking> {
    return this.repository.verifyPayment(paymentId, reference);
  }

  async getBookings(): Promise<Booking[]> {
    return this.repository.getBookings();
  }

  async getReceipt(bookingId: number): Promise<{ booking: Booking; qrPayload: string }> {
    return this.repository.getReceipt(bookingId);
  }
}
