/**
 * Centralized endpoint registry. Both the real axios client and the mock
 * adapter key off these exact paths, so a repository never hardcodes a URL.
 */
export const ApiEndpoints = {
  site: {
    chrome: '/site/chrome',
  },
  landing: {
    stats: '/landing/stats',
    howItWorks: '/landing/how-it-works',
    content: '/landing/content',
    newsletter: '/landing/newsletter-signup',
  },
  about: {
    content: '/about/content',
  },
  testimonials: {
    content: '/testimonials/content',
  },
  faq: {
    list: '/support/faqs',
    show: (id: number) => `/support/faqs/${id}`,
  },
  support: {
    content: '/support/content',
  },
  privacy: {
    content: '/privacy/content',
  },
  terms: {
    content: '/terms/content',
  },
  auth: {
    registerStart: '/auth/register/start',
    registerSchool: (registrationId: string) => `/auth/register/${registrationId}/school`,
    registerNextOfKin: (registrationId: string) =>
      `/auth/register/${registrationId}/next-of-kin`,
    registerComplete: (registrationId: string) => `/auth/register/${registrationId}/complete`,
    otpVerify: '/auth/otp/verify',
    otpResend: '/auth/otp/resend',
    login: '/auth/login',
    loginTwoFactorVerify: '/auth/login/2fa-verify',
    loginTwoFactorResend: '/auth/login/2fa-resend',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    logoutAll: '/auth/logout-all',
  },
  /** `/profile/*` — the signed-in user's own account. Auth uses only `show`
   * (to hydrate the session); Account owns the rest. */
  profile: {
    show: '/profile',
    update: '/profile',
    delete: '/profile',
    avatar: '/profile/avatar',
    changePassword: '/profile/change-password',
    changeEmailRequest: '/profile/change-email/request',
    changeEmailConfirm: '/profile/change-email/confirm',
    emergencyContact: '/profile/emergency-contact',
    sessions: '/profile/sessions',
    session: (tokenId: number) => `/profile/sessions/${tokenId}`,
  },
  institutions: {
    list: '/institutions',
    show: (id: number) => `/institutions/${id}`,
  },
  booking: {
    vehicles: (institutionId: number) => `/institutions/${institutionId}/vehicles`,
    seats: (vehicleId: number) => `/vehicles/${vehicleId}/seats`,
    hold: (vehicleId: number, seatId: number) => `/vehicles/${vehicleId}/seats/${seatId}/hold`,
    bookings: '/bookings',
    receipt: (bookingId: number) => `/bookings/${bookingId}/receipt`,
    paymentInitialize: (paymentId: number) => `/payments/${paymentId}/initialize`,
    paymentVerify: (paymentId: number) => `/payments/${paymentId}/verify`,
  },
} as const;
