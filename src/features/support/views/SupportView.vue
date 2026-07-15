<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';
import { useSupportPage } from '@/features/support/composables/useSupportPage';

const { data, isLoading, hasError, isReady, error, retry } = useSupportPage();
</script>

<template>
  <main id="main-content" class="support-view">
    <template v-if="isReady && data">
      <div class="support-view__inner">
        <div class="support-view__main">
          <div class="support-view__heading">
            <h1 class="support-view__headline">{{ data.headline }}</h1>
            <p class="support-view__subheadline">{{ data.subheadline }}</p>
          </div>

          <ul class="support-view__faq-preview">
            <li v-for="question in data.faqPreview" :key="question" class="support-view__faq-item">
              <span>{{ question }}</span>
              <BaseButton to="/faq" variant="ghost" size="md">View</BaseButton>
            </li>
          </ul>
        </div>

        <aside class="support-view__aside">
          <div class="support-view__chat-card">
            <div class="support-view__chat-title">Live chat</div>
            <p class="support-view__chat-sub">Online now · average reply in 3 minutes</p>
            <span class="support-view__chat-cta" aria-disabled="true" title="Coming soon"
              >Start chat</span
            >
          </div>

          <div class="support-view__contact-card">
            <div class="support-view__contact-title">
              {{ data.contact.institutionName }} transport desk
            </div>
            <p class="support-view__contact-hours">{{ data.contact.hours }}</p>
            <p class="support-view__contact-detail">{{ data.contact.phone }}</p>
            <p class="support-view__contact-detail">{{ data.contact.email }}</p>
          </div>

          <p class="support-view__notice">{{ data.refundNotice }}</p>
        </aside>
      </div>
    </template>

    <PageSkeleton v-else-if="isLoading" :block-count="2" />

    <div v-else-if="hasError" class="support-view__error">
      <ErrorState
        title="We couldn't load support content"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="retry"
      />
    </div>
  </main>
</template>

<style scoped>
.support-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.support-view__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  width: 100%;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
  align-items: start;
}

.support-view__main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.support-view__heading {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.support-view__headline {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--cl-color-navy-deep);
}

.support-view__subheadline {
  font-size: 0.95rem;
  color: var(--cl-color-text-muted);
}

.support-view__faq-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.support-view__faq-item {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-md);
  padding: 1rem 1.125rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--cl-color-text);
}

.support-view__aside {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.support-view__chat-card {
  background: var(--cl-color-navy);
  border-radius: var(--cl-radius-lg);
  padding: 1.375rem;
  color: var(--cl-color-text-inverse);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.support-view__chat-title {
  font-size: 1rem;
  font-weight: 800;
}

.support-view__chat-sub {
  font-size: 0.85rem;
  color: var(--cl-color-text-inverse-muted);
}

.support-view__chat-cta {
  align-self: flex-start;
  margin-top: 0.5rem;
  height: 40px;
  padding: 0 1.125rem;
  border-radius: var(--cl-radius-md);
  background: var(--cl-color-green);
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 700;
  opacity: 0.85;
  cursor: not-allowed;
}

.support-view__contact-card {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 1.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.support-view__contact-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.support-view__contact-hours,
.support-view__contact-detail {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.support-view__contact-detail {
  font-weight: 700;
  color: var(--cl-color-navy);
}

.support-view__notice {
  background: var(--cl-color-warning-bg);
  border: 1px solid var(--cl-color-warning-border);
  border-radius: var(--cl-radius-md);
  padding: 0.875rem 1rem;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--cl-color-warning-text);
}

.support-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

@media (min-width: 960px) {
  .support-view__inner {
    grid-template-columns: 1.5fr 1fr;
  }
}
</style>
