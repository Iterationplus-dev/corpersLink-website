<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';
import { useFaqPage } from '@/features/faq/composables/useFaqPage';

import FaqAccordion from '../components/FaqAccordion.vue';

const { data, isLoading, hasError, isReady, error, retry } = useFaqPage();
</script>

<template>
  <main id="main-content" class="faq-view">
    <template v-if="isReady && data">
      <div class="faq-view__inner">
        <div class="faq-view__heading">
          <h1 class="faq-view__headline">{{ data.headline }}</h1>
          <p class="faq-view__subheadline">{{ data.subheadline }}</p>
        </div>

        <FaqAccordion :items="data.items" />

        <div class="faq-view__support-cta">
          <div class="faq-view__support-copy">
            <div class="faq-view__support-title">Still stuck?</div>
            <div class="faq-view__support-sub">Chat with support — average reply in 3 minutes</div>
          </div>
          <BaseButton
            to="/support"
            variant="primary"
            size="md"
            class="faq-view__support-btn"
            >Start chat</BaseButton
          >
        </div>
      </div>
    </template>

    <PageSkeleton v-else-if="isLoading" :block-count="5" block-height="72px" />

    <div v-else-if="hasError" class="faq-view__error">
      <ErrorState
        title="We couldn't load the FAQ"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="retry"
      />
    </div>
  </main>
</template>

<style scoped>
.faq-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.faq-view__inner {
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.faq-view__heading {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.faq-view__headline {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--cl-color-navy-deep);
}

.faq-view__subheadline {
  font-size: 0.95rem;
  color: var(--cl-color-text-muted);
}

.faq-view__support-cta {
  background: var(--cl-color-navy);
  border-radius: var(--cl-radius-lg);
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--cl-color-text-inverse);
}

.faq-view__support-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 200px;
}

.faq-view__support-title {
  font-size: 0.95rem;
  font-weight: 800;
}

.faq-view__support-sub {
  font-size: 0.8125rem;
  color: var(--cl-color-text-inverse-muted);
}

.faq-view__support-btn {
  border-radius: var(--cl-radius-pill);
}

.faq-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
