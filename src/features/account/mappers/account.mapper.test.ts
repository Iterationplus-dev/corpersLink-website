import { describe, expect, it } from 'vitest';

import type { SessionDTO } from '@/features/account/types';

import { mapSession } from './account.mapper';

describe('mapSession', () => {
  it('maps camelCase fields and parses dates', () => {
    const dto: SessionDTO = {
      id: 7,
      deviceName: 'Chrome on Windows',
      lastUsedAt: '2026-07-17T10:00:00.000Z',
      createdAt: '2026-06-01T09:00:00.000Z',
      current: true,
    };

    const session = mapSession(dto);

    expect(session.id).toBe(7);
    expect(session.deviceName).toBe('Chrome on Windows');
    expect(session.lastUsedAt).toEqual(new Date('2026-07-17T10:00:00.000Z'));
    expect(session.createdAt).toEqual(new Date('2026-06-01T09:00:00.000Z'));
    expect(session.current).toBe(true);
  });

  it('handles a session that has never been used since creation', () => {
    const dto: SessionDTO = {
      id: 8,
      deviceName: 'Safari on iPhone',
      lastUsedAt: null,
      createdAt: '2026-07-01T09:00:00.000Z',
      current: false,
    };

    expect(mapSession(dto).lastUsedAt).toBeNull();
  });
});
