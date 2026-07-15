import { env } from '@/core/config/env';

/** Resolves after `env.mockLatencyMs`, with +/-20% jitter so UI doesn't feel robotic. */
export function simulateLatency(): Promise<void> {
  const jitter = env.mockLatencyMs * 0.2;
  const delay = env.mockLatencyMs + (Math.random() * jitter * 2 - jitter);
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, delay)));
}
