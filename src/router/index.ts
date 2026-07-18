import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores/auth.store';

import { routes } from './routes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated && !authStore.user) {
    await authStore.fetchCurrentUser();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'signin', query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' };
  }

  return true;
});

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? 'CorpersLink';
  document.title = title;
});
