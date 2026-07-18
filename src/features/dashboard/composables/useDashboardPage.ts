import { useAsyncResource } from '@/composables/useAsyncResource';
import { dashboardService } from '@/features/dashboard/services';

export function useDashboardPage() {
  return useAsyncResource(() => dashboardService.loadDashboard());
}
