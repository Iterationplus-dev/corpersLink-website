<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import { AppError } from '@/core/types/app-error';
import { useAuthStore } from '@/stores/auth.store';

import AuthTopBar from '../components/AuthTopBar.vue';
import RegisterProgress from '../components/RegisterProgress.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({ fullName: '', email: '', phone: '' });
const agreed = ref(false);
const isSubmitting = ref(false);
const fieldErrors = ref<Record<string, string[]>>({});
const generalError = ref<string | null>(null);

async function handleSubmit(): Promise<void> {
  fieldErrors.value = {};
  generalError.value = null;

  if (!agreed.value) {
    generalError.value = 'Please agree to the Terms & Conditions and Privacy Policy to continue.';
    return;
  }

  isSubmitting.value = true;
  try {
    await authStore.startRegistration(form.fullName, form.email, form.phone);
    await router.push('/register/verify');
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
          <h1>Create your account</h1>
          <p>Step 1 of 3 — personal details</p>
        </div>
        <RegisterProgress :step="1" />

        <div class="fields">
          <div class="field">
            <label for="reg-name">Full name</label>
            <input id="reg-name" v-model="form.fullName" type="text" autocomplete="name" />
            <p v-if="fieldErrors.fullName" class="error">{{ fieldErrors.fullName[0] }}</p>
          </div>
          <div class="field">
            <label for="reg-email">Email address</label>
            <input id="reg-email" v-model="form.email" type="email" autocomplete="email" />
            <p v-if="fieldErrors.email" class="error">{{ fieldErrors.email[0] }}</p>
          </div>
          <div class="field full">
            <label for="reg-phone">Phone number</label>
            <input id="reg-phone" v-model="form.phone" type="tel" autocomplete="tel" />
            <p v-if="fieldErrors.phone" class="error">{{ fieldErrors.phone[0] }}</p>
          </div>
        </div>

        <p class="hint">
          We'll verify your email first, then collect school and emergency-contact details before
          you set a password.
        </p>

        <label class="agree">
          <input v-model="agreed" type="checkbox" />
          <span
            >I agree to the <router-link to="/terms">Terms &amp; Conditions</router-link> and
            <router-link to="/privacy">Privacy Policy</router-link>, and consent to my data being
            processed under the NDPR.</span
          >
        </label>

        <p class="disclaimer">
          <strong>Disclaimer:</strong> CorpersLink is an independent transportation platform and is
          not affiliated with, endorsed by, sponsored by, or operated by the National Youth Service
          Corps (NYSC).
        </p>

        <p v-if="generalError" class="error" role="alert">{{ generalError }}</p>

        <div class="actions">
          <BaseButton type="submit" variant="primary" size="lg" :loading="isSubmitting"
            >Continue</BaseButton
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

.field input {
  width: 100%;
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

.hint {
  font-size: 0.8125rem;
  color: var(--cl-color-text-muted);
}

.agree {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--cl-color-text-muted);
}

.agree input {
  margin-top: 0.2rem;
}

.agree a {
  font-weight: 600;
  color: var(--cl-color-navy);
}

.disclaimer {
  font-size: 0.75rem;
  line-height: 1.55;
  color: var(--cl-color-text-subtle);
}

.error {
  font-size: 0.8125rem;
  color: var(--cl-color-danger);
  margin: 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

@media (min-width: 640px) {
  .fields {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .field.full {
    grid-column: span 2;
  }
}
</style>
