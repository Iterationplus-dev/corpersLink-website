<script setup lang="ts">
import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';
import { useAboutPage } from '@/features/about/composables/useAboutPage';

import AboutHero from '../components/AboutHero.vue';
import AboutStatsBanner from '../components/AboutStatsBanner.vue';
import AboutValues from '../components/AboutValues.vue';

const { data, isLoading, hasError, isReady, error, retry } = useAboutPage();
</script>

<template>
  <main id="main-content" class="about-view">
    <template v-if="isReady && data">
      <AboutHero :eyebrow="data.eyebrow" :headline="data.headline" :body="data.body" />
      <AboutValues :values="data.values" />
      <AboutStatsBanner :stats="data.stats" />
    </template>

    <PageSkeleton v-else-if="isLoading" :block-count="3" />

    <div v-else-if="hasError" class="about-view__error">
      <ErrorState
        title="We couldn't load this page"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="retry"
      />
    </div>
  </main>
</template>

<style scoped>
.about-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.about-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
