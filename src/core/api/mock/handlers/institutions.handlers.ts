import { ApiEndpoints } from '@/core/constants/api-endpoints';

import { mockRouter } from '../mock-router';
import { mockNotFoundError, mockSuccess } from '../mock-response';
import { institutionsSeed } from '../seed/institutions.seed';

mockRouter.register('get', ApiEndpoints.institutions.list, ({ query }) => {
  const search = typeof query.search === 'string' ? query.search.trim().toLowerCase() : '';
  const results = search
    ? institutionsSeed.filter(
        (inst) =>
          inst.name.toLowerCase().includes(search) ||
          inst.state.toLowerCase().includes(search) ||
          (inst.abbreviation ?? '').toLowerCase().includes(search),
      )
    : institutionsSeed;

  return mockSuccess(results);
});

mockRouter.register('get', '/institutions/:id', ({ params }) => {
  const institution = institutionsSeed.find((inst) => inst.id === Number(params.id));
  if (!institution) return mockNotFoundError('Institution');
  return mockSuccess(institution);
});
