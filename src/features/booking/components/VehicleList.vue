<script setup lang="ts">
import type { Vehicle, VehicleStatus } from '@/features/booking/types';

defineProps<{ vehicles: Vehicle[]; activeVehicleId: number | null }>();
defineEmits<{ select: [vehicleId: number] }>();

const BADGES: Record<VehicleStatus, { label: string; bg: string; fg: string }> = {
  open: { label: 'Open', bg: '#E2F1EB', fg: '#16815A' },
  filling_fast: { label: 'Filling fast', bg: '#FCF6EA', fg: '#B7791F' },
  full: { label: 'Full', bg: '#EDEFF3', fg: '#5A6472' },
};

function filledCount(vehicle: Vehicle): number {
  return vehicle.filledSeats + vehicle.heldSeats;
}

function occupancyPct(vehicle: Vehicle): number {
  return Math.round((filledCount(vehicle) / vehicle.totalSeats) * 100);
}

function barColor(vehicle: Vehicle, isActive: boolean): string {
  return isActive || vehicle.status !== 'open' ? 'var(--cl-color-green)' : 'var(--cl-color-navy)';
}
</script>

<template>
  <div class="vehicle-list">
    <button
      v-for="vehicle in vehicles"
      :key="vehicle.id"
      type="button"
      class="vehicle-list__card"
      :class="{ 'is-active': vehicle.id === activeVehicleId }"
      @click="$emit('select', vehicle.id)"
    >
      <div class="vehicle-list__top">
        <span class="vehicle-list__name">{{ vehicle.name }}</span>
        <span
          class="vehicle-list__badge"
          :style="{ background: BADGES[vehicle.status].bg, color: BADGES[vehicle.status].fg }"
          >{{ BADGES[vehicle.status].label }}</span
        >
      </div>
      <div class="vehicle-list__meta">
        Dep. {{ vehicle.departureTime }} · {{ vehicle.pickupPoint }}
      </div>
      <div class="vehicle-list__bar">
        <div
          class="vehicle-list__bar-fill"
          :style="{
            width: occupancyPct(vehicle) + '%',
            background: barColor(vehicle, vehicle.id === activeVehicleId),
          }"
        />
      </div>
      <div class="vehicle-list__counts">
        {{ filledCount(vehicle) }} of {{ vehicle.totalSeats }} seats filled
      </div>
    </button>
  </div>
</template>

<style scoped>
.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vehicle-list__card {
  text-align: left;
  background: var(--cl-color-bg);
  border: 1.5px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.vehicle-list__card.is-active {
  border-color: var(--cl-color-green);
}

.vehicle-list__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.vehicle-list__name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--cl-color-text);
}

.vehicle-list__badge {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.1875rem 0.625rem;
  border-radius: var(--cl-radius-pill);
  background: var(--cl-color-green-tint);
  color: var(--cl-color-green);
}

.vehicle-list__meta {
  font-size: 0.825rem;
  color: var(--cl-color-text-muted);
}

.vehicle-list__bar {
  height: 6px;
  border-radius: 3px;
  background: var(--cl-color-bg-muted);
  overflow: hidden;
}

.vehicle-list__bar-fill {
  height: 100%;
  background: var(--cl-color-green);
  border-radius: 3px;
}

.vehicle-list__counts {
  font-size: 0.8rem;
  color: var(--cl-color-text-muted);
}
</style>
