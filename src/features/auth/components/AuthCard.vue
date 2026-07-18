<script setup lang="ts">
withDefaults(defineProps<{ width?: string }>(), { width: '440px' });
</script>

<template>
  <div class="auth-card-page">
    <div class="auth-card" :style="{ maxWidth: width }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-card-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.25rem;
  background: var(--cl-color-bg-muted);
}

.auth-card {
  width: 100%;
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-xl);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
}
</style>
