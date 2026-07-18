<script setup lang="ts">
defineProps<{ step: 1 | 2 | 3 }>();
</script>

<template>
  <div class="progress">
    <div class="progress__bar" :class="{ 'is-active': step >= 1 }" />
    <div class="progress__bar" :class="{ 'is-active': step >= 2 }" />
    <div class="progress__bar" :class="{ 'is-active': step >= 3 }" />
  </div>
</template>

<style scoped>
.progress {
  display: flex;
  gap: 0.5rem;
}

.progress__bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--cl-color-border);
}

.progress__bar.is-active {
  background: var(--cl-color-green);
}
</style>
