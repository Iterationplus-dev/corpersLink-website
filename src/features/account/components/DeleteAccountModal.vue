<script setup lang="ts">
import { ref } from 'vue';

import PasswordField from '@/components/ui/PasswordField.vue';
import { AppError } from '@/core/types/app-error';
import { accountService } from '@/features/account/services';

const emit = defineEmits<{ close: []; deleted: [] }>();

const deletePoints = [
  'Your account and profile are permanently removed',
  'Your booking history and receipts are deleted',
  'Confirmed seats on upcoming trips are released',
  'Manifest records already generated are kept, as required by your institution',
];

const password = ref('');
const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

async function confirmDelete(): Promise<void> {
  if (!password.value) {
    errorMessage.value = 'Enter your password to confirm.';
    return;
  }
  isSubmitting.value = true;
  errorMessage.value = null;
  try {
    await accountService.deleteAccount(password.value);
    emit('deleted');
  } catch (error) {
    errorMessage.value = error instanceof AppError ? error.message : 'Something went wrong.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="Delete account confirmation"
  >
    <div class="modal">
      <div class="modal__icon">
        <svg width="26" height="24" viewBox="0 0 28 26" aria-hidden="true">
          <path
            d="M14 3L26 23H2L14 3Z"
            fill="none"
            stroke="#B54545"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          <path d="M14 10.5v6" stroke="#B54545" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="14" cy="19.5" r="1.5" fill="#B54545" />
        </svg>
      </div>
      <h2>Delete your account?</h2>
      <p class="modal__subtitle">This can't be undone. Deleting your CorpersLink account means:</p>

      <ul class="modal__points">
        <li v-for="point in deletePoints" :key="point">{{ point }}</li>
      </ul>

      <div class="modal__field">
        <label for="delete-password">Enter your password to confirm</label>
        <PasswordField id="delete-password" v-model="password" autocomplete="current-password" />
      </div>

      <p v-if="errorMessage" class="modal__error" role="alert">{{ errorMessage }}</p>

      <div class="modal__actions">
        <button type="button" class="modal__btn modal__btn--secondary" @click="$emit('close')">
          Keep my account
        </button>
        <button
          type="button"
          class="modal__btn modal__btn--danger"
          :disabled="isSubmitting"
          @click="confirmDelete"
        >
          {{ isSubmitting ? 'Deleting…' : 'Delete my account' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 32, 44, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 90;
}

.modal {
  width: 100%;
  max-width: 480px;
  background: var(--cl-color-bg);
  border-radius: var(--cl-radius-xl);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 24px 64px rgba(26, 32, 44, 0.35);
}

.modal__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--cl-radius-lg);
  background: var(--cl-color-danger-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal h2 {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.modal__subtitle {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--cl-color-text-muted);
}

.modal__points {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal__points li {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--cl-color-text);
  padding-left: 1rem;
  position: relative;
}

.modal__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 5px;
  height: 5px;
  border-radius: 3px;
  background: var(--cl-color-danger);
}

.modal__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.modal__field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cl-color-text);
}

.modal__field input {
  height: 48px;
  border-radius: var(--cl-radius-md);
  border: 1.5px solid var(--cl-color-border);
  padding: 0 0.875rem;
  font-size: 0.9rem;
  font-family: inherit;
}

.modal__error {
  font-size: 0.8125rem;
  color: var(--cl-color-danger);
  margin: 0;
}

.modal__actions {
  display: flex;
  gap: 0.75rem;
}

.modal__btn {
  flex: 1;
  height: 48px;
  border-radius: var(--cl-radius-md);
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
}

.modal__btn--secondary {
  background: var(--cl-color-bg);
  border: 1.5px solid var(--cl-color-border);
  color: var(--cl-color-text);
}

.modal__btn--danger {
  background: var(--cl-color-danger);
  color: #fff;
}

.modal__btn--danger:disabled {
  opacity: 0.7;
}
</style>
