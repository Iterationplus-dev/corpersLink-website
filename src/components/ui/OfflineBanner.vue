<template>
  <div class="offline-banner" role="status">You're offline. Some content may be out of date.</div>
</template>

<style scoped>
.offline-banner {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--cl-color-warning-bg);
  color: var(--cl-color-warning-text);
  border-bottom: 1px solid var(--cl-color-warning-border);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  padding: 0.5rem 1rem;
}
</style>
