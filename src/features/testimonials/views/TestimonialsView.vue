<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';
import { useTestimonialsPage } from '@/features/testimonials/composables/useTestimonialsPage';

import TestimonialCard from '../components/TestimonialCard.vue';

const { data, isLoading, hasError, isReady, error, retry } = useTestimonialsPage();
</script>

<template>
  <main id="main-content" class="testimonials-view">
    <template v-if="isReady && data">
      <section class="testimonials-view__heading">
        <p class="testimonials-view__eyebrow">{{ data.eyebrow }}</p>
        <h1 class="testimonials-view__headline">{{ data.headline }}</h1>
        <p class="testimonials-view__rating">
          <span class="testimonials-view__rating-stars" aria-hidden="true">★★★★★</span>
          <span>{{ data.ratingSummary }}</span>
        </p>
      </section>

      <section class="testimonials-view__grid" aria-label="Rider testimonials">
        <TestimonialCard
          v-for="testimonial in data.testimonials"
          :key="testimonial.name + testimonial.meta"
          :testimonial="testimonial"
        />
      </section>

      <section class="testimonials-view__cta">
        <div class="testimonials-view__cta-inner">
          <div class="testimonials-view__cta-copy">
            <h2>Join 12,480 corps members this season.</h2>
            <p>Your institution's buses are already on CorpersLink.</p>
          </div>
          <BaseButton :to="{ path: '/', hash: '#book' }" variant="secondary" size="lg"
            >Book your seat</BaseButton
          >
        </div>
      </section>
    </template>

    <PageSkeleton v-else-if="isLoading" :block-count="6" block-height="220px" />

    <div v-else-if="hasError" class="testimonials-view__error">
      <ErrorState
        title="We couldn't load testimonials"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="retry"
      />
    </div>
  </main>
</template>

<style scoped>
.testimonials-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.testimonials-view__heading {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem) clamp(1.5rem, 4vw, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  text-align: center;
}

.testimonials-view__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cl-color-green);
}

.testimonials-view__headline {
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--cl-color-navy-deep);
}

.testimonials-view__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.90625rem;
  color: var(--cl-color-text-muted);
}

.testimonials-view__rating-stars {
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #b7791f;
}

.testimonials-view__grid {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  width: 100%;
  padding: 0 clamp(1.25rem, 3vw, 3.5rem) clamp(2.5rem, 6vw, 3rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.testimonials-view__cta {
  padding: 0 clamp(1.25rem, 3vw, 3.5rem) clamp(2.5rem, 6vw, 4rem);
}

.testimonials-view__cta-inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  background: var(--cl-color-green);
  border-radius: var(--cl-radius-xl);
  padding: clamp(1.75rem, 4vw, 2.75rem) clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  color: var(--cl-color-text-inverse);
}

.testimonials-view__cta-copy h2 {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 800;
  letter-spacing: -0.01em;
}

.testimonials-view__cta-copy p {
  font-size: 0.9375rem;
  color: #d7eee3;
  margin-top: 0.25rem;
}

.testimonials-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

@media (min-width: 720px) {
  .testimonials-view__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .testimonials-view__grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .testimonials-view__cta-inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
