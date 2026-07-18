export interface Session {
  id: number;
  deviceName: string;
  lastUsedAt: Date | null;
  createdAt: Date;
  current: boolean;
}
