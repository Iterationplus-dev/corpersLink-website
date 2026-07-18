<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import { AppError } from '@/core/types/app-error';
import { useAuthStore } from '@/stores/auth.store';

import AuthCard from '../components/AuthCard.vue';
import AuthTopBar from '../components/AuthTopBar.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

async function handleSubmit(): Promise<void> {
  isSubmitting.value = true;
  errorMessage.value = null;
  try {
    await authStore.requestPasswordReset(email.value);
    await router.push('/forgot-password/reset');
  } catch (error) {
    errorMessage.value = error instanceof AppError ? error.message : 'Something went wrong.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="page">
    <AuthTopBar link-label="New to CorpersLink?" link-to="/register" link-text="Create account" />
    <AuthCard>
      <div class="icon-badge">
        <svg width="26" height="28" viewBox="0 0 26 28" aria-hidden="true">
          <rect
            x="2"
            y="12"
            width="22"
            height="14"
            rx="3"
            fill="none"
            stroke="#1F3A5F"
            stroke-width="2.5"
          />
          <path
            d="M7 12V8a6 6 0 0 1 12 0v4"
            fill="none"
            stroke="#1F3A5F"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <circle cx="13" cy="19" r="2.2" fill="#1F3A5F" />
        </svg>
      </div>
      <div class="heading">
        <h1>Forgot your password?</h1>
        <p>Enter the email you registered with and we'll send you a 4-digit reset code.</p>
      </div>
      <form class="form" novalidate @submit.prevent="handleSubmit">
        <div class="field">
          <label for="fp-email">Email address</label>
          <input
            id="fp-email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="adaeze.o@gmail.com"
          />
        </div>
        <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isSubmitting"
          class="submit"
        >
          Send reset code
        </BaseButton>
      </form>
      <p class="footer-link">
        Remembered it? <router-link to="/signin">Back to sign in</router-link>
      </p>
    </AuthCard>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.icon-badge {
  width: 64px;
  height: 64px;
  border-radius: var(--cl-radius-lg);
  background: var(--cl-color-bg-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.heading {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  text-align: center;
}

.heading h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--cl-color-text);
  letter-spacing: -0.01em;
}

.heading p {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--cl-color-text-muted);
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cl-color-text);
}

.field input {
  height: 48px;
  border-radius: var(--cl-radius-md);
  border: 2px solid var(--cl-color-navy);
  padding: 0 0.875rem;
  font-size: 0.9rem;
  font-family: inherit;
}

.error {
  font-size: 0.8125rem;
  color: var(--cl-color-danger);
  margin: 0;
}

.submit {
  width: 100%;
}

.footer-link {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.footer-link a {
  font-weight: 700;
  color: var(--cl-color-green);
}
</style>
