<script setup lang="ts">
import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';
import { useTermsPage } from '@/features/legal/composables/useTermsPage';

import LegalContentView from '../components/LegalContentView.vue';

const { data, isLoading, hasError, isReady, error, retry } = useTermsPage();
</script>

<template>
  <main id="main-content" class="legal-view">
    <LegalContentView v-if="isReady && data" :content="data" />

    <PageSkeleton v-else-if="isLoading" :block-count="0" />

    <div v-else-if="hasError" class="legal-view__error">
      <ErrorState
        title="We couldn't load the terms & conditions"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="retry"
      />
    </div>
  </main>
</template>

<style scoped>
.legal-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.legal-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
