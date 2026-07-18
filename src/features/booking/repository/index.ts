import { apiClient } from '@/core/api/client';

import { BookingRepository } from './booking.repository.impl';

export type { IBookingRepository } from './booking.repository';
export { BookingRepository } from './booking.repository.impl';

export const bookingRepository = new BookingRepository(apiClient);
