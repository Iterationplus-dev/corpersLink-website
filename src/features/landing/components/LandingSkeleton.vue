<script setup lang="ts">
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';
</script>

<template>
  <div class="landing-skeleton" role="status" aria-label="Loading landing page content">
    <section class="landing-skeleton__hero">
      <div class="landing-skeleton__hero-copy">
        <SkeletonBlock width="220px" height="24px" radius="999px" />
        <SkeletonBlock width="90%" height="44px" />
        <SkeletonBlock width="70%" height="44px" />
        <SkeletonBlock width="60%" height="18px" />
        <div class="landing-skeleton__row">
          <SkeletonBlock width="180px" height="52px" radius="12px" />
          <SkeletonBlock width="180px" height="52px" radius="12px" />
        </div>
        <div class="landing-skeleton__row">
          <SkeletonBlock width="90px" height="40px" />
          <SkeletonBlock width="90px" height="40px" />
          <SkeletonBlock width="90px" height="40px" />
        </div>
      </div>
      <SkeletonBlock height="320px" radius="20px" />
    </section>

    <section class="landing-skeleton__cards">
      <SkeletonBlock v-for="n in 3" :key="n" height="180px" radius="16px" />
    </section>
  </div>
</template>

<style scoped>
.landing-skeleton {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.landing-skeleton__hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.landing-skeleton__hero-copy {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.landing-skeleton__row {
  display: flex;
  gap: 1rem;
}

.landing-skeleton__cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 960px) {
  .landing-skeleton__hero {
    grid-template-columns: 1.05fr 1fr;
  }

  .landing-skeleton__cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
