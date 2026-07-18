<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useOnboardingFlow } from '../composables/useOnboardingFlow';

const router = useRouter();
const { currentSlide, totalSlides, isLastSlide, progressPercent, stepLabel, goNext, goToSlide } =
  useOnboardingFlow();

const ctaLabels = ['Get Started', 'Next', 'Reserve My Seat'];

function handleSkip(): void {
  router.push('/register');
}

function handlePrimaryAction(): void {
  if (isLastSlide.value) {
    router.push('/register');
    return;
  }
  goNext();
}
</script>

<template>
  <main class="onboarding-view">
    <header class="onboarding-view__header">
      <router-link to="/" class="onboarding-view__brand">
        <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="13" fill="#16815A" />
          <path
            d="M34.3 15.3 A13.5 13.5 0 1 0 34.3 32.7"
            fill="none"
            stroke="#FFFFFF"
            stroke-width="8.5"
            stroke-linecap="round"
          />
          <circle cx="36.5" cy="24" r="4.6" fill="#FFFFFF" />
        </svg>
        <span class="onboarding-view__wordmark">Corpers<strong>Link</strong></span>
      </router-link>

      <div class="onboarding-view__progress-group">
        <div class="onboarding-view__step-row">
          <span class="onboarding-view__step-pill">{{ stepLabel }}</span>
          <button
            v-if="!isLastSlide"
            type="button"
            class="onboarding-view__skip"
            @click="handleSkip"
          >
            Skip
          </button>
        </div>
        <div class="onboarding-view__progress-track">
          <div
            class="onboarding-view__progress-fill"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
      </div>
    </header>

    <section class="onboarding-view__body">
      <!-- Slide 1: the problem -->
      <template v-if="currentSlide === 0">
        <div class="onboarding-view__copy">
          <h1 class="onboarding-view__title">Avoid transport chaos on camp day.</h1>
          <p class="onboarding-view__text">
            Buses fill up fast, prices go up, and last-minute stress is real. Don't get left
            behind.
          </p>
          <div class="onboarding-view__callout onboarding-view__callout--danger">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3.5 2 20.5h20L12 3.5z"
                fill="none"
                stroke="var(--cl-color-danger)"
                stroke-width="1.75"
                stroke-linejoin="round"
              />
              <path
                d="M12 9.5v5"
                stroke="var(--cl-color-danger)"
                stroke-width="1.75"
                stroke-linecap="round"
              />
              <circle cx="12" cy="17.25" r="1" fill="var(--cl-color-danger)" />
            </svg>
            <span
              >Thousands of corpers struggle to get a vehicle to the orientation camp every
              year.</span
            >
          </div>
        </div>
        <div class="onboarding-view__media onboarding-view__media--danger">
          <svg width="120" height="120" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3 16V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7"
              fill="none"
              stroke="var(--cl-color-danger)"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect
              x="3"
              y="16"
              width="18"
              height="3"
              rx="1"
              fill="none"
              stroke="var(--cl-color-danger)"
              stroke-width="1.5"
            />
            <circle cx="7" cy="20" r="1.4" fill="var(--cl-color-danger)" />
            <circle cx="17" cy="20" r="1.4" fill="var(--cl-color-danger)" />
            <path
              d="M6 9v4M12 9v4M18 9v4"
              stroke="var(--cl-color-danger)"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </template>

      <!-- Slide 2: book in minutes -->
      <template v-else-if="currentSlide === 1">
        <div class="onboarding-view__copy">
          <h1 class="onboarding-view__title">Book your verified seat in minutes.</h1>
          <p class="onboarding-view__text">
            Choose your institution, pick a bus, select your seat and pay securely.
          </p>
          <div class="onboarding-view__feature-strip">
            <div class="onboarding-view__feature">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  fill="none"
                  stroke="var(--cl-color-green)"
                  stroke-width="1.6"
                />
                <path
                  d="M7 9h2M7 13h2M15 9h2M15 13h2"
                  stroke="var(--cl-color-green)"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              <span>Seat availability.</span>
            </div>
            <div class="onboarding-view__feature">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="13"
                  rx="2.5"
                  fill="none"
                  stroke="var(--cl-color-green)"
                  stroke-width="1.6"
                />
                <path d="M3 10.5h18" stroke="var(--cl-color-green)" stroke-width="1.6" />
              </svg>
              <span>Secure payments</span>
            </div>
            <div class="onboarding-view__feature">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 3.5l7 3v5c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5v-5l7-3z"
                  fill="none"
                  stroke="var(--cl-color-green)"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4.5"
                  fill="none"
                  stroke="var(--cl-color-green)"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Verified transporters</span>
            </div>
          </div>
        </div>
        <div class="onboarding-view__media onboarding-view__media--navy">
          <svg width="120" height="120" viewBox="0 0 24 24" aria-hidden="true">
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="3"
              fill="none"
              stroke="var(--cl-color-navy)"
              stroke-width="1.5"
            />
            <path
              d="M8 12h8M12 8v8"
              stroke="var(--cl-color-navy)"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </template>

      <!-- Slide 3: confidence -->
      <template v-else>
        <div class="onboarding-view__copy">
          <h1 class="onboarding-view__title">Travel with confidence. Arrive stress-free.</h1>
          <p class="onboarding-view__text">
            Get your e-receipt, trip details, and updates — all in one place.
          </p>
          <div class="onboarding-view__callout onboarding-view__callout--green">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9.5" fill="none" stroke="var(--cl-color-green)" stroke-width="1.75" />
              <path
                d="M8 12.5l2.5 2.5 5.5-6"
                fill="none"
                stroke="var(--cl-color-green)"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Your seat is secured. Your journey is sorted.</span>
          </div>
          <p class="onboarding-view__signin">
            Already have an account? <router-link to="/signin">Sign in</router-link>
          </p>
        </div>
        <div class="onboarding-view__media onboarding-view__media--green">
          <svg width="120" height="120" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" fill="none" stroke="var(--cl-color-green)" stroke-width="1.5" />
            <path
              d="M8 12.5l2.5 2.5 5.5-6"
              fill="none"
              stroke="var(--cl-color-green)"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </template>
    </section>

    <footer class="onboarding-view__footer">
      <div class="onboarding-view__dots">
        <button
          v-for="index in totalSlides"
          :key="index"
          type="button"
          class="onboarding-view__dot"
          :class="{ 'is-active': currentSlide === index - 1 }"
          :aria-label="`Go to slide ${index}`"
          @click="goToSlide(index - 1)"
        />
      </div>
      <button type="button" class="onboarding-view__cta" @click="handlePrimaryAction">
        {{ ctaLabels[currentSlide] }}
      </button>
    </footer>
  </main>
</template>

<style scoped>
.onboarding-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--cl-color-bg);
}

.onboarding-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  padding: clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 4vw, 3rem) 0;
}

.onboarding-view__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.0625rem;
  color: var(--cl-color-navy);
}

.onboarding-view__wordmark strong {
  font-weight: 800;
}

.onboarding-view__progress-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  min-width: 140px;
}

.onboarding-view__step-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.onboarding-view__step-pill {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--cl-color-text);
  background: var(--cl-color-bg-muted);
  padding: 0.3125rem 0.75rem;
  border-radius: var(--cl-radius-pill);
}

.onboarding-view__skip {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 0.8125rem;
  color: var(--cl-color-text-muted);
  cursor: pointer;
}

.onboarding-view__progress-track {
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background: var(--cl-color-border);
  overflow: hidden;
}

.onboarding-view__progress-fill {
  height: 100%;
  background: var(--cl-color-green);
  transition: width var(--cl-duration-base) var(--cl-ease-standard);
}

.onboarding-view__body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
  padding: clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 3rem);
  max-width: var(--cl-container-max);
  margin: 0 auto;
  width: 100%;
}

.onboarding-view__copy {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.onboarding-view__title {
  font-size: clamp(1.75rem, 4vw, 2.625rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--cl-color-navy-deep);
}

.onboarding-view__text {
  font-size: 1.0625rem;
  line-height: 1.55;
  color: var(--cl-color-text-muted);
  max-width: 46ch;
}

.onboarding-view__callout {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  border-radius: 14px;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.onboarding-view__callout--danger {
  background: var(--cl-color-danger-bg);
  color: var(--cl-color-text);
}

.onboarding-view__callout--green {
  background: var(--cl-color-green-tint);
  color: var(--cl-color-text);
}

.onboarding-view__callout svg {
  flex-shrink: 0;
  margin-top: 0.0625rem;
}

.onboarding-view__signin {
  font-size: 0.9375rem;
  color: var(--cl-color-text-muted);
}

.onboarding-view__signin a {
  font-weight: 700;
  color: var(--cl-color-green);
}

.onboarding-view__feature-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
}

.onboarding-view__feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 0.75rem;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--cl-color-text);
  border-right: 1px solid var(--cl-color-border);
}

.onboarding-view__feature:last-child {
  border-right: none;
}

.onboarding-view__media {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  border-radius: var(--cl-radius-xl);
}

.onboarding-view__media--danger {
  background: var(--cl-color-danger-bg);
}

.onboarding-view__media--navy {
  background: var(--cl-color-bg-muted);
}

.onboarding-view__media--green {
  background: var(--cl-color-green-tint);
}

.onboarding-view__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0 clamp(1.25rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem);
  max-width: var(--cl-container-max);
  margin: 0 auto;
  width: 100%;
}

.onboarding-view__dots {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.onboarding-view__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: var(--cl-color-border);
  cursor: pointer;
}

.onboarding-view__dot.is-active {
  background: var(--cl-color-green);
}

.onboarding-view__cta {
  width: 240px;
  height: 52px;
  border: none;
  border-radius: var(--cl-radius-pill);
  background: var(--cl-color-green);
  color: var(--cl-color-text-inverse);
  font-size: 1rem;
  font-weight: 700;
  box-shadow: var(--cl-shadow-cta);
  cursor: pointer;
  transition:
    transform var(--cl-duration-fast) var(--cl-ease-standard),
    box-shadow var(--cl-duration-fast) var(--cl-ease-standard);
}

.onboarding-view__cta:hover {
  transform: translateY(-1px);
  box-shadow: var(--cl-shadow-cta-strong);
}

@media (min-width: 860px) {
  .onboarding-view__body {
    grid-template-columns: 1fr 1.1fr;
  }
}

@media (max-width: 559px) {
  .onboarding-view__cta {
    width: 100%;
  }
}
</style>
