<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ length?: number; error?: boolean }>(), {
  length: 4,
  error: false,
});

const emit = defineEmits<{ complete: [code: string] }>();

const digits = ref<string[]>(Array.from({ length: props.length }, () => ''));
const inputs = ref<Array<HTMLInputElement | null>>([]);

const code = computed(() => digits.value.join(''));

watch(code, (value) => {
  if (value.length === props.length) {
    emit('complete', value);
  }
});

function handleInput(index: number, event: Event): void {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, '').slice(-1);
  digits.value[index] = value;

  if (value && index < props.length - 1) {
    inputs.value[index + 1]?.focus();
  }
}

function handleKeydown(index: number, event: KeyboardEvent): void {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputs.value[index - 1]?.focus();
  }
}

function reset(): void {
  digits.value = Array.from({ length: props.length }, () => '');
  inputs.value[0]?.focus();
}

defineExpose({ reset });
</script>

<template>
  <div class="otp-input" role="group" aria-label="Verification code">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      :ref="(el) => (inputs[index] = el as HTMLInputElement | null)"
      :value="digit"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="1"
      class="otp-input__box"
      :class="{ 'is-error': error }"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
    />
  </div>
</template>

<style scoped>
.otp-input {
  display: flex;
  width: 100%;
  gap: 0.625rem;
}

.otp-input__box {
  flex: 1;
  min-width: 0;
  height: 58px;
  border-radius: var(--cl-radius-md);
  border: 1.5px solid var(--cl-color-border);
  background: var(--cl-color-bg);
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--cl-color-text);
  font-family: inherit;
}

.otp-input__box:focus {
  outline: none;
  border: 2px solid var(--cl-color-navy);
}

.otp-input__box.is-error {
  border-color: var(--cl-color-danger);
}
</style>
