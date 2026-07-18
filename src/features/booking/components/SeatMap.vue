<script setup lang="ts">
import { computed, ref } from 'vue';

import type { Seat } from '@/features/booking/types';
import { buildSeatGrid } from '@/features/booking/utils/seat-grid';

const props = defineProps<{
  title?: string;
  seats: Seat[];
  disabled?: boolean;
}>();

const emit = defineEmits<{ 'select-seat': [seat: Seat] }>();

const cells = computed(() => buildSeatGrid(props.seats));

const ZOOM_MIN = 32;
const ZOOM_MAX = 48;
const ZOOM_STEP = 4;
const cellSize = ref(40);

function zoomIn(): void {
  cellSize.value = Math.min(ZOOM_MAX, cellSize.value + ZOOM_STEP);
}

function zoomOut(): void {
  cellSize.value = Math.max(ZOOM_MIN, cellSize.value - ZOOM_STEP);
}

const BLOCKED_STATUSES = new Set(['occupied', 'held', 'held_by_you', 'aisle']);

function handleClick(seat: Seat | null, status: string): void {
  if (props.disabled || seat === null || BLOCKED_STATUSES.has(status)) return;
  emit('select-seat', seat);
}
</script>

<template>
  <div class="seat-map">
    <div class="seat-map__header">
      <h2 v-if="title" class="seat-map__title">{{ title }}</h2>
      <div class="seat-map__legend-row">
        <div class="seat-map__legend">
          <div class="seat-map__legend-item">
            <span class="seat-map__swatch seat-map__swatch--available" /> Available
          </div>
          <div class="seat-map__legend-item">
            <span class="seat-map__swatch seat-map__swatch--selected">
              <svg width="8" height="7" viewBox="0 0 12 10" aria-hidden="true">
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
            Selected
          </div>
          <div class="seat-map__legend-item">
            <span class="seat-map__swatch seat-map__swatch--held">
              <svg width="9" height="9" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6.25" fill="none" stroke="#8A5B15" stroke-width="1.5" />
                <path
                  d="M8 4.5V8l2.5 1.5"
                  fill="none"
                  stroke="#8A5B15"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            Held
          </div>
          <div class="seat-map__legend-item">
            <span class="seat-map__swatch seat-map__swatch--occupied">×</span> Occupied
          </div>
        </div>
        <div class="seat-map__zoom">
          <button type="button" aria-label="Zoom out" @click="zoomOut">−</button>
          <button type="button" aria-label="Zoom in" @click="zoomIn">+</button>
        </div>
      </div>
    </div>

    <div class="seat-map__driver">DRV</div>

    <div
      class="seat-map__grid"
      :style="{ gridTemplateColumns: `repeat(5, ${cellSize}px)`, gridAutoRows: `${cellSize}px` }"
    >
      <button
        v-for="(cell, index) in cells"
        :key="index"
        type="button"
        class="seat-map__cell"
        :class="[cell.status === 'held_by_you' ? 'is-selected' : `is-${cell.status}`]"
        :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
        :disabled="
          cell.status === 'occupied' ||
          cell.status === 'held' ||
          cell.status === 'held_by_you' ||
          cell.status === 'aisle' ||
          disabled
        "
        :aria-label="cell.seat ? `Seat ${cell.seat.label} — ${cell.status}` : undefined"
        @click="handleClick(cell.seat, cell.status)"
      >
        <template v-if="cell.status !== 'aisle'">
          <svg
            v-if="cell.status === 'held_by_you'"
            width="10"
            height="8"
            viewBox="0 0 12 10"
            aria-hidden="true"
          >
            <path
              d="M1 5l3.5 3.5L11 1"
              fill="none"
              stroke="#FFFFFF"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span v-else-if="cell.status === 'occupied'">×</span>
          <span v-else>{{ cell.seat?.label }}</span>
        </template>
      </button>
    </div>
  </div>
</template>

<style scoped>
.seat-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.seat-map__header {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.seat-map__title {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.seat-map__legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.seat-map__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  justify-content: flex-end;
  margin-left: auto;
}

.seat-map__legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--cl-color-text-muted);
}

.seat-map__swatch {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 800;
  flex-shrink: 0;
}

.seat-map__swatch--available {
  border: 1.5px solid var(--cl-color-navy);
  background: var(--cl-color-bg);
}

.seat-map__swatch--selected {
  background: var(--cl-color-green);
}

.seat-map__swatch--held {
  background: #f3e3be;
  border: 1.5px solid #b7791f;
}

.seat-map__swatch--occupied {
  background: var(--cl-color-border);
  color: var(--cl-color-text-muted);
}

.seat-map__zoom {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.seat-map__zoom button {
  width: 26px;
  height: 26px;
  border-radius: var(--cl-radius-sm);
  border: 1.5px solid var(--cl-color-border);
  background: var(--cl-color-bg);
  color: var(--cl-color-navy);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.seat-map__zoom button:hover {
  border-color: var(--cl-color-navy);
}

.seat-map__driver {
  align-self: flex-end;
  width: 44px;
  height: 44px;
  border-radius: 10px 10px 4px 4px;
  background: var(--cl-color-bg-muted);
  border: 1.5px dashed var(--cl-color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--cl-color-text-muted);
}

.seat-map__grid {
  display: grid;
  gap: 8px;
  transition: grid-template-columns var(--cl-duration-base) var(--cl-ease-standard);
}

.seat-map__cell {
  border-radius: 8px;
  transition: width var(--cl-duration-base) var(--cl-ease-standard),
    height var(--cl-duration-base) var(--cl-ease-standard);
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--cl-color-navy);
  background: var(--cl-color-bg);
  color: var(--cl-color-navy);
}

.seat-map__cell.is-aisle {
  border: none;
  background: transparent;
  cursor: default;
}

.seat-map__cell.is-selected {
  background: var(--cl-color-green);
  border-color: var(--cl-color-green);
  color: #fff;
  box-shadow: 0 0 0 3px rgba(22, 129, 90, 0.28);
}

.seat-map__cell.is-held {
  background: #f3e3be;
  border-color: #b7791f;
  color: #8a5b15;
}

.seat-map__cell.is-occupied {
  background: var(--cl-color-border);
  border-color: var(--cl-color-border);
  color: var(--cl-color-text-muted);
}

.seat-map__cell:disabled:not(.is-aisle) {
  cursor: not-allowed;
}
</style>
