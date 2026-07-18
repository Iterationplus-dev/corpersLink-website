import { ApiEndpoints } from '@/core/constants/api-endpoints';

import { mockRouter } from '../mock-router';
import { mockNotFoundError, mockSuccess } from '../mock-response';
import { faqItemsSeed } from '../seed/faq.seed';

mockRouter.register('get', ApiEndpoints.faq.list, ({ query }) => {
  const category = typeof query.category === 'string' ? query.category : undefined;
  const items = category ? faqItemsSeed.filter((item) => item.category === category) : faqItemsSeed;
  return mockSuccess(items);
});

mockRouter.register('get', '/support/faqs/:id', ({ params }) => {
  const item = faqItemsSeed.find((faq) => faq.id === Number(params.id));
  if (!item) return mockNotFoundError('FAQ');
  return mockSuccess(item);
});
