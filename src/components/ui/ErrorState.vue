<script setup lang="ts">
interface Props {
  title?: string;
  message: string;
  retryLabel?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  retryLabel: 'Try again',
});

const emit = defineEmits<{ retry: [] }>();
</script>

<template>
  <div class="error-state" role="alert">
    <div class="error-state__icon" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 26 26">
        <path d="M4 4L22 22M22 4L4 22" stroke="#B54545" stroke-width="3" stroke-linecap="round" />
      </svg>
    </div>
    <h2 class="error-state__title">{{ title }}</h2>
    <p class="error-state__message">{{ message }}</p>
    <button type="button" class="error-state__retry" @click="emit('retry')">
      {{ retryLabel }}
    </button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  text-align: center;
  max-width: 420px;
  margin: 0 auto;
}

.error-state__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--cl-color-danger-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-state__title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.error-state__message {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--cl-color-text-muted);
}

.error-state__retry {
  margin-top: 0.5rem;
  border: none;
  background: var(--cl-color-green);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.75rem 1.75rem;
  border-radius: var(--cl-radius-md);
  box-shadow: var(--cl-shadow-cta);
  transition: transform var(--cl-duration-fast) var(--cl-ease-standard);
}

.error-state__retry:hover {
  transform: translateY(-1px);
}
</style>
