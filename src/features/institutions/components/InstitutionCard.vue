<script setup lang="ts">
import type { Institution } from '@/features/institutions/types';

defineProps<{ institution: Institution }>();
defineEmits<{ select: [] }>();

const CHIP_STYLES: Record<Institution['status'], { bg: string; fg: string }> = {
  open: { bg: '#E2F1EB', fg: '#16815A' },
  full: { bg: '#EDEFF3', fg: '#5A6472' },
};
</script>

<template>
  <article class="institution-card">
    <div class="institution-card__top">
      <div
        class="institution-card__logo"
        :class="{ 'institution-card__logo--tint': !institution.logoUrl }"
      >
        <img v-if="institution.logoUrl" :src="institution.logoUrl" alt="" />
        <template v-else>{{ institution.abbreviation }}</template>
      </div>
      <span
        v-if="institution.verified"
        class="institution-card__chip"
        :style="{
          background: CHIP_STYLES[institution.status].bg,
          color: CHIP_STYLES[institution.status].fg,
        }"
        >{{ institution.statusLabel }}</span
      >
    </div>
    <div class="institution-card__body">
      <div class="institution-card__name-row">
        <span class="institution-card__name">{{ institution.name }}</span>
        <span
          v-if="institution.verified"
          class="institution-card__verified"
          aria-label="Verified institution"
          title="Verified"
        >
          <svg width="9" height="7" viewBox="0 0 12 10" aria-hidden="true">
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
      </div>
      <div class="institution-card__type">{{ institution.typeState }}</div>
      <div v-if="institution.abbreviation" class="institution-card__abbr">
        {{ institution.abbreviation }}
      </div>
      <div class="institution-card__vehicles">
        {{ institution.vehicleCount }} {{ institution.vehicleCount === 1 ? 'vehicle' : 'vehicles' }}
        available
      </div>
    </div>
    <button
      type="button"
      class="institution-card__cta"
      :disabled="institution.status === 'full'"
      @click="$emit('select')"
    >
      View vehicles
    </button>
  </article>
</template>

<style scoped>
.institution-card {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.institution-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.institution-card__logo {
  width: 48px;
  height: 48px;
  border-radius: var(--cl-radius-md);
  color: #fff;
  font-weight: 800;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.institution-card__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.institution-card__logo--tint {
  background: color-mix(in srgb, var(--cl-color-navy) 12%, white);
  color: var(--cl-color-navy);
}

.institution-card__chip {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.25rem 0.6875rem;
  border-radius: var(--cl-radius-pill);
}

.institution-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.institution-card__name-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.institution-card__name {
  font-size: 0.96875rem;
  font-weight: 700;
  color: var(--cl-color-text);
}

.institution-card__verified {
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--cl-color-green);
  display: flex;
  align-items: center;
  justify-content: center;
}

.institution-card__type {
  font-size: 0.84375rem;
  font-weight: 700;
  color: var(--cl-color-navy);
}

.institution-card__abbr {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--cl-color-text-subtle);
}

.institution-card__vehicles {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.institution-card__cta {
  height: 44px;
  border-radius: var(--cl-radius-md);
  border: 1.5px solid var(--cl-color-navy);
  background: var(--cl-color-bg);
  color: var(--cl-color-navy);
  font-size: 0.875rem;
  font-weight: 700;
}

.institution-card__cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
