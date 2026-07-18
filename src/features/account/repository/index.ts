import { apiClient } from '@/core/api/client';

import { AccountRepository } from './account.repository.impl';

export type { IAccountRepository } from './account.repository';
export { AccountRepository } from './account.repository.impl';

export const accountRepository = new AccountRepository(apiClient);
