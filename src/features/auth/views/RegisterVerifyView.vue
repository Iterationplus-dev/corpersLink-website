<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useCountdown } from '@/composables/useCountdown';
import { AppError } from '@/core/types/app-error';
import { useAuthStore } from '@/stores/auth.store';

import AuthCard from '../components/AuthCard.vue';
import AuthTopBar from '../components/AuthTopBar.vue';
import OtpInput from '../components/OtpInput.vue';

const router = useRouter();
const authStore = useAuthStore();

const isSubmitting = ref(false);
const hasError = ref(false);
const errorMessage = ref<string | null>(null);

const resendAt = ref<Date | null>(new Date(Date.now() + 60_000));
const { formatted: resendCountdown, isExpired: canResend } = useCountdown(resendAt);

async function handleResend(): Promise<void> {
  if (!canResend.value) return;
  try {
    await authStore.resendRegistrationOtp();
    resendAt.value = new Date(Date.now() + 60_000);
  } catch (error) {
    errorMessage.value = error instanceof AppError ? error.message : 'Something went wrong.';
  }
}

async function handleComplete(code: string): Promise<void> {
  isSubmitting.value = true;
  hasError.value = false;
  errorMessage.value = null;
  try {
    await authStore.verifyRegistrationEmail(code);
    await router.push('/register/school');
  } catch (error) {
    hasError.value = true;
    errorMessage.value = error instanceof AppError ? error.message : 'Something went wrong.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="page">
    <AuthTopBar link-label="Already registered?" link-to="/signin" link-text="Sign in" />
    <AuthCard>
      <div class="icon-badge">
        <svg width="30" height="24" viewBox="0 0 30 24" aria-hidden="true">
          <rect
            x="1.5"
            y="1.5"
            width="27"
            height="21"
            rx="4"
            fill="none"
            stroke="#1F3A5F"
            stroke-width="2.5"
          />
          <path
            d="M2.5 4L15 13.5L27.5 4"
            fill="none"
            stroke="#1F3A5F"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="heading">
        <h1>Verify your email</h1>
        <p>
          Enter the 4-digit code we sent to <strong>{{ authStore.registrationEmail }}</strong>.
        </p>
      </div>
      <OtpInput :error="hasError" @complete="handleComplete" />
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
      <p v-if="isSubmitting" class="checking">Checking…</p>

      <div class="resend-pill" :class="{ 'is-ready': canResend }">
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
          <path
            d="M12 7v5l3.5 2"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span v-if="canResend">You can resend the code now</span>
        <span v-else>Resend available in {{ resendCountdown }}</span>
      </div>
      <button
        type="button"
        class="resend-prompt"
        :disabled="!canResend"
        @click="handleResend"
      >
        Didn't receive the code?
      </button>

      <p class="footer-link">
        Wrong address? <router-link to="/register">Change email</router-link>
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

.error {
  font-size: 0.8125rem;
  color: var(--cl-color-danger);
  margin: 0;
}

.checking {
  font-size: 0.8125rem;
  color: var(--cl-color-text-muted);
  margin: 0;
}

.resend-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  align-self: center;
  padding: 0.5rem 0.875rem;
  border-radius: var(--cl-radius-pill);
  background: var(--cl-color-warning-bg);
  border: 1px solid var(--cl-color-warning-border);
  color: var(--cl-color-warning-text);
  font-size: 0.8125rem;
  font-weight: 600;
}

.resend-pill.is-ready {
  background: var(--cl-color-green-tint);
  border-color: var(--cl-color-green-tint-border);
  color: var(--cl-color-green);
}

.resend-prompt {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--cl-color-navy);
  cursor: pointer;
}

.resend-prompt:disabled {
  opacity: 0.55;
  cursor: not-allowed;
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
