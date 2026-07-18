<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import PasswordField from '@/components/ui/PasswordField.vue';
import { AppError } from '@/core/types/app-error';
import { useAuthStore } from '@/stores/auth.store';

import AuthTopBar from '../components/AuthTopBar.vue';
import RegisterProgress from '../components/RegisterProgress.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  fullName: '',
  relationship: 'Brother',
  phone: '',
  address: '',
  password: '',
  confirmPassword: '',
});
const isSubmitting = ref(false);
const fieldErrors = ref<Record<string, string[]>>({});
const generalError = ref<string | null>(null);

async function handleSubmit(): Promise<void> {
  fieldErrors.value = {};
  generalError.value = null;

  if (form.password !== form.confirmPassword) {
    fieldErrors.value = { password: ['Passwords do not match.'] };
    return;
  }

  isSubmitting.value = true;
  try {
    await authStore.submitNextOfKin(form.fullName, form.relationship, form.phone, form.address);
    await authStore.completeRegistration(form.password);
    await router.replace('/dashboard');
  } catch (error) {
    if (error instanceof AppError && error.kind === 'validation' && error.fieldErrors) {
      fieldErrors.value = error.fieldErrors;
    } else if (error instanceof AppError) {
      generalError.value = error.message;
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="page">
    <AuthTopBar link-label="Already registered?" link-to="/signin" link-text="Sign in" />
    <div class="content">
      <form class="card" novalidate @submit.prevent="handleSubmit">
        <div class="heading">
          <h1>Emergency contact</h1>
          <p>Step 3 of 3 — your emergency contact</p>
        </div>
        <RegisterProgress :step="3" />

        <div class="fields">
          <div class="field">
            <label for="nok-name">Full name</label>
            <input id="nok-name" v-model="form.fullName" type="text" />
            <p v-if="fieldErrors.fullName" class="error">{{ fieldErrors.fullName[0] }}</p>
          </div>
          <div class="field">
            <label for="nok-relationship">Relationship</label>
            <select id="nok-relationship" v-model="form.relationship">
              <option>Brother</option>
              <option>Sister</option>
              <option>Parent</option>
              <option>Spouse</option>
              <option>Guardian</option>
              <option>Other</option>
            </select>
          </div>
          <div class="field">
            <label for="nok-phone">Phone number</label>
            <input id="nok-phone" v-model="form.phone" type="tel" />
            <p v-if="fieldErrors.phone" class="error">{{ fieldErrors.phone[0] }}</p>
          </div>
          <div class="field">
            <label for="nok-address">Home address</label>
            <input id="nok-address" v-model="form.address" type="text" />
          </div>
        </div>

        <div class="notice">
          Your next of kin is contacted only in a travel emergency. Details appear on the departure
          manifest.
        </div>

        <div class="fields">
          <div class="field">
            <label for="nok-password">Set a password</label>
            <PasswordField
              id="nok-password"
              v-model="form.password"
              autocomplete="new-password"
              :invalid="!!fieldErrors.password"
            />
            <p v-if="fieldErrors.password" class="error">{{ fieldErrors.password[0] }}</p>
          </div>
          <div class="field">
            <label for="nok-confirm-password">Confirm password</label>
            <PasswordField
              id="nok-confirm-password"
              v-model="form.confirmPassword"
              autocomplete="new-password"
            />
          </div>
        </div>

        <p v-if="generalError" class="error" role="alert">{{ generalError }}</p>

        <div class="actions">
          <BaseButton
            type="button"
            variant="secondary"
            size="lg"
            @click="router.push('/register/school')"
            >Back</BaseButton
          >
          <BaseButton type="submit" variant="primary" size="lg" :loading="isSubmitting"
            >Create account</BaseButton
          >
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--cl-color-bg-muted);
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 2.5rem 1.25rem;
}

.card {
  width: 100%;
  max-width: 640px;
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-xl);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.heading h1 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-text);
}

.heading p {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.fields {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cl-color-text);
}

.field input,
.field select {
  width: 100%;
  height: 48px;
  border-radius: var(--cl-radius-md);
  border: 1.5px solid var(--cl-color-border);
  padding: 0 0.875rem;
  font-size: 0.9rem;
  font-family: inherit;
  background: var(--cl-color-bg);
}

.field input:focus,
.field select:focus {
  outline: none;
  border-color: var(--cl-color-navy);
}

.notice {
  background: var(--cl-color-warning-bg);
  border: 1px solid var(--cl-color-warning-border);
  border-radius: var(--cl-radius-md);
  padding: 0.75rem 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--cl-color-warning-text);
}

.error {
  font-size: 0.8125rem;
  color: var(--cl-color-danger);
  margin: 0;
}

.actions {
  display: flex;
  justify-content: space-between;
}

@media (min-width: 640px) {
  .fields {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
