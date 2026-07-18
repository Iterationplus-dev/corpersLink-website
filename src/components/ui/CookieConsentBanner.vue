<script setup lang="ts">
import { ref } from 'vue';

const STORAGE_KEY = 'corperslink.cookie-consent';

const isVisible = ref(localStorage.getItem(STORAGE_KEY) === null);
const essentialButton = ref<HTMLButtonElement | null>(null);

function acceptAll(): void {
  localStorage.setItem(STORAGE_KEY, 'all');
  isVisible.value = false;
}

function essentialOnly(): void {
  localStorage.setItem(STORAGE_KEY, 'essential');
  isVisible.value = false;
}

/** "manage preferences" doesn't have a dedicated settings page yet — focus
 *  the action buttons below, which are the actual preference controls. */
function managePreferences(): void {
  essentialButton.value?.focus();
}
</script>

<template>
  <div v-if="isVisible" class="cookie-banner-backdrop">
    <div class="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div class="cookie-banner__inner">
        <div class="cookie-banner__copy">
          <div class="cookie-banner__title">We use cookies</div>
          <p class="cookie-banner__text">
            Essential cookies keep sign-in and payments working; analytics cookies help us improve
            trips. Read our
            <router-link to="/privacy">Privacy Policy</router-link>
            or
            <button type="button" class="cookie-banner__link-btn" @click="managePreferences">
              manage preferences</button
            >.
          </p>
        </div>
        <div class="cookie-banner__actions">
          <button
            ref="essentialButton"
            type="button"
            class="cookie-banner__btn cookie-banner__btn--secondary"
            @click="essentialOnly"
          >
            Essential only
          </button>
          <button
            type="button"
            class="cookie-banner__btn cookie-banner__btn--primary"
            @click="acceptAll"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cookie-banner-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(20, 36, 60, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.cookie-banner {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1.25rem;
}

.cookie-banner__inner {
  width: 100%;
  max-width: 900px;
  background: var(--cl-color-bg);
  border-radius: var(--cl-radius-card);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 18px 48px rgba(26, 32, 44, 0.3);
}

.cookie-banner__title {
  font-size: 0.975rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.cookie-banner__text {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--cl-color-text-muted);
}

.cookie-banner__text a,
.cookie-banner__link-btn {
  font-weight: 700;
  color: var(--cl-color-navy);
}

.cookie-banner__link-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
}

.cookie-banner__actions {
  display: flex;
  gap: 0.625rem;
  flex-shrink: 0;
}

.cookie-banner__btn {
  flex: 1;
  height: 44px;
  border-radius: var(--cl-radius-md);
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
}

.cookie-banner__btn--secondary {
  background: var(--cl-color-bg);
  border: 1.5px solid var(--cl-color-border);
  color: var(--cl-color-text);
}

.cookie-banner__btn--primary {
  background: var(--cl-color-green);
  color: #fff;
}

@media (min-width: 720px) {
  .cookie-banner__inner {
    flex-direction: row;
    align-items: center;
  }

  .cookie-banner__actions {
    flex-shrink: 0;
  }

  .cookie-banner__btn {
    flex: none;
    padding: 0 1.25rem;
  }
}
</style>
