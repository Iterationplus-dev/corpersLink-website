import type { RouteRecordRaw } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';

/**
 * Landing, About, Testimonials, FAQ, Support, Privacy and Terms are
 * implemented today. New feature routes should be added as children of
 * `DefaultLayout` (or their own layout) — the router itself never needs
 * to change shape to support them.
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
        meta: { title: 'CorpersLink — Campus transport, sorted' },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/features/about/views/AboutView.vue'),
        meta: { title: 'About — CorpersLink' },
      },
      {
        path: 'testimonials',
        name: 'testimonials',
        component: () => import('@/features/testimonials/views/TestimonialsView.vue'),
        meta: { title: 'Testimonials — CorpersLink' },
      },
      {
        path: 'faq',
        name: 'faq',
        component: () => import('@/features/faq/views/FaqView.vue'),
        meta: { title: 'FAQ — CorpersLink' },
      },
      {
        path: 'support',
        name: 'support',
        component: () => import('@/features/support/views/SupportView.vue'),
        meta: { title: 'Support — CorpersLink' },
      },
      {
        path: 'privacy',
        name: 'privacy',
        component: () => import('@/features/legal/views/PrivacyView.vue'),
        meta: { title: 'Privacy Policy — CorpersLink' },
      },
      {
        path: 'terms',
        name: 'terms',
        component: () => import('@/features/legal/views/TermsView.vue'),
        meta: { title: 'Terms & Conditions — CorpersLink' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'landing' },
  },
];
