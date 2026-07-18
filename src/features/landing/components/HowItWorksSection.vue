<script setup lang="ts">
import type { HowItWorksStep } from '@/features/landing/types';

defineProps<{ steps: HowItWorksStep[] }>();
</script>

<template>
  <section id="how-it-works" class="how-it-works" aria-labelledby="how-it-works-heading">
    <div class="how-it-works__inner">
      <div class="how-it-works__heading">
        <p class="how-it-works__eyebrow">How it works</p>
        <h2 id="how-it-works-heading" class="how-it-works__title">
          Three steps. One seat. Zero stress.
        </h2>
      </div>

      <ol class="how-it-works__grid">
        <li v-for="step in steps" :key="step.stepNumber" class="how-it-works__card">
          <span class="how-it-works__badge" aria-hidden="true">{{ step.stepNumber }}</span>
          <h3 class="how-it-works__card-title">{{ step.title }}</h3>
          <p class="how-it-works__card-body">{{ step.description }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.how-it-works {
  background: var(--cl-color-bg);
}

.how-it-works__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.how-it-works__heading {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
}

.how-it-works__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cl-color-green);
}

.how-it-works__title {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-navy-deep);
  max-width: 32ch;
}

.how-it-works__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.how-it-works__card {
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-card);
  padding: 1.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition:
    transform var(--cl-duration-base) var(--cl-ease-standard),
    box-shadow var(--cl-duration-base) var(--cl-ease-standard);
}

.how-it-works__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--cl-shadow-card);
}

.how-it-works__badge {
  width: 40px;
  height: 40px;
  border-radius: var(--cl-radius-md);
  background: var(--cl-color-green-tint);
  color: var(--cl-color-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.0625rem;
  font-weight: 800;
}

.how-it-works__card-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.how-it-works__card-body {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--cl-color-text-muted);
}

@media (min-width: 720px) {
  .how-it-works__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
