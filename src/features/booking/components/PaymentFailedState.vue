<script setup lang="ts">
defineProps<{ seatLabel: string; holdTimeRemaining: string }>();
defineEmits<{ 'try-again': []; 'change-method': [] }>();

const failReasons = [
  'Network issue or timeout during authorisation',
  'Insufficient balance on the card or account',
  'Card blocked for online payments — contact your bank',
  'Payment session expired — start again from the summary',
];
</script>

<template>
  <div class="payment-failed">
    <div class="payment-failed__icon">
      <svg width="24" height="24" viewBox="0 0 26 26" aria-hidden="true">
        <path d="M4 4L22 22M22 4L4 22" stroke="#B54545" stroke-width="3" stroke-linecap="round" />
      </svg>
    </div>
    <h2>Payment didn't go through</h2>
    <p class="payment-failed__body">
      Your bank declined the transaction or the network timed out. No booking was made.
    </p>

    <div class="payment-failed__causes">
      <div class="payment-failed__causes-title">Most likely causes</div>
      <div v-for="reason in failReasons" :key="reason" class="payment-failed__cause">
        <span class="payment-failed__dot" />
        {{ reason }}
      </div>
    </div>

    <div class="payment-failed__notice">
      If you were debited, the reversal is automatic within 24 hours — please don't pay twice.
    </div>

    <div class="payment-failed__held">
      <span>Seat {{ seatLabel }} is still held for you</span>
      <strong>{{ holdTimeRemaining }}</strong>
    </div>

    <div class="payment-failed__actions">
      <button
        type="button"
        class="payment-failed__btn payment-failed__btn--secondary"
        @click="$emit('change-method')"
      >
        Change method
      </button>
      <button
        type="button"
        class="payment-failed__btn payment-failed__btn--primary"
        @click="$emit('try-again')"
      >
        Try again
      </button>
    </div>
    <router-link to="/support" class="payment-failed__support">Contact support</router-link>
  </div>
</template>

<style scoped>
.payment-failed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  text-align: center;
  max-width: 460px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-xl);
}

.payment-failed__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--cl-color-danger-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-failed h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.payment-failed__body {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--cl-color-text-muted);
}

.payment-failed__causes {
  width: 100%;
  background: var(--cl-color-bg-muted);
  border-radius: var(--cl-radius-md);
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.payment-failed__causes-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--cl-color-text-muted);
}

.payment-failed__cause {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  font-size: 0.825rem;
  line-height: 1.45;
  color: var(--cl-color-text);
}

.payment-failed__dot {
  width: 5px;
  height: 5px;
  border-radius: 3px;
  background: var(--cl-color-danger);
  margin-top: 0.4375rem;
  flex-shrink: 0;
}

.payment-failed__notice {
  width: 100%;
  background: var(--cl-color-warning-bg);
  border: 1px solid var(--cl-color-warning-border);
  border-radius: var(--cl-radius-md);
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--cl-color-warning-text);
}

.payment-failed__held {
  width: 100%;
  background: var(--cl-color-bg-muted);
  border-radius: var(--cl-radius-md);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cl-color-text);
}

.payment-failed__held strong {
  color: #b7791f;
}

.payment-failed__actions {
  width: 100%;
  display: flex;
  gap: 0.75rem;
}

.payment-failed__btn {
  flex: 1;
  height: 48px;
  border-radius: var(--cl-radius-md);
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
}

.payment-failed__btn--secondary {
  background: var(--cl-color-bg);
  border: 1.5px solid var(--cl-color-border);
  color: var(--cl-color-text);
}

.payment-failed__btn--primary {
  background: var(--cl-color-green);
  color: #fff;
}

.payment-failed__support {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--cl-color-navy);
}
</style>
