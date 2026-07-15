import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { AppError } from '@/core/types/app-error';

import { useAsyncResource } from './useAsyncResource';

function mountResource<T>(loader: () => Promise<T>) {
  let resource!: ReturnType<typeof useAsyncResource<T>>;
  const TestComponent = defineComponent({
    setup() {
      resource = useAsyncResource(loader);
      return () => h('div', resource.isLoading.value ? 'loading' : 'idle');
    },
  });
  const wrapper = mount(TestComponent);
  return { wrapper, resource };
}

describe('useAsyncResource', () => {
  it('fetches automatically on mount and exposes the resolved data', async () => {
    const loader = vi.fn().mockResolvedValue({ hello: 'world' });
    const { resource } = mountResource(loader);

    expect(loader).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(resource.isReady.value).toBe(true));

    expect(resource.data.value).toEqual({ hello: 'world' });
    expect(resource.hasError.value).toBe(false);
  });

  it('exposes an AppError and hasError=true when the loader rejects', async () => {
    const loader = vi.fn().mockRejectedValue(new AppError({ message: 'nope', kind: 'server' }));
    const { resource } = mountResource(loader);

    await vi.waitFor(() => expect(resource.hasError.value).toBe(true));

    expect(resource.error.value?.kind).toBe('server');
    expect(resource.data.value).toBeNull();
  });

  it('wraps a non-AppError rejection into a generic AppError', async () => {
    const loader = vi.fn().mockRejectedValue(new Error('boom'));
    const { resource } = mountResource(loader);

    await vi.waitFor(() => expect(resource.hasError.value).toBe(true));

    expect(resource.error.value).toBeInstanceOf(AppError);
    expect(resource.error.value?.kind).toBe('unknown');
  });

  it('retry() re-invokes the loader and can recover from an error', async () => {
    const loader = vi
      .fn()
      .mockRejectedValueOnce(new AppError({ message: 'first fails', kind: 'network' }))
      .mockResolvedValueOnce({ ok: true });
    const { resource } = mountResource(loader);

    await vi.waitFor(() => expect(resource.hasError.value).toBe(true));

    await resource.retry();

    expect(loader).toHaveBeenCalledTimes(2);
    expect(resource.isReady.value).toBe(true);
    expect(resource.data.value).toEqual({ ok: true });
  });
});
