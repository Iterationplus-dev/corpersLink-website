<script setup lang="ts">
const methods = [
  {
    id: 'paystack',
    label: 'paystack',
    sub: 'Card · Bank · USSD',
    color: '#00C3F7',
    textColor: '#011B33',
  },
  {
    id: 'monnify',
    label: 'monnify',
    sub: 'Card · Transfer · USSD',
    color: '#0357EE',
    textColor: '#032B69',
  },
  { id: 'flutterwave', label: 'flutterwave', sub: 'Card · Transfer', textColor: '#2A3362' },
] as const;

defineProps<{ modelValue: string }>();
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="method-list">
    <label
      v-for="method in methods"
      :key="method.id"
      class="method-list__item"
      :class="{ 'is-active': modelValue === method.id }"
    >
      <input
        type="radio"
        name="payment-method"
        :value="method.id"
        :checked="modelValue === method.id"
        @change="$emit('update:modelValue', method.id)"
      />
      <span class="method-list__radio" />
      <span
        class="method-list__swatch"
        :style="
          method.id === 'flutterwave'
            ? { background: 'linear-gradient(135deg, #FB9129, #F5D327)' }
            : { background: method.color }
        "
      />
      <span class="method-list__label" :style="{ color: method.textColor }">{{
        method.label
      }}</span>
      <span class="method-list__sub">{{ method.sub }}</span>
    </label>
  </div>
</template>

<style scoped>
.method-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.method-list__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1.5px solid var(--cl-color-border);
  background: var(--cl-color-bg);
  border-radius: var(--cl-radius-md);
  padding: 1rem;
  cursor: pointer;
}

.method-list__item.is-active {
  border-color: var(--cl-color-green);
  background: var(--cl-color-green-tint);
}

.method-list__item input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.method-list__radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--cl-color-text-muted);
  flex-shrink: 0;
}

.method-list__item.is-active .method-list__radio {
  border: 6px solid var(--cl-color-green);
}

.method-list__swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.method-list__label {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.method-list__sub {
  font-size: 0.8125rem;
  color: var(--cl-color-text-muted);
}
</style>
