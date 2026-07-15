<script setup lang="ts">
import type { HeroStat } from '@/features/landing/types';

defineProps<{ stats: HeroStat[] }>();
</script>

<template>
  <dl class="hero-stats">
    <div v-for="stat in stats" :key="stat.id" class="hero-stats__item">
      <dt class="hero-stats__value">{{ stat.displayValue }}</dt>
      <dd class="hero-stats__label">{{ stat.label }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 2.25rem;
  margin: 0;
  padding-top: 0.5rem;
}

.hero-stats__item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.hero-stats__value {
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--cl-color-text-inverse);
}

.hero-stats__label {
  margin: 0;
  font-size: 0.85rem;
  color: var(--cl-color-text-inverse-muted);
}
</style>
