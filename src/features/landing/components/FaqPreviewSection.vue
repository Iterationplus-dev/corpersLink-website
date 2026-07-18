<script setup lang="ts">
import { computed } from 'vue';

import { useAsyncResource } from '@/composables/useAsyncResource';
import { faqService } from '@/features/faq/services';

/**
 * Short landing-page preview of the full FAQ — reuses the same FAQ content
 * source as /faq, just the first few items, rendered as a plain Q&A list
 * (not the accordion used on the full FAQ page).
 */
const { data, isReady } = useAsyncResource(() => faqService.loadFaqPage());

const previewItems = computed(() => data.value?.items.slice(0, 4) ?? []);
</script>

<template>
  <section
    v-if="isReady && previewItems.length"
    class="faq-preview"
    aria-labelledby="faq-preview-heading"
  >
    <div class="faq-preview__inner">
      <div class="faq-preview__heading">
        <p class="faq-preview__eyebrow">FAQ</p>
        <h2 id="faq-preview-heading" class="faq-preview__title">Questions, answered.</h2>
      </div>

      <ul class="faq-preview__list">
        <li v-for="item in previewItems" :key="item.question" class="faq-preview__item">
          <p class="faq-preview__question">{{ item.question }}</p>
          <p class="faq-preview__answer">{{ item.answer }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq-preview {
  background: var(--cl-color-bg-muted);
}

.faq-preview__inner {
  max-width: 860px;
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.faq-preview__heading {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
}

.faq-preview__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cl-color-green);
}

.faq-preview__title {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-navy-deep);
}

.faq-preview__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-preview__item {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-card);
  padding: 1.375rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-preview__question {
  font-size: 0.90625rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.faq-preview__answer {
  font-size: 0.90625rem;
  line-height: 1.6;
  color: var(--cl-color-text-muted);
}
</style>
