<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import LogoMark from '@/components/ui/LogoMark.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUiStore();

const initials = computed(() => authStore.user?.avatarInitials ?? '··');
const isMobileNavOpen = computed(() => uiStore.isMobileNavOpen);

function isActive(prefix: string): boolean {
  return route.path === prefix || route.path.startsWith(`${prefix}/`);
}

function handleNavClick(): void {
  uiStore.closeMobileNav();
}
</script>

<template>
  <div class="app-shell">
    <a href="#main-content" class="app-shell__skip-link">Skip to main content</a>
    <header class="app-shell__header">
      <div class="app-shell__inner">
        <router-link to="/dashboard" class="app-shell__brand">
          <LogoMark :size="28" />
          <span>CorpersLink</span>
        </router-link>
        <nav class="app-shell__nav" aria-label="Primary">
          <router-link
            to="/institutions"
            :class="{ 'is-active': isActive('/institutions') || isActive('/book') }"
            >Home</router-link
          >
          <router-link to="/dashboard" :class="{ 'is-active': isActive('/dashboard') }"
            >My bookings</router-link
          >
          <router-link to="/support" :class="{ 'is-active': isActive('/support') }"
            >Support</router-link
          >
        </nav>
        <router-link to="/settings" class="app-shell__avatar" aria-label="Profile &amp; settings">{{
          initials
        }}</router-link>
        <button
          type="button"
          class="app-shell__toggle"
          :aria-expanded="isMobileNavOpen"
          aria-controls="app-shell-mobile-nav"
          aria-label="Toggle navigation menu"
          @click="uiStore.toggleMobileNav()"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <transition name="mobile-nav">
        <nav
          v-if="isMobileNavOpen"
          id="app-shell-mobile-nav"
          class="app-shell__mobile-nav"
          aria-label="Mobile"
        >
          <router-link
            to="/institutions"
            class="app-shell__mobile-link"
            :class="{ 'is-active': isActive('/institutions') || isActive('/book') }"
            @click="handleNavClick"
            >Home</router-link
          >
          <router-link
            to="/dashboard"
            class="app-shell__mobile-link"
            :class="{ 'is-active': isActive('/dashboard') }"
            @click="handleNavClick"
            >My bookings</router-link
          >
          <router-link
            to="/support"
            class="app-shell__mobile-link"
            :class="{ 'is-active': isActive('/support') }"
            @click="handleNavClick"
            >Support</router-link
          >
        </nav>
      </transition>
    </header>
    <router-view />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--cl-color-bg-muted);
}

.app-shell__skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  background: var(--cl-color-navy);
  color: #fff;
  padding: 0.75rem 1.25rem;
  border-radius: 0 0 8px 0;
  font-weight: 700;
}

.app-shell__skip-link:focus {
  left: 0;
}

.app-shell__header {
  background: var(--cl-color-bg);
  border-bottom: 1px solid var(--cl-color-border);
  flex-shrink: 0;
}

.app-shell__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  height: var(--cl-header-height);
  padding: 0 clamp(1.25rem, 3vw, 2.5rem);
  display: flex;
  align-items: center;
  gap: 2rem;
}

.app-shell__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--cl-color-navy);
}

.app-shell__nav {
  display: none;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.app-shell__nav a {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cl-color-text-muted);
  padding: 1.25rem 0;
  border-bottom: 2px solid transparent;
}

.app-shell__nav a.is-active {
  font-weight: 700;
  color: var(--cl-color-navy);
  border-bottom-color: var(--cl-color-green);
}

.app-shell__avatar {
  margin-left: auto;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--cl-color-bg-muted);
  color: var(--cl-color-navy);
  font-size: 0.8125rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.app-shell__toggle {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
}

.app-shell__toggle span {
  width: 22px;
  height: 2px;
  background: var(--cl-color-text);
  border-radius: 1px;
}

.app-shell__mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem clamp(1.25rem, 3vw, 2.5rem) 1.5rem;
  border-top: 1px solid var(--cl-color-border);
}

.app-shell__mobile-link {
  padding: 0.75rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--cl-color-text);
  border-bottom: 1px solid var(--cl-color-border);
}

.app-shell__mobile-link.is-active {
  color: var(--cl-color-navy);
  font-weight: 700;
}

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition:
    max-height var(--cl-duration-base) var(--cl-ease-standard),
    opacity var(--cl-duration-base) var(--cl-ease-standard);
  overflow: hidden;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  max-height: 0;
  opacity: 0;
}

.mobile-nav-enter-to,
.mobile-nav-leave-from {
  max-height: 240px;
  opacity: 1;
}

@media (min-width: 720px) {
  .app-shell__nav {
    display: flex;
  }

  .app-shell__toggle {
    display: none;
  }
}
</style>
