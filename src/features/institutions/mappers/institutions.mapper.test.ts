import { describe, expect, it } from 'vitest';

import type { InstitutionDTO } from '@/features/institutions/types';

import { mapInstitution } from './institutions.mapper';

function makeDTO(overrides: Partial<InstitutionDTO> = {}): InstitutionDTO {
  return {
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
    supportPhone: '0700-CORPERSLINK',
    supportEmail: 'transport@unilag.edu.ng',
    supportHours: 'Mon–Fri, 9 AM–5 PM',
    ...overrides,
  };
}

describe('mapInstitution', () => {
  it('composes typeState from typeLabel and state', () => {
    const model = mapInstitution(makeDTO());
    expect(model.typeState).toBe('Federal University · Lagos');
    expect(model.vehicleCount).toBe(3);
  });

  it.each([
    ['open', 'OPEN'],
    ['full', 'FULL'],
  ] as const)('maps status %s to label %s', (status, label) => {
    const model = mapInstitution(makeDTO({ status }));
    expect(model.statusLabel).toBe(label);
  });

  it('preserves support contact fields', () => {
    const model = mapInstitution(makeDTO());
    expect(model.supportPhone).toBe('0700-CORPERSLINK');
    expect(model.supportEmail).toBe('transport@unilag.edu.ng');
  });
});
