<script setup lang="ts">
import { computed } from 'vue';

import { useAsyncResource } from '@/composables/useAsyncResource';
import { testimonialsService } from '@/features/testimonials/services';

/**
 * Landing-page preview reuses the same testimonials data source as the full
 * /testimonials page — just the first three, in the simpler card style the
 * design spec calls for here (no avatar/badge, name + route pinned to the
 * bottom of the card).
 */
const { data, isReady } = useAsyncResource(() => testimonialsService.loadTestimonialsPage());

const previewTestimonials = computed(() => data.value?.testimonials.slice(0, 3) ?? []);
</script>

<template>
  <section
    v-if="isReady && previewTestimonials.length"
    class="testimonials-preview"
    aria-labelledby="testimonials-preview-heading"
  >
    <div class="testimonials-preview__inner">
      <div class="testimonials-preview__heading">
        <p class="testimonials-preview__eyebrow">Testimonials</p>
        <h2 id="testimonials-preview-heading" class="testimonials-preview__title">
          Corps members who rode with us.
        </h2>
      </div>

      <ul class="testimonials-preview__grid">
        <li
          v-for="testimonial in previewTestimonials"
          :key="testimonial.name + testimonial.meta"
          class="testimonials-preview__card"
        >
          <div class="testimonials-preview__stars" aria-hidden="true">
            {{ '★'.repeat(testimonial.stars) }}
          </div>
          <p class="testimonials-preview__quote">&ldquo;{{ testimonial.quote }}&rdquo;</p>
          <div class="testimonials-preview__identity">
            <div class="testimonials-preview__name">{{ testimonial.name }}</div>
            <div class="testimonials-preview__meta">{{ testimonial.meta }}</div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.testimonials-preview__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.testimonials-preview__heading {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
}

.testimonials-preview__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cl-color-green);
}

.testimonials-preview__title {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-navy-deep);
  max-width: 32ch;
}

.testimonials-preview__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.testimonials-preview__card {
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-card);
  padding: 1.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  height: 100%;
}

.testimonials-preview__stars {
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 3px;
  color: #e9a63c;
}

.testimonials-preview__quote {
  font-size: 0.90625rem;
  line-height: 1.65;
  color: #3a4657;
  flex: 1;
}

.testimonials-preview__identity {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.testimonials-preview__name {
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.testimonials-preview__meta {
  font-size: 0.78rem;
  color: #8a94a6;
}

@media (min-width: 960px) {
  .testimonials-preview__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
