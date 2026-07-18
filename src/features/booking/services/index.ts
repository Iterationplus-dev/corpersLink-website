import { bookingRepository } from '@/features/booking/repository';

import { BookingService } from './booking.service';

export { BookingService } from './booking.service';

export const bookingService = new BookingService(bookingRepository);
