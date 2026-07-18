<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import { useCountdown } from '@/composables/useCountdown';
import { AppError } from '@/core/types/app-error';
import { bookingService } from '@/features/booking/services';
import type { PaymentGateway } from '@/features/booking/types';
import { savePaymentReturnState } from '@/features/booking/utils/payment-return-storage';
import { useBookingStore } from '@/stores/booking.store';

import HoldCountdown from '../components/HoldCountdown.vue';
import HoldExpiredState from '../components/HoldExpiredState.vue';
import PaymentFailedState from '../components/PaymentFailedState.vue';
import PaymentMethodList from '../components/PaymentMethodList.vue';

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

const isPreparing = ref(true);
const isPaying = ref(false);
const hasFailed = ref(false);
const prepareError = ref<string | null>(null);

const expiresAt = computed(() =>
  bookingStore.expiresAt ? new Date(bookingStore.expiresAt) : null,
);
const { formatted, isExpired } = useCountdown(expiresAt);

onMounted(async () => {
  if (!bookingStore.holdId) {
    isPreparing.value = false;
    return;
  }
  // Resilient to a page refresh mid-flow: the booking (and its payment) is
  // created here rather than in SeatSelectionView, so re-entering this page
  // with a hold but no booking yet still works.
  if (!bookingStore.bookingId || !bookingStore.paymentId) {
    try {
      const { booking, payment } = await bookingService.createBooking(bookingStore.holdId);
      bookingStore.setBooking(booking.id, payment.id);
    } catch (error) {
      prepareError.value =
        error instanceof AppError ? error.message : 'Could not prepare your booking.';
    }
  }
  isPreparing.value = false;
});

async function pay(): Promise<void> {
  if (!bookingStore.paymentId || !bookingStore.institutionId) return;
  isPaying.value = true;
  hasFailed.value = false;
  try {
    const gateway: PaymentGateway = bookingStore.paymentMethod;
    const { authorizationUrl } = await bookingService.initializePayment(
      bookingStore.paymentId,
      gateway,
    );
    savePaymentReturnState({
      institutionId: bookingStore.institutionId,
      paymentId: bookingStore.paymentId,
      gateway,
    });
    window.location.href = authorizationUrl;
  } catch (error) {
    hasFailed.value = error instanceof AppError;
  } finally {
    isPaying.value = false;
  }
}

function changeMethod(): void {
  hasFailed.value = false;
}

function selectPaymentMethod(value: string): void {
  bookingStore.setPaymentMethod(value as PaymentGateway);
}

function backToVehicles(): void {
  const institutionId = String(route.params.institutionId ?? bookingStore.institutionId ?? '');
  void router.push(`/book/${institutionId}`);
}
</script>

<template>
  <main id="main-content" class="pay-view">
    <div class="pay-view__inner">
      <div class="pay-view__steps">
        <div class="step is-done">
          <span class="step__badge">
            <svg width="10" height="8" viewBox="0 0 12 10" aria-hidden="true">
              <path
                d="M1 5l3.5 3.5L11 1"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="step__label">Institution</span>
        </div>
        <span class="step__line is-done" />
        <div class="step is-done">
          <span class="step__badge">
            <svg width="10" height="8" viewBox="0 0 12 10" aria-hidden="true">
              <path
                d="M1 5l3.5 3.5L11 1"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="step__label">Choose seat</span>
        </div>
        <span class="step__line is-done" />
        <div class="step is-active">
          <span class="step__badge">3</span>
          <span class="step__label">Pay</span>
        </div>
        <span class="step__line" />
        <div class="step">
          <span class="step__badge">4</span>
          <span class="step__label">Receipt</span>
        </div>
      </div>

      <template v-if="!bookingStore.holdId">
        <div class="pay-view__no-hold">
          <p>No active seat hold found.</p>
          <BaseButton variant="primary" size="md" @click="router.push('/institutions')"
            >Browse institutions</BaseButton
          >
        </div>
      </template>

      <template v-else-if="isExpired">
        <HoldExpiredState :seat-label="bookingStore.seatLabel ?? ''" @pick-new-seat="backToVehicles" />
      </template>

      <template v-else-if="prepareError">
        <div class="pay-view__no-hold">
          <p>{{ prepareError }}</p>
          <BaseButton variant="primary" size="md" @click="backToVehicles">Try again</BaseButton>
        </div>
      </template>

      <template v-else-if="isPreparing">
        <div class="pay-view__no-hold">
          <p>Preparing your booking…</p>
        </div>
      </template>

      <template v-else-if="hasFailed">
        <PaymentFailedState
          :seat-label="bookingStore.seatLabel ?? ''"
          :hold-time-remaining="formatted"
          @try-again="pay"
          @change-method="changeMethod"
        />
      </template>

      <template v-else>
        <h1 class="pay-view__title">Confirm &amp; pay</h1>

        <div class="pay-view__grid">
          <div class="pay-view__summary-card">
            <div class="pay-view__row">
              <span>Vehicle</span><strong>{{ bookingStore.vehicleName }}</strong>
            </div>
            <div class="pay-view__row">
              <span>Seat</span><strong>{{ bookingStore.seatLabel }}</strong>
            </div>
            <div class="pay-view__row">
              <span>Departure</span><strong>{{ bookingStore.departureTime }}</strong>
            </div>
            <div class="pay-view__row">
              <span>Pickup point</span><strong>{{ bookingStore.pickupPoint }}</strong>
            </div>
            <div class="pay-view__divider-line" />
            <div class="pay-view__total-row">
              <span>Total</span><strong>{{ bookingStore.fare }}</strong>
            </div>

            <div class="pay-view__notice">
              Published fare set by your institution. Fares are non-refundable after the departure
              manifest is generated.
            </div>

            <HoldCountdown :seat-label="bookingStore.seatLabel ?? ''" :formatted-time="formatted" />

            <BaseButton
              variant="secondary"
              size="md"
              class="pay-view__change-seat-btn"
              @click="backToVehicles"
              >← Change seat</BaseButton
            >
          </div>

          <div class="pay-view__methods">
            <div class="pay-view__methods-title">Pay with</div>
            <PaymentMethodList
              :model-value="bookingStore.paymentMethod"
              @update:model-value="selectPaymentMethod"
            />
            <BaseButton
              variant="primary"
              size="lg"
              :loading="isPaying"
              class="pay-view__pay-btn"
              @click="pay"
            >
              Pay {{ bookingStore.fare }}
            </BaseButton>
            <router-link to="/support" class="pay-view__support-link"
              >Having trouble paying? Chat with support</router-link
            >
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped>
.pay-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pay-view__inner {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  padding: 1.5rem clamp(1.25rem, 3vw, 2.5rem) 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.pay-view__steps {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--cl-color-text-muted);
  justify-content: center;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.4375rem;
}

.step__badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--cl-color-bg-muted);
  color: var(--cl-color-text-subtle);
}

.step.is-done .step__badge {
  background: var(--cl-color-green);
}

.step.is-active .step__badge {
  background: var(--cl-color-navy);
  color: #fff;
}

.step.is-done .step__label {
  color: var(--cl-color-green);
  font-weight: 700;
}

.step.is-active .step__label {
  color: var(--cl-color-navy);
  font-weight: 700;
}

.step__line {
  width: 24px;
  height: 2px;
  background: var(--cl-color-border);
}

.step__line.is-done {
  background: var(--cl-color-green);
}

.pay-view__title {
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-text);
}

.pay-view__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.pay-view__summary-card,
.pay-view__methods {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pay-view__row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.pay-view__row strong {
  color: var(--cl-color-text);
  font-weight: 600;
  text-align: right;
}

.pay-view__change-seat-btn {
  align-self: flex-start;
}

.pay-view__divider-line {
  height: 1px;
  background: var(--cl-color-border);
}

.pay-view__total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--cl-color-text);
}

.pay-view__total-row strong {
  font-size: 1.375rem;
  color: var(--cl-color-navy);
}

.pay-view__notice {
  background: var(--cl-color-warning-bg);
  border: 1px solid var(--cl-color-warning-border);
  border-radius: var(--cl-radius-md);
  padding: 0.75rem 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--cl-color-warning-text);
}

.pay-view__methods-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--cl-color-text);
}

.pay-view__pay-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.pay-view__support-link {
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--cl-color-navy);
}

.pay-view__no-hold {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 0;
}

@media (min-width: 900px) {
  .pay-view__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
