<script setup lang="ts">
import { ref } from 'vue';

withDefaults(
  defineProps<{
    id: string;
    modelValue: string;
    autocomplete?: string;
    placeholder?: string;
    invalid?: boolean;
  }>(),
  { autocomplete: 'current-password', placeholder: undefined, invalid: false },
);
defineEmits<{ 'update:modelValue': [value: string] }>();

const isVisible = ref(false);
</script>

<template>
  <div class="password-field" :class="{ 'is-invalid': invalid }">
    <input
      :id="id"
      :value="modelValue"
      :type="isVisible ? 'text' : 'password'"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      class="password-field__input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      type="button"
      class="password-field__toggle"
      :aria-pressed="isVisible"
      :aria-label="isVisible ? 'Hide password' : 'Show password'"
      @click="isVisible = !isVisible"
    >
      {{ isVisible ? 'Hide' : 'Show' }}
    </button>
  </div>
</template>

<style scoped>
.password-field {
  height: 48px;
  border-radius: var(--cl-radius-md);
  border: 1.5px solid var(--cl-color-border);
  background: var(--cl-color-bg);
  display: flex;
  align-items: center;
  padding: 0 0.875rem;
  gap: 0.5rem;
}

.password-field:focus-within {
  border-color: var(--cl-color-navy);
}

.password-field.is-invalid {
  border-color: var(--cl-color-danger);
}

.password-field__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--cl-color-text);
}

.password-field__toggle {
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--cl-color-text-muted);
  cursor: pointer;
}

.password-field__toggle:hover {
  color: var(--cl-color-navy);
}
</style>
