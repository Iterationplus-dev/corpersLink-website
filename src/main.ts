import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { router } from './router';
import './styles/main.css';
import { SESSION_EXPIRED_EVENT } from '@/core/api/axios';
import { useAuthStore } from '@/stores/auth.store';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Any real 401 clears the stored token (see axios.ts's response interceptor)
// and fires this — bounce to sign-in rather than leaving the app stuck on a
// dead session. Listened for here, not in axios.ts, to avoid a circular
// import (store -> service -> repository -> client -> axios -> store).
window.addEventListener(SESSION_EXPIRED_EVENT, () => {
  const authStore = useAuthStore();
  authStore.forceSignOut();
  if (router.currentRoute.value.name !== 'signin') {
    router.push({ name: 'signin', query: { redirect: router.currentRoute.value.fullPath } });
  }
});

app.mount('#app');
