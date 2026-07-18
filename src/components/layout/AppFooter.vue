<script setup lang="ts">
import LogoMark from '@/components/ui/LogoMark.vue';

defineProps<{ disclaimer: string; copyright: string }>();
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <div class="app-footer__grid">
        <div class="app-footer__brand">
          <router-link to="/" class="app-footer__logo" aria-label="CorpersLink home">
            <LogoMark :size="28" />
            <span class="app-footer__wordmark">Corpers<span class="is-accent">Link</span></span>
          </router-link>
          <p class="app-footer__blurb">
            Verified camp transport for prospective and serving corps members — book a seat, pay
            securely and travel with confidence.
          </p>
        </div>

        <nav class="app-footer__col" aria-label="Product">
          <p class="app-footer__col-heading">Product</p>
          <router-link to="/institutions">Book a seat</router-link>
          <router-link :to="{ path: '/', hash: '#how-it-works' }">How it works</router-link>
          <router-link to="/institutions">Institutions</router-link>
          <router-link to="/support">Payment methods</router-link>
        </nav>

        <nav class="app-footer__col" aria-label="Company">
          <p class="app-footer__col-heading">Company</p>
          <router-link to="/about">About us</router-link>
          <router-link to="/testimonials">Testimonials</router-link>
          <router-link to="/faq">FAQ</router-link>
          <router-link to="/support">Contact</router-link>
        </nav>

        <nav class="app-footer__col" aria-label="Support">
          <p class="app-footer__col-heading">Support</p>
          <router-link to="/support">Help centre</router-link>
          <a href="mailto:support@corperslink.com">support@corperslink.com</a>
          <router-link to="/support">WhatsApp desk</router-link>
          <router-link to="/support">Report an issue</router-link>
        </nav>
      </div>

      <p class="app-footer__disclaimer">
        <strong>Disclaimer:</strong>
        {{ disclaimer }}
      </p>

      <div class="app-footer__row">
        <p class="app-footer__copyright">{{ copyright }}</p>
        <nav class="app-footer__links" aria-label="Legal">
          <router-link to="/privacy">Privacy</router-link>
          <router-link to="/terms">Terms</router-link>
          <router-link to="/support">Support</router-link>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #14243c;
  color: var(--cl-color-text-inverse-muted);
  margin-top: auto;
}

.app-footer__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  padding: clamp(2.5rem, 5vw, 3.5rem) clamp(1.25rem, 3vw, 3.5rem) 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.app-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.app-footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.app-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.app-footer__wordmark {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--cl-color-text-inverse);
}

.app-footer__wordmark .is-accent {
  color: var(--cl-color-green-light);
}

.app-footer__blurb {
  font-size: 0.84375rem;
  line-height: 1.6;
  color: #8fa3be;
  max-width: 300px;
}

.app-footer__col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.app-footer__col-heading {
  margin: 0;
  font-size: 0.78125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #8fa3be;
}

.app-footer__col a {
  font-size: 0.875rem;
  color: var(--cl-color-text-inverse-muted);
  width: fit-content;
}

.app-footer__col a:hover {
  color: var(--cl-color-text-inverse);
}

.app-footer__disclaimer {
  font-size: 0.78rem;
  line-height: 1.6;
  color: #6e82a0;
  max-width: 920px;
}

.app-footer__row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.app-footer__copyright {
  font-size: 0.84375rem;
  color: #8fa3be;
}

.app-footer__links {
  display: flex;
  gap: 1.5rem;
}

.app-footer__links a {
  font-size: 0.84375rem;
  font-weight: 600;
  color: var(--cl-color-text-inverse-muted);
}

.app-footer__links a:hover {
  color: var(--cl-color-text-inverse);
}

@media (min-width: 720px) {
  .app-footer__grid {
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 2rem;
  }

  .app-footer__row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
