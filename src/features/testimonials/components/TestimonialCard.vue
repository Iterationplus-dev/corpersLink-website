<script setup lang="ts">
import type { Testimonial } from '@/features/testimonials/types';

defineProps<{ testimonial: Testimonial }>();
</script>

<template>
  <article class="testimonial-card">
    <div class="testimonial-card__stars" aria-hidden="true">
      {{ '★'.repeat(testimonial.stars) }}
    </div>
    <p class="testimonial-card__quote">&ldquo;{{ testimonial.quote }}&rdquo;</p>
    <div class="testimonial-card__footer">
      <div
        class="testimonial-card__avatar"
        :style="{ background: testimonial.avatarColor }"
        aria-hidden="true"
      >
        {{ testimonial.initials }}
      </div>
      <div class="testimonial-card__identity">
        <div class="testimonial-card__name">{{ testimonial.name }}</div>
        <div class="testimonial-card__meta">{{ testimonial.meta }}</div>
      </div>
      <span class="testimonial-card__verified">VERIFIED RIDER</span>
    </div>
  </article>
</template>

<style scoped>
.testimonial-card {
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 1.625rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.testimonial-card__stars {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--cl-color-warning-text);
}

.testimonial-card__quote {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--cl-color-text);
  flex: 1;
}

.testimonial-card__footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-top: 1px solid var(--cl-color-bg-muted);
  padding-top: 1rem;
  flex-wrap: wrap;
}

.testimonial-card__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 800;
  flex-shrink: 0;
}

.testimonial-card__identity {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.testimonial-card__name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--cl-color-text);
}

.testimonial-card__meta {
  font-size: 0.8rem;
  color: var(--cl-color-text-muted);
}

.testimonial-card__verified {
  margin-left: auto;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: var(--cl-radius-pill);
  background: var(--cl-color-green-tint);
  color: var(--cl-color-green);
  white-space: nowrap;
}
</style>
