import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import { mapBooking, mapPayment, mapSeat, mapSeatHold, mapVehicle } from '@/features/booking/mappers/booking.mapper';
import type {
  Booking,
  BookingDTO,
  CreateBookingResponseDTO,
  InitializePaymentResponseDTO,
  Payment,
  PaymentGateway,
  ReceiptResponseDTO,
  Seat,
  SeatDTO,
  SeatHold,
  SeatHoldResponseDTO,
  Vehicle,
  VehicleDTO,
} from '@/features/booking/types';

import type { IBookingRepository } from './booking.repository';

export class BookingRepository implements IBookingRepository {
  constructor(private readonly client: ApiClient) {}

  async getVehicles(institutionId: number): Promise<Vehicle[]> {
    const dtos = await this.client.get<VehicleDTO[]>(ApiEndpoints.booking.vehicles(institutionId));
    return dtos.map(mapVehicle);
  }

  async getSeats(vehicleId: number): Promise<Seat[]> {
    const dtos = await this.client.get<SeatDTO[]>(ApiEndpoints.booking.seats(vehicleId));
    return dtos.map(mapSeat);
  }

  async holdSeat(vehicleId: number, seatId: number): Promise<SeatHold> {
    const dto = await this.client.post<SeatHoldResponseDTO>(
      ApiEndpoints.booking.hold(vehicleId, seatId),
    );
    return mapSeatHold(dto);
  }

  async createBooking(holdId: number): Promise<{ booking: Booking; payment: Payment }> {
    const dto = await this.client.post<CreateBookingResponseDTO>(ApiEndpoints.booking.bookings, {
      holdId,
    });
    return { booking: mapBooking(dto.booking), payment: mapPayment(dto.payment) };
  }

  async initializePayment(
    paymentId: number,
    gateway: PaymentGateway,
  ): Promise<{ authorizationUrl: string; reference: string }> {
    return this.client.post<InitializePaymentResponseDTO>(
      ApiEndpoints.booking.paymentInitialize(paymentId),
      { gateway },
    );
  }

  async verifyPayment(paymentId: number, reference?: string): Promise<Booking> {
    const dto = await this.client.post<BookingDTO>(
      ApiEndpoints.booking.paymentVerify(paymentId),
      reference ? { reference } : undefined,
    );
    return mapBooking(dto);
  }

  async getBookings(): Promise<Booking[]> {
    const dtos = await this.client.get<BookingDTO[]>(ApiEndpoints.booking.bookings);
    return dtos.map(mapBooking);
  }

  async getReceipt(bookingId: number): Promise<{ booking: Booking; qrPayload: string }> {
    const dto = await this.client.get<ReceiptResponseDTO>(ApiEndpoints.booking.receipt(bookingId));
    return { booking: mapBooking(dto.booking), qrPayload: dto.qrPayload };
  }
}
