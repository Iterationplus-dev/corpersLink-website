<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import PasswordField from '@/components/ui/PasswordField.vue';
import { AppError } from '@/core/types/app-error';
import { useAuthStore } from '@/stores/auth.store';

import AuthCard from '../components/AuthCard.vue';
import AuthTopBar from '../components/AuthTopBar.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({ code: '', password: '', confirmPassword: '' });
const isSubmitting = ref(false);
const isResending = ref(false);
const resendConfirmed = ref(false);
const errorMessage = ref<string | null>(null);

const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong password'];

const passwordStrength = computed(() => {
  const value = form.password;
  if (!value) return { score: 0, label: '' };

  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  return { score, label: STRENGTH_LABELS[score] };
});

const passwordsMatch = computed(
  () => form.confirmPassword.length > 0 && form.password === form.confirmPassword,
);

async function handleSubmit(): Promise<void> {
  errorMessage.value = null;
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  isSubmitting.value = true;
  try {
    await authStore.resetPassword(form.code, form.password);
    await router.push('/signin');
  } catch (error) {
    errorMessage.value = error instanceof AppError ? error.message : 'Something went wrong.';
  } finally {
    isSubmitting.value = false;
  }
}

async function handleResend(): Promise<void> {
  isResending.value = true;
  resendConfirmed.value = false;
  errorMessage.value = null;
  try {
    await authStore.resendPasswordReset();
    resendConfirmed.value = true;
  } catch (error) {
    errorMessage.value = error instanceof AppError ? error.message : 'Something went wrong.';
  } finally {
    isResending.value = false;
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
        <h1>Reset your password</h1>
        <p>
          Enter the 4-digit code we sent to
          <strong v-if="authStore.resetEmail">{{ authStore.resetEmail }}</strong
          ><span v-else>your email</span> along with your new password.
        </p>
      </div>
      <form class="form" novalidate @submit.prevent="handleSubmit">
        <div class="field">
          <label for="reset-code">Reset code</label>
          <input
            id="reset-code"
            v-model="form.code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="4"
          />
        </div>
        <p class="resend-link">
          Didn't receive the code?
          <button type="button" class="resend-action" :disabled="isResending" @click="handleResend">
            {{ isResending ? 'Resending…' : 'Resend' }}
          </button>
        </p>
        <p v-if="resendConfirmed" class="resend-confirmed">A new code is on its way.</p>
        <div class="field">
          <label for="new-password">New password</label>
          <PasswordField id="new-password" v-model="form.password" autocomplete="new-password" />
          <div v-if="form.password" class="strength">
            <div class="strength__bar">
              <span
                v-for="segment in 4"
                :key="segment"
                class="strength__segment"
                :class="`is-score-${passwordStrength.score}`"
                :style="{ opacity: segment <= passwordStrength.score ? 1 : 0.25 }"
              />
            </div>
            <span
              class="strength__label"
              :class="{ 'is-strong': passwordStrength.score === 4 }"
              >{{ passwordStrength.label }}</span
            >
          </div>
        </div>
        <div class="field">
          <label for="confirm-password">Confirm new password</label>
          <div class="input-with-icon">
            <input
              id="confirm-password"
              v-model="form.confirmPassword"
              type="password"
              autocomplete="new-password"
            />
            <svg
              v-if="passwordsMatch"
              class="match-check"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M4 12.5l5 5L20 6"
                fill="none"
                stroke="var(--cl-color-green)"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isSubmitting"
          class="submit"
        >
          Reset password
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
  border: 1.5px solid var(--cl-color-border);
  padding: 0 0.875rem;
  font-size: 0.9rem;
  font-family: inherit;
}

.field input:focus {
  outline: none;
  border-color: var(--cl-color-navy);
}

.resend-link {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
  margin: -0.375rem 0 0;
}

.resend-action {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-weight: 700;
  color: var(--cl-color-green);
  cursor: pointer;
}

.resend-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.resend-confirmed {
  font-size: 0.8125rem;
  color: var(--cl-color-green);
  margin: -0.375rem 0 0;
}

.strength {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: 0.125rem;
}

.strength__bar {
  display: flex;
  flex: 1;
  gap: 0.25rem;
}

.strength__segment {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--cl-color-border);
}

.strength__segment.is-score-1 {
  background: var(--cl-color-danger);
}

.strength__segment.is-score-2 {
  background: var(--cl-color-warning-text);
}

.strength__segment.is-score-3 {
  background: var(--cl-color-green-light);
}

.strength__segment.is-score-4 {
  background: var(--cl-color-green);
}

.strength__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--cl-color-text-muted);
  white-space: nowrap;
}

.strength__label.is-strong {
  color: var(--cl-color-green);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon input {
  width: 100%;
}

.match-check {
  position: absolute;
  right: 0.875rem;
  pointer-events: none;
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
