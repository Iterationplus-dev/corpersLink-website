<script setup lang="ts">
import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';

import { useDashboardPage } from '../composables/useDashboardPage';

const { data, isLoading, hasError, isReady, error, retry } = useDashboardPage();
</script>

<template>
  <main id="main-content" class="dashboard-view">
    <template v-if="isReady && data">
      <div class="dashboard-view__inner">
        <div class="dashboard-view__heading">
          <h1>Welcome back, {{ data.fullName.split(' ')[0] }}</h1>
          <p>{{ data.meta }}</p>
        </div>

        <div class="dashboard-view__grid">
          <div v-if="data.upcomingTrip" class="dashboard-view__trip-card">
            <div class="dashboard-view__trip-top">
              <span class="dashboard-view__trip-label">Upcoming trip</span>
              <span class="dashboard-view__trip-badge">CONFIRMED</span>
            </div>
            <div class="dashboard-view__trip-body">
              <div class="dashboard-view__seat-badge">
                <span>SEAT</span>
                <strong>{{ data.upcomingTrip.seatLabel }}</strong>
              </div>
              <div class="dashboard-view__trip-info">
                <div class="dashboard-view__trip-name">
                  {{ data.upcomingTrip.vehicleName }} — {{ data.upcomingTrip.route }}
                </div>
                <div class="dashboard-view__trip-meta">
                  {{ data.upcomingTrip.departureDateLabel }} · Departs
                  {{ data.upcomingTrip.departureTimeLabel }} · {{ data.upcomingTrip.pickupPoint }}
                </div>
              </div>
            </div>
            <div class="dashboard-view__trip-actions">
              <router-link :to="`/bookings/${data.upcomingTrip.bookingId}/receipt`"
                >Download receipt</router-link
              >
              <button type="button">View seat</button>
              <button type="button">Track departure</button>
            </div>
          </div>
          <div v-else class="dashboard-view__trip-card dashboard-view__trip-card--empty">
            <div class="dashboard-view__trip-label">No upcoming trip</div>
            <p>You haven't booked a seat yet.</p>
            <router-link to="/institutions">Browse institutions →</router-link>
          </div>

          <div class="dashboard-view__side-card">
            <div class="dashboard-view__side-label">Payment status</div>
            <div class="dashboard-view__side-value is-paid">
              {{ data.upcomingTrip ? 'Paid' : '—' }}
            </div>
            <p v-if="data.upcomingTrip">
              {{ data.upcomingTrip.fare }} · {{ data.upcomingTrip.paymentMethod }} ·
              {{ data.upcomingTrip.paidAt }}
            </p>
            <router-link
              v-if="data.upcomingTrip"
              class="dashboard-view__side-link"
              :to="`/bookings/${data.upcomingTrip.bookingId}/receipt`"
              >View receipt →</router-link
            >
          </div>

          <div class="dashboard-view__side-card">
            <div class="dashboard-view__side-label">Departure</div>
            <div class="dashboard-view__side-value">
              {{ data.upcomingTrip ? data.upcomingTrip.countdownLabel : '—' }}
            </div>
            <p v-if="data.manifestClosesAt">Manifest closes {{ data.manifestClosesAt }}</p>
            <router-link
              v-if="data.upcomingTrip"
              class="dashboard-view__side-link"
              :to="`/bookings/${data.upcomingTrip.bookingId}/receipt`"
              >Trip details →</router-link
            >
          </div>
        </div>

        <div class="dashboard-view__history">
          <div class="dashboard-view__history-title">Booking history</div>
          <div class="dashboard-view__history-header">
            <span>Reference</span><span>Trip</span><span>Seat</span><span>Amount</span
            ><span>Status</span>
          </div>
          <div
            v-for="item in data.history"
            :key="item.bookingId"
            class="dashboard-view__history-row"
          >
            <span class="mono">{{ item.reference }}</span>
            <span>{{ item.trip }}</span>
            <span class="bold">{{ item.seatLabel }}</span>
            <span>{{ item.amount }}</span>
            <span
              class="dashboard-view__status-chip"
              :style="{ background: item.statusColor.bg, color: item.statusColor.fg }"
              >{{ item.statusLabel }}</span
            >
          </div>
          <p v-if="data.history.length === 0" class="dashboard-view__history-empty">
            No past bookings yet.
          </p>
        </div>
      </div>
    </template>

    <PageSkeleton v-else-if="isLoading" :block-count="3" />

    <div v-else-if="hasError" class="dashboard-view__error">
      <ErrorState
        title="We couldn't load your dashboard"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="retry"
      />
    </div>
  </main>
</template>

<style scoped>
.dashboard-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-view__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  width: 100%;
  padding: 2rem clamp(1.25rem, 3vw, 2.5rem) 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-view__heading h1 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-text);
}

.dashboard-view__heading p {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.dashboard-view__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.dashboard-view__trip-card {
  background: var(--cl-color-navy);
  color: var(--cl-color-text-inverse);
  border-radius: var(--cl-radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard-view__trip-card--empty {
  background: var(--cl-color-bg);
  color: var(--cl-color-text);
  border: 1px solid var(--cl-color-border);
}

.dashboard-view__trip-card--empty a {
  font-weight: 700;
  color: var(--cl-color-navy);
}

.dashboard-view__trip-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-view__trip-label {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cl-color-text-inverse-muted);
}

.dashboard-view__trip-card--empty .dashboard-view__trip-label {
  color: var(--cl-color-text-muted);
}

.dashboard-view__trip-badge {
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.25rem 0.6875rem;
  border-radius: var(--cl-radius-pill);
  background: var(--cl-color-green);
}

.dashboard-view__trip-body {
  display: flex;
  align-items: center;
  gap: 1.125rem;
}

.dashboard-view__seat-badge {
  width: 60px;
  height: 60px;
  border-radius: var(--cl-radius-md);
  background: var(--cl-color-green);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dashboard-view__seat-badge span {
  font-size: 0.75rem;
  opacity: 0.85;
}

.dashboard-view__seat-badge strong {
  font-size: 1.375rem;
  line-height: 1;
}

.dashboard-view__trip-name {
  font-size: 1.0625rem;
  font-weight: 700;
}

.dashboard-view__trip-meta {
  font-size: 0.875rem;
  color: var(--cl-color-text-inverse-muted);
}

.dashboard-view__trip-actions {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.dashboard-view__trip-actions a,
.dashboard-view__trip-actions button {
  height: 38px;
  padding: 0 1rem;
  border-radius: var(--cl-radius-md);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.28);
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 700;
  font-family: inherit;
  color: #fff;
  cursor: pointer;
}

.dashboard-view__side-card {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.dashboard-view__side-label {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cl-color-text-muted);
}

.dashboard-view__side-value {
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.dashboard-view__side-value.is-paid {
  color: var(--cl-color-green);
}

.dashboard-view__side-card p {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.dashboard-view__side-link {
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--cl-color-navy);
}

.dashboard-view__history {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  overflow: hidden;
}

.dashboard-view__history-title {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--cl-color-border);
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.dashboard-view__history-header,
.dashboard-view__history-row {
  display: grid;
  grid-template-columns: 1.2fr 2fr 1fr 1fr 1fr;
  padding: 0.75rem 1.25rem;
  align-items: center;
  gap: 0.5rem;
}

.dashboard-view__history-header {
  background: var(--cl-color-bg-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--cl-color-text-muted);
}

.dashboard-view__history-row {
  border-top: 1px solid var(--cl-color-bg-muted);
  font-size: 0.875rem;
  color: var(--cl-color-text);
}

.dashboard-view__history-row .mono {
  font-family: monospace;
}

.dashboard-view__history-row .bold {
  font-weight: 700;
}

.dashboard-view__status-chip {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: var(--cl-radius-pill);
  justify-self: start;
}

.dashboard-view__history-empty {
  padding: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.dashboard-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

@media (min-width: 1024px) {
  .dashboard-view__grid {
    grid-template-columns: 1.4fr 1fr 1fr;
  }
}
</style>
