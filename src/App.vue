<script setup lang="ts">
import { watch } from 'vue';

import OfflineBanner from '@/components/ui/OfflineBanner.vue';
import { useOnlineStatus } from '@/composables/useOnlineStatus';
import { useUiStore } from '@/stores/ui.store';

const { isOnline } = useOnlineStatus();
const uiStore = useUiStore();

watch(
  isOnline,
  (online) => {
    uiStore.setOffline(!online);
  },
  { immediate: true },
);
</script>

<template>
  <OfflineBanner v-if="uiStore.isOffline" />
  <router-view />
</template>
