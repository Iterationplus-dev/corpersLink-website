<script setup lang="ts">
defineProps<{ seatLabel: string }>();
defineEmits<{ 'pick-new-seat': [] }>();
</script>

<template>
  <div class="hold-expired">
    <div class="hold-expired__icon">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="15" cy="15" r="12" fill="none" stroke="#B7791F" stroke-width="2.5" />
        <path
          d="M15 8.5V15l4.5 3"
          fill="none"
          stroke="#B7791F"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <h2>Your seat hold expired</h2>
    <p>
      Seat {{ seatLabel }} was released back to the pool after 15 minutes. You haven't been
      charged.
    </p>
    <button type="button" class="hold-expired__cta" @click="$emit('pick-new-seat')">
      Pick a new seat
    </button>
  </div>
</template>

<style scoped>
.hold-expired {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  text-align: center;
  padding: 3rem 1.5rem;
  max-width: 420px;
  margin: 0 auto;
}

.hold-expired__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--cl-color-warning-bg);
  border: 2px solid var(--cl-color-warning-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hold-expired h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.hold-expired p {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--cl-color-text-muted);
}

.hold-expired__cta {
  margin-top: 0.5rem;
  height: 48px;
  padding: 0 1.75rem;
  border-radius: var(--cl-radius-md);
  border: none;
  background: var(--cl-color-green);
  color: #fff;
  font-weight: 700;
  font-size: 0.9375rem;
  box-shadow: var(--cl-shadow-cta);
}
</style>
