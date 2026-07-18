import { authRepository } from '@/features/auth/repository';

import { AuthService } from './auth.service';

export { AuthService } from './auth.service';

export const authService = new AuthService(authRepository);
