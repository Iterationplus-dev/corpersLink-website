export interface UpdateProfileRequestDTO {
  fullName?: string;
  phone?: string;
  stateCode?: string;
}

export interface DeleteAccountRequestDTO {
  password: string;
}

export interface ChangePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
}

export interface RequestEmailChangeRequestDTO {
  newEmail: string;
  password: string;
}

export interface ConfirmEmailChangeRequestDTO {
  newEmail: string;
  code: string;
}

export interface ConfirmEmailChangeResponseDTO {
  email: string;
}

/** Flat — unlike the registration wizard's nested `{emergencyContact: {...}}`
 * body, `/profile/emergency-contact` takes these fields at the top level. */
export interface UpsertNextOfKinRequestDTO {
  fullName: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  applyToAllBookings?: boolean;
}

export interface SessionDTO {
  id: number;
  deviceName: string;
  lastUsedAt: string | null;
  createdAt: string;
  current: boolean;
}
