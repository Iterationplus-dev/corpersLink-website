<script setup lang="ts">
import { ref } from 'vue';

import type { FaqItem } from '@/features/faq/types';

const props = defineProps<{ items: FaqItem[] }>();

const openIndex = ref<number | null>(0);

function toggle(index: number): void {
  openIndex.value = openIndex.value === index ? null : index;
}

function panelId(index: number): string {
  return `faq-panel-${index}`;
}
</script>

<template>
  <div class="faq-accordion">
    <div v-for="(item, index) in props.items" :key="item.id" class="faq-accordion__item">
      <button
        type="button"
        class="faq-accordion__trigger"
        :aria-expanded="openIndex === index"
        :aria-controls="panelId(index)"
        @click="toggle(index)"
      >
        <span class="faq-accordion__question">{{ item.question }}</span>
        <span class="faq-accordion__icon" aria-hidden="true">{{
          openIndex === index ? '−' : '+'
        }}</span>
      </button>
      <div
        v-show="openIndex === index"
        :id="panelId(index)"
        class="faq-accordion__panel"
        role="region"
      >
        {{ item.answer }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-accordion__item {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 0.25rem 1.375rem;
}

.faq-accordion__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 0;
  background: none;
  border: none;
  text-align: left;
}

.faq-accordion__question {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--cl-color-text);
}

.faq-accordion__icon {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--cl-color-navy) 10%, var(--cl-color-bg-muted));
  color: var(--cl-color-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 700;
}

.faq-accordion__panel {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--cl-color-text-muted);
  border-top: 1px solid var(--cl-color-bg-muted);
  padding: 0.875rem 0 1.25rem;
}
</style>
