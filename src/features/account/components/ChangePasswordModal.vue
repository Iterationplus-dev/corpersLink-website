<script setup lang="ts">
import { ref } from 'vue';

import PasswordField from '@/components/ui/PasswordField.vue';
import { AppError } from '@/core/types/app-error';
import { accountService } from '@/features/account/services';

const emit = defineEmits<{ close: []; changed: [] }>();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

async function confirmChange(): Promise<void> {
  errorMessage.value = null;
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'New passwords do not match.';
    return;
  }

  isSubmitting.value = true;
  try {
    await accountService.changePassword(currentPassword.value, newPassword.value);
    emit('changed');
  } catch (error) {
    errorMessage.value = error instanceof AppError ? error.message : 'Something went wrong.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Change password">
    <div class="modal">
      <h2>Change your password</h2>
      <p class="modal__subtitle">You'll stay signed in on this device after changing it.</p>

      <div class="modal__field">
        <label for="current-password">Current password</label>
        <PasswordField
          id="current-password"
          v-model="currentPassword"
          autocomplete="current-password"
        />
      </div>
      <div class="modal__field">
        <label for="new-password-modal">New password</label>
        <PasswordField id="new-password-modal" v-model="newPassword" autocomplete="new-password" />
      </div>
      <div class="modal__field">
        <label for="confirm-password-modal">Confirm new password</label>
        <PasswordField
          id="confirm-password-modal"
          v-model="confirmPassword"
          autocomplete="new-password"
        />
      </div>

      <p v-if="errorMessage" class="modal__error" role="alert">{{ errorMessage }}</p>

      <div class="modal__actions">
        <button type="button" class="modal__btn modal__btn--secondary" @click="$emit('close')">
          Cancel
        </button>
        <button
          type="button"
          class="modal__btn modal__btn--primary"
          :disabled="isSubmitting"
          @click="confirmChange"
        >
          {{ isSubmitting ? 'Saving…' : 'Save password' }}
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
  max-width: 420px;
  background: var(--cl-color-bg);
  border-radius: var(--cl-radius-xl);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 24px 64px rgba(26, 32, 44, 0.35);
}

.modal h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.modal__subtitle {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--cl-color-text-muted);
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

.modal__btn--primary {
  background: var(--cl-color-green);
  color: #fff;
}

.modal__btn--primary:disabled {
  opacity: 0.7;
}
</style>
