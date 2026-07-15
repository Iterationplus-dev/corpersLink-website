<script setup lang="ts">
import type { AboutStat } from '@/features/about/types';

defineProps<{ stats: AboutStat[] }>();
</script>

<template>
  <section class="about-stats">
    <div class="about-stats__inner">
      <div v-for="stat in stats" :key="stat.id" class="about-stats__item">
        <div class="about-stats__value">{{ stat.value }}</div>
        <div class="about-stats__label">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-stats {
  padding: 0 clamp(1.25rem, 3vw, 3.5rem) clamp(2.5rem, 6vw, 4rem);
}

.about-stats__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  background: var(--cl-color-navy);
  border-radius: var(--cl-radius-xl);
  padding: clamp(1.75rem, 4vw, 2.5rem);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  color: var(--cl-color-text-inverse);
}

.about-stats__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.about-stats__value {
  font-size: 1.875rem;
  font-weight: 800;
}

.about-stats__label {
  font-size: 0.85rem;
  color: var(--cl-color-text-inverse-muted);
}

@media (min-width: 720px) {
  .about-stats__inner {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
