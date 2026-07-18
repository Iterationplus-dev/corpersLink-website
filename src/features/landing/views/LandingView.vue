<script setup lang="ts">
import ErrorState from '@/components/ui/ErrorState.vue';
import { useLandingPage } from '@/features/landing/composables/useLandingPage';

import CtaBanner from '../components/CtaBanner.vue';
import FaqPreviewSection from '../components/FaqPreviewSection.vue';
import HeroSection from '../components/HeroSection.vue';
import HowItWorksSection from '../components/HowItWorksSection.vue';
import LandingSkeleton from '../components/LandingSkeleton.vue';
import TestimonialsPreviewSection from '../components/TestimonialsPreviewSection.vue';
import WhyCorpersLinkSection from '../components/WhyCorpersLinkSection.vue';

const { hero, stats, steps, isLoading, hasError, isReady, error, retry } = useLandingPage();
</script>

<template>
  <main id="main-content" class="landing-view">
    <template v-if="isReady && hero">
      <HeroSection :content="hero" :stats="stats" />
      <HowItWorksSection :steps="steps" />
      <WhyCorpersLinkSection />
      <TestimonialsPreviewSection />
      <FaqPreviewSection />
      <CtaBanner />
    </template>

    <LandingSkeleton v-else-if="isLoading" />

    <div v-else-if="hasError" class="landing-view__error">
      <ErrorState
        title="We couldn't load the landing page"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="retry"
      />
    </div>
  </main>
</template>

<style scoped>
.landing-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.landing-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
