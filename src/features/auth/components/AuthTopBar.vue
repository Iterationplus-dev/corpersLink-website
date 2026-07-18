<script setup lang="ts">
defineProps<{ linkLabel: string; linkTo: string; linkText: string }>();
</script>

<template>
  <div class="auth-topbar">
    <router-link to="/" class="auth-topbar__brand">
      <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="13" fill="#16815A" />
        <path
          d="M34.3 15.3 A13.5 13.5 0 1 0 34.3 32.7"
          fill="none"
          stroke="#FFFFFF"
          stroke-width="8.5"
          stroke-linecap="round"
        />
        <circle cx="36.5" cy="24" r="4.6" fill="#FFFFFF" />
      </svg>
      <span class="auth-topbar__name">CorpersLink</span>
    </router-link>
    <div class="auth-topbar__link">
      {{ linkLabel }} <router-link :to="linkTo">{{ linkText }}</router-link>
    </div>
  </div>
</template>

<style scoped>
.auth-topbar {
  background: var(--cl-color-bg);
  border-bottom: 1px solid var(--cl-color-border);
  height: var(--cl-header-height);
  padding: 0 clamp(1.25rem, 3vw, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.auth-topbar__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.auth-topbar__name {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--cl-color-navy);
}

.auth-topbar__link {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.auth-topbar__link a {
  font-weight: 700;
  color: var(--cl-color-navy);
}
</style>
