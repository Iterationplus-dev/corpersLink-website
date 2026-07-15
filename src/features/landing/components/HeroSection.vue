<script setup lang="ts">
import heroImageWebp from '@/assets/illustrations/hero-corps-member.webp';
import BaseButton from '@/components/ui/BaseButton.vue';
import type { HeroStat, LandingHeroContent } from '@/features/landing/types';

import HeroStatsRow from './HeroStatsRow.vue';

defineProps<{ content: LandingHeroContent; stats: HeroStat[] }>();
</script>

<template>
  <section id="top" class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__badge">{{ content.badgeText }}</p>
        <h1 class="hero__headline">{{ content.headline }}</h1>
        <p class="hero__subheadline">{{ content.subheadline }}</p>

        <div class="hero__ctas">
          <BaseButton href="#book" variant="primary" size="lg">{{
            content.primaryCtaLabel
          }}</BaseButton>
          <BaseButton href="#how-it-works" variant="outline-inverse" size="lg">{{
            content.secondaryCtaLabel
          }}</BaseButton>
        </div>

        <HeroStatsRow :stats="stats" />
      </div>

      <div class="hero__media">
        <picture>
          <source :srcset="heroImageWebp" type="image/webp" />
          <img
            :src="content.heroImageUrl"
            :alt="content.heroImageAlt"
            loading="lazy"
            decoding="async"
            width="718"
            height="537"
            class="hero__image"
          />
        </picture>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: var(--cl-color-navy);
  color: var(--cl-color-text-inverse);
}

.hero__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}

.hero__copy {
  display: flex;
  flex-direction: column;
  gap: 1.375rem;
}

.hero__badge {
  align-self: flex-start;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.375rem 0.875rem;
  border-radius: var(--cl-radius-pill);
  background: rgba(22, 129, 90, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--cl-color-green-light);
}

.hero__headline {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.02em;
}

.hero__subheadline {
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  line-height: 1.6;
  color: var(--cl-color-text-inverse-muted);
  max-width: 46ch;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
}

.hero__media {
  position: relative;
  border-radius: var(--cl-radius-xl);
  overflow: hidden;
  box-shadow: var(--cl-shadow-hero-image);
  min-height: 260px;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 960px) {
  .hero__inner {
    grid-template-columns: 1.05fr 1fr;
    gap: 3.5rem;
  }
}
</style>
