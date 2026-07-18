import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCountdown } from './useCountdown';

function mountCountdown(initialTarget: Date | null) {
  const target = ref<Date | null>(initialTarget);
  let countdown!: ReturnType<typeof useCountdown>;
  const TestComponent = defineComponent({
    setup() {
      countdown = useCountdown(target);
      return () => h('div', countdown.formatted.value);
    },
  });
  const wrapper = mount(TestComponent);
  return { wrapper, target, countdown };
}

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats the remaining time as m:ss and counts down every second', () => {
    const target = new Date('2026-01-01T00:02:05.000Z');
    const { countdown } = mountCountdown(target);

    expect(countdown.formatted.value).toBe('2:05');

    vi.advanceTimersByTime(5000);
    expect(countdown.formatted.value).toBe('2:00');

    vi.advanceTimersByTime(60000);
    expect(countdown.formatted.value).toBe('1:00');
  });

  it('reports isExpired once the target time has passed', () => {
    const target = new Date('2026-01-01T00:00:03.000Z');
    const { countdown } = mountCountdown(target);

    expect(countdown.isExpired.value).toBe(false);
    vi.advanceTimersByTime(3000);
    expect(countdown.isExpired.value).toBe(true);
  });

  it('is not expired when there is no target date', () => {
    const { countdown } = mountCountdown(null);
    expect(countdown.isExpired.value).toBe(false);
    expect(countdown.formatted.value).toBe('0:00');
  });

  it('restarts the timer when the target date ref changes', async () => {
    const { countdown, target } = mountCountdown(new Date('2026-01-01T00:00:10.000Z'));
    expect(countdown.formatted.value).toBe('0:10');

    target.value = new Date('2026-01-01T00:01:00.000Z');
    await nextTick();
    expect(countdown.formatted.value).toBe('1:00');
  });
});
