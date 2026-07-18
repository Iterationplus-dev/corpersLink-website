<script setup lang="ts">
defineProps<{ seatLabel: string; formattedTime: string }>();
</script>

<template>
  <div class="hold-countdown">
    <div class="hold-countdown__left">
      <svg width="16" height="16" viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="15" cy="15" r="12" fill="none" stroke="#B7791F" stroke-width="3" />
        <path
          d="M15 8.5V15l4.5 3"
          fill="none"
          stroke="#B7791F"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>Seat {{ seatLabel }} hold expires in</span>
    </div>
    <span class="hold-countdown__time">{{ formattedTime }}</span>
  </div>
</template>

<style scoped>
.hold-countdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--cl-color-warning-bg);
  border: 1.5px solid var(--cl-color-warning-border);
  border-radius: var(--cl-radius-pill);
  padding: 0.625rem 1.125rem;
  box-shadow: 0 6px 18px rgba(138, 91, 21, 0.18);
}

.hold-countdown__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--cl-color-warning-text);
}

.hold-countdown__time {
  font-size: 1.0625rem;
  font-weight: 800;
  color: #b7791f;
}
</style>
