import { accountService } from '@/features/account/services';
import { bookingService } from '@/features/booking/services';

import { DashboardService } from './dashboard.service';

export { DashboardService } from './dashboard.service';

export const dashboardService = new DashboardService(bookingService, accountService);
