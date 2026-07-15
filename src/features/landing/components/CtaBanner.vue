<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import { useNewsletterForm } from '@/features/landing/composables/useNewsletterForm';

const { form, isSubmitting, isSuccess, fieldErrors, generalError, submit } = useNewsletterForm();
</script>

<template>
  <section id="book" class="cta-banner">
    <div class="cta-banner__inner">
      <div class="cta-banner__copy">
        <h2 class="cta-banner__title">Seats fill fast in camp season.</h2>
        <p class="cta-banner__subtitle">
          Leave your email and we'll notify you the moment your institution's booking window opens —
          takes less than five minutes to register once it does.
        </p>
      </div>

      <form class="cta-banner__form" novalidate @submit.prevent="submit">
        <div class="cta-banner__field-group">
          <label for="cta-email" class="visually-hidden">Email address</label>
          <input
            id="cta-email"
            v-model="form.email"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="cta-banner__input"
            :class="{ 'is-invalid': fieldErrors.email }"
            :aria-invalid="Boolean(fieldErrors.email)"
            aria-describedby="cta-email-feedback"
            required
          />
          <BaseButton type="submit" variant="secondary" size="md" :loading="isSubmitting">
            Notify me
          </BaseButton>
        </div>

        <p id="cta-email-feedback" class="cta-banner__feedback" role="status">
          <span v-if="isSuccess" class="is-success">You're on the list — watch your inbox.</span>
          <span v-else-if="fieldErrors.email" class="is-error">{{ fieldErrors.email[0] }}</span>
          <span v-else-if="generalError" class="is-error">{{ generalError }}</span>
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.cta-banner {
  padding: 0 clamp(1.25rem, 3vw, 3.5rem) clamp(2.5rem, 6vw, 4rem);
}

.cta-banner__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  background: var(--cl-color-green);
  border-radius: var(--cl-radius-xl);
  padding: clamp(1.75rem, 4vw, 2.75rem) clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  color: var(--cl-color-text-inverse);
}

.cta-banner__copy {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.cta-banner__title {
  font-size: clamp(1.375rem, 3vw, 1.625rem);
  font-weight: 800;
  letter-spacing: -0.01em;
}

.cta-banner__subtitle {
  font-size: 0.95rem;
  line-height: 1.55;
  color: #d7eee3;
  max-width: 56ch;
}

.cta-banner__form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cta-banner__field-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cta-banner__input {
  height: 48px;
  border-radius: var(--cl-radius-md);
  border: none;
  padding: 0 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--cl-color-text);
  background: var(--cl-color-bg);
  min-width: 0;
  flex: 1;
}

.cta-banner__input.is-invalid {
  outline: 2px solid #ffd7d7;
}

.cta-banner__feedback {
  min-height: 1.25rem;
  font-size: 0.85rem;
  margin: 0;
}

.cta-banner__feedback .is-success {
  color: #eaffff;
  font-weight: 700;
}

.cta-banner__feedback .is-error {
  color: #ffe1e1;
  font-weight: 600;
}

@media (min-width: 720px) {
  .cta-banner__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .cta-banner__form {
    flex-shrink: 0;
    width: 380px;
  }

  .cta-banner__field-group {
    flex-direction: row;
  }
}
</style>
