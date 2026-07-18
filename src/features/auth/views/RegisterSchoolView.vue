<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import { AppError } from '@/core/types/app-error';
import InstitutionCombobox from '@/features/institutions/components/InstitutionCombobox.vue';
import { useAuthStore } from '@/stores/auth.store';

import AuthTopBar from '../components/AuthTopBar.vue';
import RegisterProgress from '../components/RegisterProgress.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  institutionId: null as number | null,
  callUpNumber: '',
  stateCode: '',
  batch: 'B',
  stream: '1',
});
const selectedInstitutionName = ref('your institution');
const isSubmitting = ref(false);
const fieldErrors = ref<Record<string, string[]>>({});
const generalError = ref<string | null>(null);

async function handleSubmit(): Promise<void> {
  fieldErrors.value = {};
  generalError.value = null;

  if (form.institutionId === null) {
    generalError.value = 'Choose your institution to continue.';
    return;
  }

  isSubmitting.value = true;
  try {
    await authStore.submitSchoolInfo(
      form.institutionId,
      form.callUpNumber,
      form.stateCode || undefined,
      form.batch,
      form.stream,
    );
    await router.push('/register/next-of-kin');
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
          <h1>School information</h1>
          <p>Step 2 of 3 — your institution</p>
        </div>
        <RegisterProgress :step="2" />

        <div class="fields">
          <div class="field">
            <label for="school-institution">Institution</label>
            <InstitutionCombobox
              id="school-institution"
              v-model="form.institutionId"
              v-model:selected-name="selectedInstitutionName"
              :invalid="!!fieldErrors.institutionId"
            />
            <p v-if="fieldErrors.institutionId" class="error">
              {{ fieldErrors.institutionId[0] }}
            </p>
          </div>
          <div class="field">
            <label for="school-callup">NYSC call-up number</label>
            <input
              id="school-callup"
              v-model="form.callUpNumber"
              type="text"
              placeholder="NYSC/UNILAG/2026/74812"
            />
            <p v-if="fieldErrors.callUpNumber" class="error">
              {{ fieldErrors.callUpNumber[0] }}
            </p>
          </div>
          <div class="field">
            <label for="school-state-code">State code (optional)</label>
            <input
              id="school-state-code"
              v-model="form.stateCode"
              type="text"
              placeholder="e.g. LA/26B/0412"
            />
          </div>
          <div class="field">
            <label for="school-batch">Batch</label>
            <select id="school-batch" v-model="form.batch">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <div class="field">
            <label for="school-stream">Stream</label>
            <select id="school-stream" v-model="form.stream">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>

        <div class="notice">
          Your call-up number is checked against
          <strong>{{ selectedInstitutionName }}</strong> records when you continue.
        </div>

        <p v-if="generalError" class="error" role="alert">{{ generalError }}</p>

        <div class="actions">
          <BaseButton type="button" variant="secondary" size="lg" @click="router.push('/register')"
            >Back</BaseButton
          >
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
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}
</style>
