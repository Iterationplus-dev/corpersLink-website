<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';
import { useCountdown } from '@/composables/useCountdown';
import { AppError } from '@/core/types/app-error';
import { bookingService } from '@/features/booking/services';
import type { Seat, Vehicle } from '@/features/booking/types';
import { describeSeatPosition } from '@/features/booking/utils/seat-grid';
import { institutionsService } from '@/features/institutions/services';
import { useBookingStore } from '@/stores/booking.store';

import HoldCountdown from '../components/HoldCountdown.vue';
import HoldExpiredState from '../components/HoldExpiredState.vue';
import SeatMap from '../components/SeatMap.vue';
import VehicleList from '../components/VehicleList.vue';

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

const institutionId = computed(() => Number(route.params.institutionId));
const institutionName = ref('');
const vehicles = ref<Vehicle[]>([]);
const activeVehicleId = ref<number | null>(null);
const seats = ref<Seat[]>([]);
const status = ref<'loading' | 'success' | 'error'>('loading');
const seatsStatus = ref<'idle' | 'loading' | 'error'>('idle');
const error = ref<AppError | null>(null);
const isHolding = ref(false);
const holdError = ref<string | null>(null);

const activeVehicle = computed(
  () => vehicles.value.find((v) => v.id === activeVehicleId.value) ?? null,
);

const expiresAt = computed(() =>
  bookingStore.expiresAt ? new Date(bookingStore.expiresAt) : null,
);
const { formatted, isExpired } = useCountdown(expiresAt);

async function loadSeats(vehicleId: number): Promise<void> {
  seatsStatus.value = 'loading';
  try {
    seats.value = await bookingService.getSeats(vehicleId);
    seatsStatus.value = 'idle';
  } catch {
    seatsStatus.value = 'error';
  }
}

async function load(): Promise<void> {
  status.value = 'loading';
  error.value = null;
  try {
    const [institution, vehicleList] = await Promise.all([
      institutionsService.getById(institutionId.value),
      bookingService.getVehicles(institutionId.value),
    ]);
    institutionName.value = institution.name;
    vehicles.value = vehicleList;
    activeVehicleId.value = vehicleList[0]?.id ?? null;
    status.value = 'success';
  } catch (err) {
    error.value =
      err instanceof AppError ? err : new AppError({ message: 'Failed to load.', kind: 'unknown' });
    status.value = 'error';
  }
}

onMounted(load);

watch(activeVehicleId, (vehicleId) => {
  if (vehicleId !== null) void loadSeats(vehicleId);
});

async function selectSeat(seat: Seat): Promise<void> {
  if (!activeVehicle.value) return;
  isHolding.value = true;
  holdError.value = null;
  try {
    const hold = await bookingService.holdSeat(activeVehicle.value.id, seat.id);
    bookingStore.setHold({
      institutionId: institutionId.value,
      vehicleId: activeVehicle.value.id,
      vehicleName: activeVehicle.value.name,
      route: activeVehicle.value.route,
      pickupPoint: activeVehicle.value.pickupPoint,
      departureTime: activeVehicle.value.departureTime,
      fare: activeVehicle.value.fare,
      holdId: hold.id,
      seatId: hold.seatId,
      seatLabel: hold.seatLabel,
      seatRow: seat.row,
      seatPosition: seat.position,
      expiresAt: hold.expiresAt.toISOString(),
    });
    // Holding a new seat auto-releases any previous hold server-side, and
    // this seat now flips to held_by_you — re-fetch to reflect both.
    await loadSeats(activeVehicle.value.id);
  } catch (err) {
    holdError.value =
      err instanceof AppError ? err.message : 'Could not hold that seat. Please try another.';
  } finally {
    isHolding.value = false;
  }
}

function pickNewSeat(): void {
  bookingStore.clear();
  if (activeVehicleId.value !== null) void loadSeats(activeVehicleId.value);
}

function goToPayment(): void {
  void router.push(`/book/${institutionId.value}/pay`);
}
</script>

<template>
  <main id="main-content" class="seat-view">
    <PageSkeleton v-if="status === 'loading'" :block-count="1" block-height="420px" />

    <div v-else-if="status === 'error'" class="seat-view__error">
      <ErrorState
        title="We couldn't load this institution"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="load"
      />
    </div>

    <div v-else class="seat-view__inner">
      <div class="seat-view__steps">
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
        <div class="step is-active">
          <span class="step__badge">2</span>
          <span class="step__label">Choose seat</span>
        </div>
        <span class="step__line" />
        <div class="step">
          <span class="step__badge">3</span>
          <span class="step__label">Pay</span>
        </div>
        <span class="step__line" />
        <div class="step">
          <span class="step__badge">4</span>
          <span class="step__label">Receipt</span>
        </div>
      </div>

      <div class="seat-view__grid">
        <VehicleList
          :vehicles="vehicles"
          :active-vehicle-id="activeVehicleId"
          @select="(id) => (activeVehicleId = id)"
        />

        <div class="seat-view__map-card">
          <template v-if="bookingStore.hasActiveHold && isExpired">
            <HoldExpiredState :seat-label="bookingStore.seatLabel ?? ''" @pick-new-seat="pickNewSeat" />
          </template>
          <template v-else-if="seatsStatus === 'loading'">
            <PageSkeleton :block-count="1" block-height="320px" />
          </template>
          <template v-else-if="seatsStatus === 'error'">
            <ErrorState
              title="We couldn't load the seat map"
              message="Please check your connection and try again."
              @retry="activeVehicleId !== null && loadSeats(activeVehicleId)"
            />
          </template>
          <template v-else-if="activeVehicle">
            <SeatMap
              :title="`${activeVehicle.name} — seat map`"
              :seats="seats"
              :disabled="isHolding"
              @select-seat="selectSeat"
            />
            <p v-if="holdError" class="seat-view__hold-error" role="alert">{{ holdError }}</p>
          </template>
        </div>

        <aside class="seat-view__summary">
          <template
            v-if="
              bookingStore.hasActiveHold && bookingStore.vehicleId === activeVehicleId && !isExpired
            "
          >
            <div class="seat-view__summary-title">Your selection</div>
            <div class="seat-view__seat-badge">
              <span>SEAT</span>
              <strong>{{ bookingStore.seatLabel }}</strong>
            </div>
            <div class="seat-view__seat-position">
              {{ describeSeatPosition(bookingStore.seatRow ?? 0, bookingStore.seatPosition ?? 'window') }}
            </div>
            <div class="seat-view__vehicle-name">{{ bookingStore.vehicleName }}</div>
            <HoldCountdown :seat-label="bookingStore.seatLabel ?? ''" :formatted-time="formatted" />
            <div class="seat-view__fare-row">
              <span>Published fare</span>
              <strong>{{ bookingStore.fare }}</strong>
            </div>
            <BaseButton variant="primary" size="lg" @click="goToPayment"
              >Continue to payment</BaseButton
            >
            <p class="seat-view__note">
              One active seat per corps member. Your hold releases automatically if payment isn't
              completed.
            </p>
          </template>
          <template v-else>
            <p class="seat-view__placeholder">Select an available seat on the map to continue.</p>
          </template>
        </aside>
      </div>
    </div>
  </main>
</template>

<style scoped>
.seat-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.seat-view__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  width: 100%;
  padding: 1.5rem clamp(1.25rem, 3vw, 2.5rem) 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.seat-view__steps {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--cl-color-text-muted);
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

.seat-view__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
}

.seat-view__map-card {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.seat-view__hold-error {
  font-size: 0.8125rem;
  color: var(--cl-color-danger);
  text-align: center;
}

.seat-view__summary {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.seat-view__summary-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.seat-view__seat-badge {
  width: 52px;
  height: 52px;
  border-radius: var(--cl-radius-md);
  background: var(--cl-color-green);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.seat-view__seat-badge span {
  font-size: 0.75rem;
  opacity: 0.85;
}

.seat-view__seat-position {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--cl-color-text);
  margin-top: -0.375rem;
}

.seat-view__vehicle-name {
  font-size: 0.8125rem;
  color: var(--cl-color-text-muted);
  margin-top: -0.5rem;
}

.seat-view__seat-badge strong {
  font-size: 1.25rem;
  line-height: 1;
}

.seat-view__fare-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.seat-view__fare-row strong {
  font-size: 1.25rem;
  color: var(--cl-color-navy);
}

.seat-view__note {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--cl-color-text-muted);
  text-align: center;
}

.seat-view__placeholder {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
  text-align: center;
  padding: 1rem 0;
}

.seat-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

@media (min-width: 1024px) {
  .seat-view__grid {
    grid-template-columns: 320px 1fr 300px;
  }

  .seat-view__summary {
    position: sticky;
    top: 1.5rem;
  }
}
</style>
