import { apiClient } from '@/core/api/client';

import { AuthRepository } from './auth.repository.impl';

export type { IAuthRepository } from './auth.repository';
export { AuthRepository } from './auth.repository.impl';

export const authRepository = new AuthRepository(apiClient);
