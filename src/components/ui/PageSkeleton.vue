<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue';

interface Props {
  /** Number of body blocks below the title, e.g. cards or list rows. */
  blockCount?: number;
  blockHeight?: string;
}

withDefaults(defineProps<Props>(), {
  blockCount: 3,
  blockHeight: '140px',
});
</script>

<template>
  <div class="page-skeleton" role="status" aria-label="Loading page content">
    <SkeletonBlock width="160px" height="20px" radius="999px" />
    <SkeletonBlock width="60%" height="36px" />
    <SkeletonBlock width="80%" height="18px" />
    <div class="page-skeleton__blocks">
      <SkeletonBlock v-for="n in blockCount" :key="n" :height="blockHeight" radius="16px" />
    </div>
  </div>
</template>

<style scoped>
.page-skeleton {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-skeleton__blocks {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 720px) {
  .page-skeleton__blocks {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
