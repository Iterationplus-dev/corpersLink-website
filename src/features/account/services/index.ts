import { accountRepository } from '@/features/account/repository';

import { AccountService } from './account.service';

export { AccountService } from './account.service';

export const accountService = new AccountService(accountRepository);
