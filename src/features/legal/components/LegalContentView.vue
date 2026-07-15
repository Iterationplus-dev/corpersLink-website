<script setup lang="ts">
import type { LegalContent } from '@/features/legal/types';

defineProps<{ content: LegalContent }>();
</script>

<template>
  <div class="legal-content">
    <div class="legal-content__heading">
      <h1 class="legal-content__headline">{{ content.headline }}</h1>
      <p class="legal-content__subheadline">{{ content.subheadline }}</p>
    </div>

    <div class="legal-content__card">
      <section
        v-for="section in content.sections"
        :key="section.heading"
        class="legal-content__section"
      >
        <h2 class="legal-content__section-heading">{{ section.heading }}</h2>
        <p class="legal-content__section-body">{{ section.body }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.legal-content {
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.legal-content__heading {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.legal-content__headline {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--cl-color-navy-deep);
}

.legal-content__subheadline {
  font-size: 0.9rem;
  color: var(--cl-color-text-muted);
}

.legal-content__card {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 0 1.75rem;
}

.legal-content__section {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.125rem 0;
  border-bottom: 1px solid var(--cl-color-bg-muted);
}

.legal-content__section:last-child {
  border-bottom: none;
}

.legal-content__section-heading {
  font-size: 0.975rem;
  font-weight: 800;
  color: var(--cl-color-navy);
}

.legal-content__section-body {
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--cl-color-text-muted);
}
</style>
