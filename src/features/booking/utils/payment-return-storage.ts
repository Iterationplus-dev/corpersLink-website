import type { PaymentGateway } from '@/features/booking/types';

/**
 * A real gateway redirect is a full page navigation — Pinia state (booking
 * store) doesn't survive it. This is the one piece of state that must, so
 * `PaymentReturnView` can call `verify` and route to the receipt afterward.
 */
const STORAGE_KEY = 'corperslink.payment-return';

interface PaymentReturnState {
  institutionId: number;
  paymentId: number;
  gateway: PaymentGateway;
}

export function savePaymentReturnState(state: PaymentReturnState): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadPaymentReturnState(): PaymentReturnState | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PaymentReturnState;
  } catch {
    return null;
  }
}

export function clearPaymentReturnState(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
