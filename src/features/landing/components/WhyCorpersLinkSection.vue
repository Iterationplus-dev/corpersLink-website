<script setup lang="ts">
interface WhyFeature {
  key: string;
  title: string;
  body: string;
  iconPath: string;
}

/**
 * Static "Why CorpersLink" copy — there is no dynamic list source for this
 * section yet (unlike testimonials/FAQ/how-it-works), so the four feature
 * cards are hardcoded here, matching facts already established elsewhere
 * in the app's own content (verified transporters, secure payment, instant
 * receipts, 24/7 support).
 */
const features: WhyFeature[] = [
  {
    key: 'verified-transporters',
    title: 'Verified transporters',
    body: 'Every vehicle is vetted and institution-approved before it ever appears on CorpersLink.',
    iconPath: 'M12 3l7 2.5V11c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V5.5zM8.8 11.5l2.3 2.3 4-4.3',
  },
  {
    key: 'secure-payment',
    title: 'Secure payment',
    body: 'Pay the published fare through an encrypted checkout — no cash, no camp-morning surges.',
    iconPath: 'M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8zM4 10h16',
  },
  {
    key: 'instant-receipt',
    title: 'Instant e-receipt',
    body: "Your receipt and manifest entry are generated the moment payment clears — no waiting.",
    iconPath: 'M7 3h10v18l-2.5-1.5L12 21l-2.5-1.5L7 21V3zM9 8h6M9 12h6',
  },
  {
    key: 'round-the-clock-support',
    title: '24/7 support',
    body: 'Our support desk is on standby before and during travel day, right up to arrival at camp.',
    iconPath: 'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  },
];
</script>

<template>
  <section class="why-corperslink" aria-labelledby="why-corperslink-heading">
    <div class="why-corperslink__inner">
      <div class="why-corperslink__heading">
        <p class="why-corperslink__eyebrow">Why CorpersLink</p>
        <h2 id="why-corperslink-heading" class="why-corperslink__title">
          Built for a stress-free trip to camp.
        </h2>
      </div>

      <ul class="why-corperslink__grid">
        <li v-for="feature in features" :key="feature.key" class="why-corperslink__card">
          <div class="why-corperslink__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                :d="feature.iconPath"
                fill="none"
                stroke="var(--cl-color-green)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3 class="why-corperslink__card-title">{{ feature.title }}</h3>
          <p class="why-corperslink__card-body">{{ feature.body }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.why-corperslink {
  background: var(--cl-color-bg-muted);
}

.why-corperslink__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.why-corperslink__heading {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
}

.why-corperslink__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cl-color-green);
}

.why-corperslink__title {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-navy-deep);
  max-width: 32ch;
}

.why-corperslink__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.why-corperslink__card {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-card);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.why-corperslink__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--cl-radius-md);
  background: var(--cl-color-green-tint);
  display: flex;
  align-items: center;
  justify-content: center;
}

.why-corperslink__card-title {
  font-size: 1.03125rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.why-corperslink__card-body {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--cl-color-text-muted);
}

@media (min-width: 640px) {
  .why-corperslink__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .why-corperslink__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
