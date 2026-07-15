<script setup lang="ts">
defineProps<{ eyebrow: string; headline: string; body: string }>();
</script>

<template>
  <section class="about-hero">
    <div class="about-hero__inner">
      <p class="about-hero__eyebrow">{{ eyebrow }}</p>
      <h1 class="about-hero__headline">{{ headline }}</h1>
      <p class="about-hero__body">{{ body }}</p>
    </div>
  </section>
</template>

<style scoped>
.about-hero {
  background: var(--cl-color-bg);
}

.about-hero__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem) clamp(1.5rem, 4vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.about-hero__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cl-color-green);
}

.about-hero__headline {
  max-width: 26ch;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--cl-color-navy-deep);
}

.about-hero__body {
  max-width: 68ch;
  font-size: clamp(0.95rem, 1.5vw, 1.0625rem);
  line-height: 1.65;
  color: var(--cl-color-text-muted);
}
</style>
