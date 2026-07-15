import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { useOnlineStatus } from './useOnlineStatus';

const TestComponent = defineComponent({
  setup() {
    const { isOnline } = useOnlineStatus();
    return () => h('span', String(isOnline.value));
  },
});

describe('useOnlineStatus', () => {
  it('reflects navigator.onLine at mount time', () => {
    const wrapper = mount(TestComponent);
    expect(wrapper.text()).toBe(String(navigator.onLine));
    wrapper.unmount();
  });

  it('flips to false when the window "offline" event fires', async () => {
    const wrapper = mount(TestComponent);

    window.dispatchEvent(new Event('offline'));
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toBe('false');
    wrapper.unmount();
  });

  it('flips back to true when the window "online" event fires', async () => {
    const wrapper = mount(TestComponent);

    window.dispatchEvent(new Event('offline'));
    await wrapper.vm.$nextTick();
    window.dispatchEvent(new Event('online'));
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toBe('true');
    wrapper.unmount();
  });

  it('removes its event listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const wrapper = mount(TestComponent);
    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    removeSpy.mockRestore();
  });
});
