import { describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '@/core/api/client';
import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { InstitutionDTO } from '@/features/institutions/types';

import { InstitutionsRepository } from './institutions.repository.impl';

function createFakeClient(overrides: Partial<ApiClient> = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

const dtos: InstitutionDTO[] = [
  {
    id: 1,
    name: 'University of Lagos',
    abbreviation: 'UNILAG',
    type: 'federal_university',
    typeLabel: 'Federal University',
    state: 'Lagos',
    status: 'open',
    campDestination: 'Iyana-Ipaja Camp',
    vehicleCount: 3,
    verified: true,
    logoUrl: null,
    isActive: true,
    supportPhone: null,
    supportEmail: null,
    supportHours: null,
  },
  {
    id: 2,
    name: 'Lagos State University',
    abbreviation: 'LASU',
    type: 'state_university',
    typeLabel: 'State University',
    state: 'Lagos',
    status: 'open',
    campDestination: null,
    vehicleCount: 2,
    verified: true,
    logoUrl: null,
    isActive: true,
    supportPhone: null,
    supportEmail: null,
    supportHours: null,
  },
];

describe('InstitutionsRepository', () => {
  it('search passes the query as a search param and maps every result', async () => {
    const get = vi.fn().mockResolvedValue(dtos);
    const repository = new InstitutionsRepository(createFakeClient({ get }));

    const results = await repository.search('lagos');

    expect(get).toHaveBeenCalledWith(ApiEndpoints.institutions.list, {
      params: { search: 'lagos' },
    });
    expect(results).toHaveLength(2);
  });

  it('search omits the params object entirely for an empty query', async () => {
    const get = vi.fn().mockResolvedValue(dtos);
    const repository = new InstitutionsRepository(createFakeClient({ get }));

    await repository.search('');

    expect(get).toHaveBeenCalledWith(ApiEndpoints.institutions.list, { params: undefined });
  });

  it('getById fetches the show endpoint for that id and maps the result', async () => {
    const get = vi.fn().mockResolvedValue(dtos[1]);
    const repository = new InstitutionsRepository(createFakeClient({ get }));

    const institution = await repository.getById(2);

    expect(get).toHaveBeenCalledWith(ApiEndpoints.institutions.show(2));
    expect(institution.name).toBe('Lagos State University');
  });
});
