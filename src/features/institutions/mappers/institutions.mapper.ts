import type { Institution, InstitutionDTO, InstitutionStatus } from '@/features/institutions/types';

const STATUS_LABELS: Record<InstitutionStatus, string> = {
  open: 'OPEN',
  full: 'FULL',
};

export function mapInstitution(dto: InstitutionDTO): Institution {
  return {
    id: dto.id,
    name: dto.name,
    abbreviation: dto.abbreviation,
    type: dto.type,
    typeState: `${dto.typeLabel} · ${dto.state}`,
    status: dto.status,
    statusLabel: STATUS_LABELS[dto.status],
    campDestination: dto.campDestination,
    vehicleCount: dto.vehicleCount,
    verified: dto.verified,
    logoUrl: dto.logoUrl,
    supportPhone: dto.supportPhone,
    supportEmail: dto.supportEmail,
    supportHours: dto.supportHours,
  };
}
