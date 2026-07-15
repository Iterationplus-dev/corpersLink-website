<script setup lang="ts">
defineProps<{ disclaimer: string; copyright: string }>();
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <p class="app-footer__disclaimer">
        <strong>Disclaimer:</strong>
        {{ disclaimer }}
      </p>
      <div class="app-footer__row">
        <p class="app-footer__copyright">{{ copyright }}</p>
        <nav class="app-footer__links" aria-label="Legal">
          <router-link to="/privacy">Privacy</router-link>
          <router-link to="/terms">Terms</router-link>
          <router-link to="/support">Support</router-link>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--cl-color-border);
  margin-top: auto;
}

.app-footer__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: 1.5rem clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.app-footer__disclaimer {
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--cl-color-text-subtle);
  max-width: 920px;
}

.app-footer__row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.app-footer__copyright {
  font-size: 0.85rem;
  color: var(--cl-color-text-muted);
}

.app-footer__links {
  display: flex;
  gap: 1.5rem;
}

.app-footer__links a {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cl-color-text-muted);
}

.app-footer__links a:hover {
  color: var(--cl-color-navy);
}

@media (min-width: 720px) {
  .app-footer__row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
