import type { AccountService } from '@/features/account/services';
import type { BookingService } from '@/features/booking/services';
import { buildDashboardContent } from '@/features/dashboard/mappers/dashboard.mapper';
import type { DashboardContent } from '@/features/dashboard/types';

/** No dedicated dashboard endpoint exists — this composes its view-model
 * from the account and booking features' own services. */
export class DashboardService {
  constructor(
    private readonly bookingService: BookingService,
    private readonly accountService: AccountService,
  ) {}

  async loadDashboard(): Promise<DashboardContent> {
    const [user, bookings] = await Promise.all([
      this.accountService.loadProfile(),
      this.bookingService.getBookings(),
    ]);
    return buildDashboardContent(user, bookings);
  }
}
