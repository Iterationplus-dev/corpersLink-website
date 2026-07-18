export type InstitutionType =
  | 'federal_university'
  | 'state_university'
  | 'private_university'
  | 'polytechnic'
  | 'college_of_education'
  | 'other';

export type InstitutionStatus = 'open' | 'full';

export interface InstitutionDTO {
  id: number;
  name: string;
  abbreviation: string | null;
  type: InstitutionType;
  typeLabel: string;
  state: string;
  status: InstitutionStatus;
  campDestination: string | null;
  vehicleCount: number;
  verified: boolean;
  logoUrl: string | null;
  isActive: boolean;
  supportPhone: string | null;
  supportEmail: string | null;
  supportHours: string | null;
}
