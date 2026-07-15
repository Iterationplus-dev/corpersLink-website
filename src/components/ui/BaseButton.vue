<script setup lang="ts">
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline-inverse' | 'ghost';
  size?: 'md' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  /** Renders an <a> when set. Mutually exclusive with `to`. */
  href?: string;
  /** Renders a <router-link> when set. Mutually exclusive with `href`. */
  to?: RouteLocationRaw;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  href: undefined,
  to: undefined,
});

defineEmits<{ click: [MouseEvent] }>();

const tag = computed(() => {
  if (props.to) return 'router-link';
  if (props.href) return 'a';
  return 'button';
});
</script>

<template>
  <component
    :is="tag"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`, { 'is-loading': loading }]"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :aria-disabled="disabled || loading"
    :disabled="tag === 'button' ? disabled || loading : undefined"
    @click="(event: MouseEvent) => !disabled && !loading && $emit('click', event)"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
    <span class="base-button__label"><slot /></span>
  </component>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: var(--cl-radius-md);
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
  white-space: nowrap;
  transition:
    transform var(--cl-duration-fast) var(--cl-ease-standard),
    box-shadow var(--cl-duration-fast) var(--cl-ease-standard),
    background-color var(--cl-duration-fast) var(--cl-ease-standard),
    opacity var(--cl-duration-fast) var(--cl-ease-standard);
}

.base-button--md {
  padding: 0.875rem 1.5rem;
  min-height: 48px;
}

.base-button--lg {
  padding: 1rem 1.875rem;
  min-height: 54px;
  font-size: 1rem;
}

.base-button--primary {
  background: var(--cl-color-green);
  color: var(--cl-color-text-inverse);
  box-shadow: var(--cl-shadow-cta);
}

.base-button--primary:hover:not([aria-disabled='true']) {
  transform: translateY(-1px);
  box-shadow: var(--cl-shadow-cta-strong);
}

.base-button--secondary {
  background: var(--cl-color-bg);
  color: var(--cl-color-navy);
  border: 1.5px solid var(--cl-color-border);
}

.base-button--secondary:hover:not([aria-disabled='true']) {
  border-color: var(--cl-color-navy);
}

.base-button--outline-inverse {
  background: transparent;
  color: var(--cl-color-text-inverse-muted);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
}

.base-button--outline-inverse:hover:not([aria-disabled='true']) {
  color: var(--cl-color-text-inverse);
  border-color: rgba(255, 255, 255, 0.6);
}

.base-button--ghost {
  background: transparent;
  color: var(--cl-color-navy);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.base-button[aria-disabled='true'] {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none !important;
}

.base-button__spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: currentColor;
  animation: base-button-spin 700ms linear infinite;
}

@keyframes base-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
