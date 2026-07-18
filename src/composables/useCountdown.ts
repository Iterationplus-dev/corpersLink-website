import { computed, onUnmounted, ref, watch, type Ref } from 'vue';

/**
 * Ticks down to `targetDate` every second. Generic enough to back any
 * expiry-style UI (seat holds, OTP resend timers, etc.).
 */
export function useCountdown(targetDate: Ref<Date | null>) {
  const remainingMs = ref(0);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function tick(): void {
    remainingMs.value = targetDate.value ? Math.max(0, targetDate.value.getTime() - Date.now()) : 0;
  }

  function start(): void {
    stop();
    tick();
    intervalId = setInterval(tick, 1000);
  }

  function stop(): void {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  watch(
    targetDate,
    (value) => {
      if (value) start();
      else {
        stop();
        remainingMs.value = 0;
      }
    },
    { immediate: true },
  );

  onUnmounted(stop);

  const isExpired = computed(() => targetDate.value !== null && remainingMs.value <= 0);
  const formatted = computed(() => {
    const totalSeconds = Math.ceil(remainingMs.value / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  });

  return { remainingMs, formatted, isExpired, stop };
}
