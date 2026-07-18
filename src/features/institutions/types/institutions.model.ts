import type { InstitutionStatus, InstitutionType } from './institutions.dto';

export interface Institution {
  id: number;
  name: string;
  abbreviation: string | null;
  type: InstitutionType;
  /** e.g. "Federal University · Lagos" — composed from `typeLabel` + `state`. */
  typeState: string;
  status: InstitutionStatus;
  statusLabel: string;
  campDestination: string | null;
  vehicleCount: number;
  verified: boolean;
  logoUrl: string | null;
  supportPhone: string | null;
  supportEmail: string | null;
  supportHours: string | null;
}
