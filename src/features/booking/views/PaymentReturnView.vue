<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import { AppError } from '@/core/types/app-error';
import { bookingService } from '@/features/booking/services';
import {
  clearPaymentReturnState,
  loadPaymentReturnState,
} from '@/features/booking/utils/payment-return-storage';
import { useBookingStore } from '@/stores/booking.store';

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

type Outcome = 'verifying' | 'success' | 'failed' | 'lost-session';
const outcome = ref<Outcome>('verifying');
const errorMessage = ref<string | null>(null);

// Gateways use different query-param names for their own reference — a
// best-effort read across the common ones. The backend mostly ignores this
// value anyway (it re-derives the real reference from the payment record).
function extractGatewayReference(): string | undefined {
  const query = route.query;
  const candidate = query.reference ?? query.trxref ?? query.tx_ref ?? query.transaction_id;
  return typeof candidate === 'string' ? candidate : undefined;
}

onMounted(async () => {
  const state = loadPaymentReturnState();
  if (!state) {
    outcome.value = 'lost-session';
    return;
  }

  try {
    const booking = await bookingService.verifyPayment(state.paymentId, extractGatewayReference());
    clearPaymentReturnState();
    bookingStore.clear();
    outcome.value = 'success';
    await router.replace(`/bookings/${booking.id}/receipt`);
  } catch (error) {
    clearPaymentReturnState();
    outcome.value = 'failed';
    errorMessage.value =
      error instanceof AppError ? error.message : "We couldn't confirm your payment.";
  }
});

function pickASeat(): void {
  const state = loadPaymentReturnState();
  void router.push(state ? `/book/${state.institutionId}` : '/institutions');
}
</script>

<template>
  <main id="main-content" class="pay-return">
    <div class="pay-return__card">
      <template v-if="outcome === 'verifying'">
        <div class="pay-return__spinner" aria-hidden="true" />
        <h1>Confirming your payment…</h1>
        <p>This only takes a moment. Please don't close this page.</p>
      </template>

      <template v-else-if="outcome === 'failed'">
        <h1>We couldn't confirm your payment</h1>
        <p>{{ errorMessage }}</p>
        <p class="pay-return__hint">
          If you were charged, the reversal is automatic within 24 hours — please don't pay twice.
          Your seat hold may have expired during checkout, so you may need to pick a seat again.
        </p>
        <BaseButton variant="primary" size="md" @click="pickASeat">Pick a seat</BaseButton>
        <router-link to="/support" class="pay-return__support">Contact support</router-link>
      </template>

      <template v-else-if="outcome === 'lost-session'">
        <h1>We lost track of your payment session</h1>
        <p>
          Check your dashboard — if the payment went through, your booking will already show there.
        </p>
        <BaseButton to="/dashboard" variant="primary" size="md">Go to dashboard</BaseButton>
      </template>
    </div>
  </main>
</template>

<style scoped>
.pay-return {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.pay-return__card {
  width: 100%;
  max-width: 440px;
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-xl);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  text-align: center;
}

.pay-return__spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid var(--cl-color-border);
  border-top-color: var(--cl-color-green);
  animation: pay-return-spin 0.8s linear infinite;
}

@keyframes pay-return-spin {
  to {
    transform: rotate(360deg);
  }
}

.pay-return__card h1 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.pay-return__card p {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--cl-color-text-muted);
}

.pay-return__hint {
  background: var(--cl-color-warning-bg);
  border: 1px solid var(--cl-color-warning-border);
  border-radius: var(--cl-radius-md);
  padding: 0.75rem 1rem;
  color: var(--cl-color-warning-text);
  font-size: 0.8125rem;
}

.pay-return__support {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--cl-color-navy);
}
</style>
