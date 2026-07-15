<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import LogoMark from '@/components/ui/LogoMark.vue';
import type { NavLink } from '@/features/site/types';
import { useUiStore } from '@/stores/ui.store';

interface Props {
  navLinks: NavLink[];
}

const props = defineProps<Props>();
const uiStore = useUiStore();
const route = useRoute();

const isMobileNavOpen = computed(() => uiStore.isMobileNavOpen);

function isActive(href: string): boolean {
  return href === '/' ? route.path === '/' : route.path.startsWith(href);
}

function handleNavClick(): void {
  uiStore.closeMobileNav();
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <router-link to="/" class="app-header__brand" aria-label="CorpersLink home">
        <LogoMark :size="30" />
        <span class="app-header__brand-name">Corpers<span class="is-accent">Link</span></span>
      </router-link>

      <nav class="app-header__nav" aria-label="Primary">
        <router-link
          v-for="link in props.navLinks"
          :key="link.href"
          :to="link.href"
          class="app-header__nav-link"
          :class="{ 'is-active': isActive(link.href) }"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <div class="app-header__actions">
        <span class="app-header__sign-in" aria-disabled="true" title="Coming soon">Sign in</span>
        <BaseButton :to="{ path: '/', hash: '#book' }" variant="primary" size="md"
          >Book a seat</BaseButton
        >
      </div>

      <button
        type="button"
        class="app-header__toggle"
        :aria-expanded="isMobileNavOpen"
        aria-controls="app-mobile-nav"
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
        id="app-mobile-nav"
        class="app-header__mobile-nav"
        aria-label="Mobile"
      >
        <router-link
          v-for="link in props.navLinks"
          :key="link.href"
          :to="link.href"
          class="app-header__mobile-link"
          @click="handleNavClick"
        >
          {{ link.label }}
        </router-link>
        <span class="app-header__mobile-link" aria-disabled="true" title="Coming soon"
          >Sign in</span
        >
        <BaseButton
          :to="{ path: '/', hash: '#book' }"
          variant="primary"
          size="lg"
          @click="handleNavClick"
          >Book a seat</BaseButton
        >
      </nav>
    </transition>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--cl-color-bg);
  border-bottom: 1px solid var(--cl-color-border);
}

.app-header__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  height: var(--cl-header-height);
  padding: 0 clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.app-header__brand-name {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.app-header__brand-name .is-accent {
  color: var(--cl-color-green);
}

.app-header__nav {
  display: none;
  align-items: center;
  gap: 1.75rem;
  flex: 1;
}

.app-header__nav-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--cl-color-text-muted);
  padding: 0.25rem 0;
  border-bottom: 2px solid transparent;
  transition: color var(--cl-duration-fast) var(--cl-ease-standard);
}

.app-header__nav-link:hover {
  color: var(--cl-color-navy);
}

.app-header__nav-link.is-active {
  font-weight: 700;
  color: var(--cl-color-green);
  border-bottom-color: var(--cl-color-green);
}

.app-header__actions {
  display: none;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.app-header__sign-in {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--cl-color-navy);
  padding: 0.625rem 1rem;
  opacity: 0.6;
  cursor: not-allowed;
}

.app-header__toggle {
  margin-left: auto;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.app-header__toggle span {
  width: 22px;
  height: 2px;
  background: var(--cl-color-text);
  border-radius: 1px;
}

.app-header__mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem clamp(1.25rem, 3vw, 3.5rem) 1.5rem;
  border-top: 1px solid var(--cl-color-border);
}

.app-header__mobile-link {
  padding: 0.75rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--cl-color-text);
  border-bottom: 1px solid var(--cl-color-border);
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
  max-height: 480px;
  opacity: 1;
}

@media (min-width: 960px) {
  .app-header__nav,
  .app-header__actions {
    display: flex;
  }

  .app-header__toggle {
    display: none;
  }
}
</style>
