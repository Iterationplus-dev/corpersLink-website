import { defineStore } from 'pinia';

/**
 * Cross-cutting UI state that has nothing to do with any single feature's
 * data (navigation chrome, connectivity banner, etc.). Feature-specific
 * loading/error/data state belongs in that feature's own store instead.
 */
export const useUiStore = defineStore('ui', {
  state: () => ({
    isMobileNavOpen: false,
    isOffline: !navigator.onLine,
  }),
  actions: {
    toggleMobileNav(): void {
      this.isMobileNavOpen = !this.isMobileNavOpen;
    },
    closeMobileNav(): void {
      this.isMobileNavOpen = false;
    },
    setOffline(isOffline: boolean): void {
      this.isOffline = isOffline;
    },
  },
});
