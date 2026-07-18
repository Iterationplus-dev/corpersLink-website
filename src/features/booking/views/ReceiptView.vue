<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';
import { AppError } from '@/core/types/app-error';
import { bookingService } from '@/features/booking/services';
import type { Booking } from '@/features/booking/types';

import QrPlaceholder from '../components/QrPlaceholder.vue';

const route = useRoute();
const bookingId = Number(route.params.id);

const booking = ref<Booking | null>(null);
const status = ref<'loading' | 'success' | 'error'>('loading');
const error = ref<AppError | null>(null);

async function load(): Promise<void> {
  status.value = 'loading';
  error.value = null;
  try {
    const receipt = await bookingService.getReceipt(bookingId);
    booking.value = receipt.booking;
    status.value = 'success';
  } catch (err) {
    error.value =
      err instanceof AppError ? err : new AppError({ message: 'Failed to load.', kind: 'unknown' });
    status.value = 'error';
  }
}

onMounted(load);
</script>

<template>
  <main id="main-content" class="receipt-view">
    <PageSkeleton v-if="status === 'loading'" :block-count="1" block-height="480px" />

    <div v-else-if="status === 'error'" class="receipt-view__error">
      <ErrorState
        title="We couldn't load this receipt"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="load"
      />
    </div>

    <div v-else-if="booking" class="receipt-view__inner">
      <div class="receipt-view__success">
        <div class="receipt-view__check">
          <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M3 10.5l4.5 4.5L17 5"
              fill="none"
              stroke="#16815A"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="receipt-view__title">Seat confirmed!</div>
        <p>Payment of {{ booking.fare }} received — receipt sent to your email and SMS</p>
      </div>

      <div class="receipt-view__card">
        <div class="receipt-view__card-header">
          <span>CorpersLink Receipt</span>
          <span class="receipt-view__ref">{{ booking.reference }}</span>
        </div>
        <div class="receipt-view__card-body">
          <div class="receipt-view__row">
            <span>Passenger</span><strong>{{ booking.passengerName }}</strong>
          </div>
          <div class="receipt-view__row">
            <span>State code</span><strong>{{ booking.stateCode }}</strong>
          </div>
          <div class="receipt-view__row">
            <span>Call-up no</span><strong>{{ booking.callUpNumber }}</strong>
          </div>
          <div class="receipt-view__row">
            <span>Trip</span><strong>{{ booking.institutionName }}</strong>
          </div>
          <div class="receipt-view__row">
            <span>Vehicle · Seat</span
            ><strong>{{ booking.vehicleName }} · Seat {{ booking.seatLabel }}</strong>
          </div>
          <div class="receipt-view__row">
            <span>Departure</span><strong>{{ booking.departureAt }}</strong>
          </div>
          <div class="receipt-view__row">
            <span>Paid via</span><strong>{{ booking.paymentMethod }}</strong>
          </div>

          <div class="receipt-view__divider" />
          <div class="receipt-view__paid-row">
            <span>Amount paid</span><strong>{{ booking.fare }}</strong>
          </div>

          <div class="receipt-view__qr-section">
            <QrPlaceholder />
            <div class="receipt-view__booking-id">Booking ID: {{ booking.reference }}</div>
            <div class="receipt-view__hint">Show this code at boarding for manifest check-in</div>
          </div>
        </div>
      </div>

      <div class="receipt-view__actions">
        <BaseButton variant="secondary" size="lg" class="receipt-view__btn-outline"
          >Download PDF</BaseButton
        >
        <BaseButton to="/dashboard" variant="primary" size="lg" class="receipt-view__btn-solid"
          >View my trip</BaseButton
        >
      </div>
    </div>
  </main>
</template>

<style scoped>
.receipt-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.receipt-view__inner {
  max-width: 520px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem clamp(1.25rem, 3vw, 2.5rem) 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.receipt-view__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  text-align: center;
}

.receipt-view__check {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--cl-color-green-tint);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.375rem;
}

.receipt-view__title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.receipt-view__success p {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.receipt-view__card {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  overflow: hidden;
}

.receipt-view__card-header {
  background: var(--cl-color-navy);
  color: #fff;
  padding: 0.875rem 1.125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 700;
}

.receipt-view__ref {
  font-family: monospace;
  color: var(--cl-color-text-inverse-muted);
  font-weight: 400;
}

.receipt-view__card-body {
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.receipt-view__row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--cl-color-text-muted);
}

.receipt-view__row strong {
  color: var(--cl-color-text);
  font-weight: 600;
  text-align: right;
}

.receipt-view__divider {
  border-top: 1.5px dashed var(--cl-color-border);
  margin-top: 0.25rem;
}

.receipt-view__paid-row {
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--cl-color-text);
}

.receipt-view__paid-row strong {
  color: var(--cl-color-green);
  font-size: 1rem;
}

.receipt-view__qr-section {
  border-top: 1.5px dashed var(--cl-color-border);
  padding-top: 0.625rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.receipt-view__booking-id {
  font-size: 0.875rem;
  font-weight: 700;
  font-family: monospace;
  color: var(--cl-color-text);
}

.receipt-view__hint {
  font-size: 0.8125rem;
  color: var(--cl-color-text-muted);
}

.receipt-view__actions {
  display: flex;
  gap: 0.75rem;
}

.receipt-view__actions > * {
  flex: 1;
}

/* Deliberate design distinction: the receipt page's two closing actions are
   navy, not the green used for CTAs elsewhere in the booking flow. */
.receipt-view__actions :deep(.receipt-view__btn-outline) {
  color: var(--cl-color-navy);
  border-color: var(--cl-color-navy);
}

.receipt-view__actions :deep(.receipt-view__btn-solid) {
  background: var(--cl-color-navy);
  color: #fff;
  box-shadow: none;
}

.receipt-view__actions :deep(.receipt-view__btn-solid:hover:not([aria-disabled='true'])) {
  box-shadow: 0 4px 14px rgba(31, 58, 95, 0.3);
}

.receipt-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
