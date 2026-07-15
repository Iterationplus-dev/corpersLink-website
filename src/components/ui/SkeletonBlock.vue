<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
  radius?: string;
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '16px',
  radius: 'var(--cl-radius-sm)',
});
</script>

<template>
  <span
    class="skeleton-block"
    :style="{ width, height, borderRadius: radius }"
    aria-hidden="true"
  />
</template>

<style scoped>
.skeleton-block {
  display: block;
  background: linear-gradient(90deg, #e4e9f0 25%, #eef1f6 37%, #e4e9f0 63%);
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-block {
    animation: none;
  }
}
</style>
