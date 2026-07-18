<script setup lang="ts">
import type { AboutValue, AboutValueIconKey } from '@/features/about/types';

defineProps<{ values: AboutValue[] }>();

const ICON_PATHS: Record<AboutValueIconKey, string> = {
  verified: 'M12 3l7 2.5V11c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V5.5zM8.8 11.5l2.3 2.3 4-4.3',
  'fair-fares': 'M12 6v12M8.5 9.5h5a2 2 0 0 1 0 4h-3a2 2 0 0 0 0 4h5',
  community: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0',
};
</script>

<template>
  <section class="about-values" aria-label="What CorpersLink stands for">
    <div class="about-values__inner">
      <div v-for="value in values" :key="value.title" class="about-values__card">
        <div class="about-values__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              :d="ICON_PATHS[value.iconKey]"
              fill="none"
              stroke="var(--cl-color-green)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h2 class="about-values__title">{{ value.title }}</h2>
        <p class="about-values__body">{{ value.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-values__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 3vw, 3.5rem) clamp(2.5rem, 6vw, 3rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.about-values__card {
  background: var(--cl-color-bg-muted);
  border-radius: var(--cl-radius-card);
  padding: 1.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.about-values__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--cl-radius-md);
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-values__title {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.about-values__body {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--cl-color-text-muted);
}

@media (min-width: 720px) {
  .about-values__inner {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
