import { ApiEndpoints } from '@/core/constants/api-endpoints';
import type { LoginResponseDTO, RegisterCompleteResponseDTO, UserDTO } from '@/features/auth/types';

import { mockRouter } from '../mock-router';
import { mockSuccess, mockValidationError } from '../mock-response';
import { toUserDTO } from '../seed/auth.seed';
import { MOCK_TOKEN, OTP_CODE, nextRegistrationId, registrationDrafts, seededUser } from '../state/mock-db';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOCK_TOKENS = { accessToken: MOCK_TOKEN, refreshToken: MOCK_TOKEN, expiresIn: 31536000 };

function futureIso(minutesFromNow: number): string {
  return new Date(Date.now() + minutesFromNow * 60_000).toISOString();
}

mockRouter.register('post', ApiEndpoints.auth.registerStart, ({ body }) => {
  const payload = body as { fullName?: unknown; email?: unknown; phone?: unknown } | null;
  const fullName = typeof payload?.fullName === 'string' ? payload.fullName.trim() : '';
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';
  const phone = typeof payload?.phone === 'string' ? payload.phone.trim() : '';

  const errors: Record<string, string[]> = {};
  if (!fullName) errors.fullName = ['Full name is required.'];
  if (!email) errors.email = ['Email address is required.'];
  else if (!EMAIL_PATTERN.test(email)) errors.email = ['Enter a valid email address.'];
  if (!phone) errors.phone = ['Phone number is required.'];
  if (Object.keys(errors).length > 0) return mockValidationError(errors);

  const registrationId = nextRegistrationId();
  registrationDrafts.set(registrationId, { fullName, email, phone, emailVerified: false });
  return mockSuccess({ registrationId, otpExpiresAt: futureIso(10) });
});

mockRouter.register('post', ApiEndpoints.auth.otpVerify, ({ body }) => {
  const payload = body as { registrationId?: unknown; code?: unknown } | null;
  const registrationId = typeof payload?.registrationId === 'string' ? payload.registrationId : '';
  const code = typeof payload?.code === 'string' ? payload.code.trim() : '';

  const draft = registrationDrafts.get(registrationId);
  if (!draft) {
    return mockValidationError({ registrationId: ['Your registration session expired. Start again.'] });
  }
  if (code !== OTP_CODE) {
    return mockValidationError({ code: ['That code is incorrect. Try 1234 for this demo.'] });
  }
  draft.emailVerified = true;
  return mockSuccess({ verified: true });
});

mockRouter.register('post', ApiEndpoints.auth.otpResend, () => mockSuccess({ otpExpiresAt: futureIso(10) }));

mockRouter.register('patch', '/auth/register/:registrationId/school', ({ params, body }) => {
  const draft = registrationDrafts.get(params.registrationId ?? '');
  if (!draft || !draft.emailVerified) {
    return mockValidationError({ registrationId: ['Verify your email before continuing.'] });
  }

  const payload = body as {
    institutionId?: unknown;
    callUpNumber?: unknown;
    stateCode?: unknown;
    batch?: unknown;
    stream?: unknown;
  } | null;
  const callUpNumber = typeof payload?.callUpNumber === 'string' ? payload.callUpNumber.trim() : '';
  if (!callUpNumber) return mockValidationError({ callUpNumber: ['Call-up number is required.'] });

  draft.institutionId = typeof payload?.institutionId === 'number' ? payload.institutionId : undefined;
  draft.callUpNumber = callUpNumber;
  draft.stateCode = typeof payload?.stateCode === 'string' ? payload.stateCode.trim() : undefined;
  draft.batch = typeof payload?.batch === 'string' ? payload.batch.trim() : undefined;
  draft.stream = typeof payload?.stream === 'string' ? payload.stream.trim() : undefined;
  return mockSuccess({ callUpNumberVerified: true });
});

mockRouter.register('patch', '/auth/register/:registrationId/next-of-kin', ({ params, body }) => {
  const draft = registrationDrafts.get(params.registrationId ?? '');
  if (!draft || !draft.callUpNumber) {
    return mockValidationError({ registrationId: ['Complete school information before continuing.'] });
  }

  const payload = body as { emergencyContact?: Record<string, unknown> } | null;
  const contact = payload?.emergencyContact ?? {};
  const fullName = typeof contact.fullName === 'string' ? contact.fullName.trim() : '';
  const phone = typeof contact.phone === 'string' ? contact.phone.trim() : '';
  const relationship = typeof contact.relationship === 'string' ? contact.relationship.trim() : '';
  const address = typeof contact.address === 'string' ? contact.address.trim() : '';

  const errors: Record<string, string[]> = {};
  if (!fullName) errors['emergencyContact.fullName'] = ["Emergency contact's full name is required."];
  if (!phone) errors['emergencyContact.phone'] = ["Emergency contact's phone number is required."];
  if (Object.keys(errors).length > 0) return mockValidationError(errors);

  draft.nextOfKin = { fullName, relationship, phone, address };
  return mockSuccess({ accepted: true });
});

mockRouter.register('post', '/auth/register/:registrationId/complete', ({ params, body }) => {
  const draft = registrationDrafts.get(params.registrationId ?? '');
  if (!draft || !draft.nextOfKin) {
    return mockValidationError({ registrationId: ['Complete emergency-contact details before continuing.'] });
  }

  const payload = body as { password?: unknown } | null;
  const password = typeof payload?.password === 'string' ? payload.password : '';
  if (password.length < 8) return mockValidationError({ password: ['Use at least 8 characters.'] });

  registrationDrafts.delete(params.registrationId ?? '');

  const response: RegisterCompleteResponseDTO = {
    user: toUserDTO({
      ...seededUser,
      fullName: draft.fullName,
      email: draft.email,
      phone: draft.phone,
      stateCode: draft.stateCode ?? seededUser.stateCode,
      callUpNumber: draft.callUpNumber ?? seededUser.callUpNumber,
      nextOfKin: { ...seededUser.nextOfKin, ...draft.nextOfKin },
    }),
    tokens: MOCK_TOKENS,
  };
  return mockSuccess(response);
});

mockRouter.register('post', ApiEndpoints.auth.login, ({ body }) => {
  const payload = body as { identifier?: unknown; password?: unknown } | null;
  const identifier = typeof payload?.identifier === 'string' ? payload.identifier.trim() : '';
  const password = typeof payload?.password === 'string' ? payload.password : '';

  const errors: Record<string, string[]> = {};
  if (!identifier) errors.identifier = ['Email or call-up number is required.'];
  if (!password) errors.password = ['Password is required.'];
  if (Object.keys(errors).length > 0) return mockValidationError(errors);

  const response: LoginResponseDTO = {
    requiresTwoFactor: false,
    user: toUserDTO(seededUser),
    tokens: MOCK_TOKENS,
  };
  return mockSuccess(response);
});

mockRouter.register('post', ApiEndpoints.auth.forgotPassword, ({ body }) => {
  const payload = body as { email?: unknown } | null;
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

  if (!email) return mockValidationError({ email: ['Email address is required.'] });
  if (!EMAIL_PATTERN.test(email)) return mockValidationError({ email: ['Enter a valid email address.'] });
  return mockSuccess({ otpExpiresAt: futureIso(10) });
});

mockRouter.register('post', ApiEndpoints.auth.resetPassword, ({ body }) => {
  const payload = body as { email?: unknown; code?: unknown; newPassword?: unknown } | null;
  const code = typeof payload?.code === 'string' ? payload.code.trim() : '';
  const newPassword = typeof payload?.newPassword === 'string' ? payload.newPassword : '';

  if (code !== OTP_CODE) {
    return mockValidationError({ code: ['That code is incorrect. Try 1234 for this demo.'] });
  }
  if (newPassword.length < 8) return mockValidationError({ newPassword: ['Use at least 8 characters.'] });
  return mockSuccess({ reset: true });
});

mockRouter.register('post', ApiEndpoints.auth.refresh, () => mockSuccess(MOCK_TOKENS));
mockRouter.register('post', ApiEndpoints.auth.logout, () => mockSuccess(null));
mockRouter.register('post', ApiEndpoints.auth.logoutAll, () => mockSuccess(null));

mockRouter.register('get', ApiEndpoints.profile.show, () => mockSuccess<UserDTO>(toUserDTO(seededUser)));
