<script setup lang="ts">
interface Props {
  size?: number;
}

withDefaults(defineProps<Props>(), { size: 30 });
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect width="48" height="48" rx="13" fill="#16815A" />
    <path
      d="M34.3 15.3 A13.5 13.5 0 1 0 34.3 32.7"
      fill="none"
      stroke="#FFFFFF"
      stroke-width="8.5"
      stroke-linecap="round"
    />
    <circle cx="36.5" cy="24" r="4.6" fill="#FFFFFF" />
  </svg>
</template>
