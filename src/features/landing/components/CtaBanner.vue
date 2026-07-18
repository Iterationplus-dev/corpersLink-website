<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
</script>

<template>
  <section id="book" class="cta-banner">
    <div class="cta-banner__inner">
      <div class="cta-banner__copy">
        <h2 class="cta-banner__title">Seats fill fast in camp season.</h2>
        <p class="cta-banner__subtitle">
          Create your free account now — booking takes less than five minutes.
        </p>
      </div>

      <BaseButton to="/register" variant="secondary" size="lg" class="cta-banner__cta">
        Create account
      </BaseButton>
    </div>
  </section>
</template>

<style scoped>
.cta-banner {
  padding: 0 clamp(1.25rem, 3vw, 3.5rem) clamp(2.5rem, 6vw, 4rem);
}

.cta-banner__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  background: var(--cl-color-green);
  border-radius: var(--cl-radius-xl);
  padding: clamp(1.75rem, 4vw, 2.75rem) clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  color: var(--cl-color-text-inverse);
}

.cta-banner__copy {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.cta-banner__title {
  font-size: clamp(1.375rem, 3vw, 1.625rem);
  font-weight: 800;
  letter-spacing: -0.01em;
}

.cta-banner__subtitle {
  font-size: 0.97rem;
  line-height: 1.55;
  color: #d7eee3;
  max-width: 56ch;
}

.cta-banner__cta {
  flex-shrink: 0;
  border-radius: var(--cl-radius-pill);
}

.cta-banner__cta.base-button--secondary {
  color: var(--cl-color-green);
}

@media (min-width: 720px) {
  .cta-banner__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
