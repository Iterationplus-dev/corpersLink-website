import { aboutRepository } from '@/features/about/repository';

import { AboutService } from './about.service';

export { AboutService } from './about.service';

export const aboutService = new AboutService(aboutRepository);
