import type { Session, SessionDTO } from '@/features/account/types';

export function mapSession(dto: SessionDTO): Session {
  return {
    id: dto.id,
    deviceName: dto.deviceName,
    lastUsedAt: dto.lastUsedAt ? new Date(dto.lastUsedAt) : null,
    createdAt: new Date(dto.createdAt),
    current: dto.current,
  };
}
