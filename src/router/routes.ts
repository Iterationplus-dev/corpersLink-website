import type { RouteRecordRaw } from 'vue-router';

import AppShellLayout from '@/layouts/AppShellLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

/**
 * Three route groups:
 *  - `DefaultLayout` children: public marketing pages (shared header/footer).
 *  - Standalone auth routes: sign-in, forgot-password, register (own chrome).
 *  - `AppShellLayout` children: authenticated app pages (`meta.requiresAuth`),
 *    guarded in `router/index.ts`.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'landing',
        component: () => import('@/features/landing/views/LandingView.vue'),
        meta: {
          title: 'CorpersLink — Campus transport, sorted',
          description:
            'CorpersLink - Book your verified seat to NYSC camp transport in minutes. Institution-run buses, secure payments, confirmed manifests.',
        },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/features/about/views/AboutView.vue'),
        meta: {
          title: 'About — CorpersLink',
          description:
            'How CorpersLink partners with institutions to run safe, verified transport for NYSC corps members — our mission, story, and impact.',
        },
      },
      {
        path: 'testimonials',
        name: 'testimonials',
        component: () => import('@/features/testimonials/views/TestimonialsView.vue'),
        meta: {
          title: 'Testimonials — CorpersLink',
          description:
            'Real stories from corps members who booked safe, verified camp transport with CorpersLink.',
        },
      },
      {
        path: 'faq',
        name: 'faq',
        component: () => import('@/features/faq/views/FaqView.vue'),
        meta: {
          title: 'FAQ — CorpersLink',
          description:
            'Answers to common questions about booking, payments, seat holds, and institution transport on CorpersLink.',
        },
      },
      {
        path: 'support',
        name: 'support',
        component: () => import('@/features/support/views/SupportView.vue'),
        meta: {
          title: 'Support — CorpersLink',
          description: 'Get help with your CorpersLink booking — chat with support, average reply in minutes.',
        },
      },
      {
        path: 'privacy',
        name: 'privacy',
        component: () => import('@/features/legal/views/PrivacyView.vue'),
        meta: {
          title: 'Privacy Policy — CorpersLink',
          description: "Read CorpersLink's Privacy Policy to understand how we collect, use, and protect your data.",
        },
      },
      {
        path: 'terms',
        name: 'terms',
        component: () => import('@/features/legal/views/TermsView.vue'),
        meta: {
          title: 'Terms & Conditions — CorpersLink',
          description: "Read CorpersLink's Terms & Conditions for booking NYSC camp transport.",
        },
      },
    ],
  },

  {
    path: '/welcome',
    name: 'onboarding',
    component: () => import('@/features/onboarding/views/OnboardingView.vue'),
    meta: { title: 'Welcome — CorpersLink', robots: 'noindex, follow' },
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('@/features/auth/views/SignInView.vue'),
    meta: { title: 'Sign in — CorpersLink', guestOnly: true, robots: 'noindex, follow' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/features/auth/views/ForgotPasswordView.vue'),
    meta: { title: 'Forgot password — CorpersLink', guestOnly: true, robots: 'noindex, follow' },
  },
  {
    path: '/forgot-password/reset',
    name: 'forgot-password-reset',
    component: () => import('@/features/auth/views/NewPasswordView.vue'),
    meta: { title: 'Reset password — CorpersLink', guestOnly: true, robots: 'noindex, nofollow' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/features/auth/views/RegisterView.vue'),
    meta: { title: 'Create your account — CorpersLink', guestOnly: true, robots: 'noindex, follow' },
  },
  {
    path: '/register/verify',
    name: 'register-verify',
    component: () => import('@/features/auth/views/RegisterVerifyView.vue'),
    meta: { title: 'Verify your email — CorpersLink', guestOnly: true, robots: 'noindex, nofollow' },
  },
  {
    path: '/register/school',
    name: 'register-school',
    component: () => import('@/features/auth/views/RegisterSchoolView.vue'),
    meta: { title: 'School information — CorpersLink', guestOnly: true, robots: 'noindex, nofollow' },
  },
  {
    path: '/register/next-of-kin',
    name: 'register-next-of-kin',
    component: () => import('@/features/auth/views/RegisterNextOfKinView.vue'),
    meta: { title: 'Emergency contact — CorpersLink', guestOnly: true, robots: 'noindex, nofollow' },
  },

  {
    path: '/',
    component: AppShellLayout,
    meta: { requiresAuth: true, robots: 'noindex, nofollow' },
    children: [
      {
        path: 'institutions',
        name: 'institutions',
        component: () => import('@/features/institutions/views/InstitutionsView.vue'),
        meta: { title: 'Choose your institution — CorpersLink' },
      },
      {
        path: 'book/:institutionId',
        name: 'book-seat',
        component: () => import('@/features/booking/views/SeatSelectionView.vue'),
        meta: { title: 'Choose your seat — CorpersLink' },
      },
      {
        path: 'book/:institutionId/pay',
        name: 'book-pay',
        component: () => import('@/features/booking/views/PaymentView.vue'),
        meta: { title: 'Confirm & pay — CorpersLink' },
      },
      {
        path: 'book/:institutionId/pay/return',
        name: 'book-pay-return',
        component: () => import('@/features/booking/views/PaymentReturnView.vue'),
        meta: { title: 'Confirming payment — CorpersLink' },
      },
      {
        path: 'bookings/:id/receipt',
        name: 'booking-receipt',
        component: () => import('@/features/booking/views/ReceiptView.vue'),
        meta: { title: 'Receipt — CorpersLink' },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/features/dashboard/views/DashboardView.vue'),
        meta: { title: 'Dashboard — CorpersLink' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/features/account/views/SettingsView.vue'),
        meta: { title: 'Profile & settings — CorpersLink' },
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'landing' },
  },
];
