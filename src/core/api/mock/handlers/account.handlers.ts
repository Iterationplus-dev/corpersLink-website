import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { NextOfKinDTO, UserDTO } from '@/features/auth/types';

import { mockRouter } from '../mock-router';
import { mockSuccess, mockValidationError } from '../mock-response';
import { toUserDTO } from '../seed/auth.seed';
import { seededUser } from '../state/mock-db';

function nextOfKinDTO(): NextOfKinDTO {
  return {
    id: 1,
    fullName: seededUser.nextOfKin.fullName,
    relationship: seededUser.nextOfKin.relationship,
    phone: seededUser.nextOfKin.phone,
    alternatePhone: null,
    address: seededUser.nextOfKin.address,
    applyToAllBookings: true,
  };
}

mockRouter.register('patch', ApiEndpoints.profile.update, ({ body }) => {
  const payload = body as { fullName?: unknown; phone?: unknown; stateCode?: unknown } | null;
  if (typeof payload?.fullName === 'string' && payload.fullName.trim()) {
    seededUser.fullName = payload.fullName.trim();
  }
  if (typeof payload?.phone === 'string' && payload.phone.trim()) {
    seededUser.phone = payload.phone.trim();
  }
  if (typeof payload?.stateCode === 'string' && payload.stateCode.trim()) {
    seededUser.stateCode = payload.stateCode.trim();
  }
  return mockSuccess<UserDTO>(toUserDTO(seededUser));
});

mockRouter.register('delete', ApiEndpoints.profile.delete, ({ body }) => {
  const payload = body as { password?: unknown } | null;
  const password = typeof payload?.password === 'string' ? payload.password : '';

  if (!password) {
    return mockValidationError({ password: ['Enter your password to confirm.'] });
  }
  return mockSuccess({ deleted: true });
});

mockRouter.register('post', ApiEndpoints.profile.changePassword, ({ body }) => {
  const payload = body as { currentPassword?: unknown; newPassword?: unknown } | null;
  const currentPassword = typeof payload?.currentPassword === 'string' ? payload.currentPassword : '';
  const newPassword = typeof payload?.newPassword === 'string' ? payload.newPassword : '';

  if (!currentPassword) {
    return mockValidationError({ currentPassword: ['Enter your current password.'] });
  }
  if (newPassword.length < 8) {
    return mockValidationError({ newPassword: ['Use at least 8 characters.'] });
  }
  return mockSuccess({ changed: true });
});

mockRouter.register('post', ApiEndpoints.profile.changeEmailRequest, ({ body }) => {
  const payload = body as { newEmail?: unknown; password?: unknown } | null;
  const newEmail = typeof payload?.newEmail === 'string' ? payload.newEmail.trim() : '';

  if (!newEmail) return mockValidationError({ newEmail: ['Enter a new email address.'] });
  return mockSuccess({ otpExpiresAt: new Date(Date.now() + 10 * 60_000).toISOString() });
});

mockRouter.register('post', ApiEndpoints.profile.changeEmailConfirm, ({ body }) => {
  const payload = body as { newEmail?: unknown; code?: unknown } | null;
  const newEmail = typeof payload?.newEmail === 'string' ? payload.newEmail.trim() : '';
  const code = typeof payload?.code === 'string' ? payload.code.trim() : '';

  if (code !== '1234') {
    return mockValidationError({ code: ['That code is incorrect. Try 1234 for this demo.'] });
  }
  seededUser.email = newEmail;
  return mockSuccess({ email: seededUser.email });
});

mockRouter.register('get', ApiEndpoints.profile.emergencyContact, () => mockSuccess(nextOfKinDTO()));

mockRouter.register('patch', ApiEndpoints.profile.emergencyContact, ({ body }) => {
  const payload = body as {
    fullName?: unknown;
    relationship?: unknown;
    phone?: unknown;
    address?: unknown;
  } | null;
  const fullName = typeof payload?.fullName === 'string' ? payload.fullName.trim() : '';
  const phone = typeof payload?.phone === 'string' ? payload.phone.trim() : '';

  const errors: Record<string, string[]> = {};
  if (!fullName) errors.fullName = ["Emergency contact's full name is required."];
  if (!phone) errors.phone = ["Emergency contact's phone number is required."];
  if (Object.keys(errors).length > 0) return mockValidationError(errors);

  seededUser.nextOfKin = {
    fullName,
    relationship: typeof payload?.relationship === 'string' ? payload.relationship.trim() : '',
    phone,
    address: typeof payload?.address === 'string' ? payload.address.trim() : '',
  };
  return mockSuccess(nextOfKinDTO());
});

mockRouter.register('delete', ApiEndpoints.profile.emergencyContact, () => mockSuccess(null));

mockRouter.register('get', ApiEndpoints.profile.sessions, () =>
  mockSuccess([
    {
      id: 1,
      deviceName: 'Chrome on Windows',
      lastUsedAt: new Date().toISOString(),
      createdAt: '2026-06-01T09:00:00.000Z',
      current: true,
    },
  ]),
);

mockRouter.register('delete', ApiEndpoints.profile.sessions, () => mockSuccess(null));
mockRouter.register('delete', '/profile/sessions/:tokenId', () => mockSuccess(null));
