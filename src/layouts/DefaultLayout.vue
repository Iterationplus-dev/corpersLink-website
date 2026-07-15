<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import AppFooter from '@/components/layout/AppFooter.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';
import { useSiteStore } from '@/stores/site.store';

const siteStore = useSiteStore();
const { chrome, isLoading, hasError, isReady, error } = storeToRefs(siteStore);

onMounted(() => {
  void siteStore.fetchChrome();
});
</script>

<template>
  <div class="default-layout">
    <a href="#main-content" class="default-layout__skip-link">Skip to main content</a>

    <AppHeader v-if="isReady && chrome" :nav-links="chrome.navLinks" />
    <div v-else-if="isLoading" class="default-layout__header-skeleton">
      <SkeletonBlock width="160px" height="32px" radius="8px" />
    </div>
    <div v-else-if="hasError" class="default-layout__header-error">
      <ErrorState
        title="We couldn't load the page"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="siteStore.fetchChrome()"
      />
    </div>

    <router-view v-if="isReady" />

    <AppFooter
      v-if="isReady && chrome"
      :disclaimer="chrome.footerDisclaimer"
      :copyright="chrome.footerCopyright"
    />
  </div>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.default-layout__skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  background: var(--cl-color-navy);
  color: #fff;
  padding: 0.75rem 1.25rem;
  border-radius: 0 0 8px 0;
  font-weight: 700;
}

.default-layout__skip-link:focus {
  left: 0;
}

.default-layout__header-skeleton {
  height: var(--cl-header-height);
  display: flex;
  align-items: center;
  padding: 0 clamp(1.25rem, 3vw, 3.5rem);
  border-bottom: 1px solid var(--cl-color-border);
}

.default-layout__header-error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
