import { computed, ref } from 'vue';

const TOTAL_SLIDES = 3;

/**
 * Local slide-index state for the 3-slide onboarding/welcome flow. Pure UI
 * state only — the flow is static marketing content, no store or API.
 */
export function useOnboardingFlow() {
  const currentSlide = ref(0);

  const isLastSlide = computed(() => currentSlide.value === TOTAL_SLIDES - 1);
  const progressPercent = computed(() => ((currentSlide.value + 1) / TOTAL_SLIDES) * 100);
  const stepLabel = computed(() => `${currentSlide.value + 1} / ${TOTAL_SLIDES}`);

  function goNext(): void {
    if (currentSlide.value < TOTAL_SLIDES - 1) {
      currentSlide.value += 1;
    }
  }

  function goToSlide(index: number): void {
    if (index >= 0 && index < TOTAL_SLIDES) {
      currentSlide.value = index;
    }
  }

  return {
    currentSlide,
    totalSlides: TOTAL_SLIDES,
    isLastSlide,
    progressPercent,
    stepLabel,
    goNext,
    goToSlide,
  };
}
