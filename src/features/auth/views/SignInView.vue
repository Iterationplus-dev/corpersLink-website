<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import heroImageUrl from '@/assets/illustrations/hero-corps-member.png';
import BaseButton from '@/components/ui/BaseButton.vue';
import LogoMark from '@/components/ui/LogoMark.vue';
import PasswordField from '@/components/ui/PasswordField.vue';
import { AppError } from '@/core/types/app-error';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({ identifier: '', password: '' });
const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);
const fieldErrors = ref<Record<string, string[]>>({});

async function handleSubmit(): Promise<void> {
  isSubmitting.value = true;
  errorMessage.value = null;
  fieldErrors.value = {};

  try {
    await authStore.login(form.identifier, form.password);
    const redirectTo = (route.query.redirect as string | undefined) ?? '/dashboard';
    await router.replace(redirectTo);
  } catch (error) {
    if (error instanceof AppError && error.kind === 'validation' && error.fieldErrors) {
      fieldErrors.value = error.fieldErrors;
    } else if (error instanceof AppError) {
      errorMessage.value = error.message;
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <main class="signin-view">
    <div class="signin-view__grid">
      <div class="signin-view__hero">
        <router-link to="/" class="signin-view__brand">
          <LogoMark :size="32" />
          <span>CorpersLink</span>
        </router-link>
        <figure class="signin-view__hero-media">
          <img
            :src="heroImageUrl"
            alt="Corps members with CorpersLink buses on campus"
            loading="lazy"
            decoding="async"
            class="signin-view__hero-image"
          />
          <figcaption class="signin-view__hero-caption">
            Corps members with CorpersLink buses on campus
          </figcaption>
        </figure>
        <div class="signin-view__hero-copy">
          <div class="signin-view__hero-title">Your verified seat to camp.</div>
          <p class="signin-view__hero-body">
            Book institution-run NYSC camp transport, pay securely with Paystack, Monnify or
            Flutterwave, and travel with a confirmed manifest.
          </p>
        </div>
        <div class="signin-view__hero-footer">© 2026 CorpersLink Nig Ltd</div>
      </div>

      <div class="signin-view__form-side">
        <form class="signin-view__form" novalidate @submit.prevent="handleSubmit">
          <div class="signin-view__heading">
            <h1 class="signin-view__title">Welcome back</h1>
            <p class="signin-view__subtitle">Sign in to manage your camp trip</p>
          </div>

          <div class="signin-view__field">
            <label for="signin-email" class="signin-view__label">Email or call-up number</label>
            <input
              id="signin-email"
              v-model="form.identifier"
              type="text"
              autocomplete="username"
              placeholder="adaeze.o@gmail.com"
              class="signin-view__input"
              :class="{ 'is-invalid': fieldErrors.identifier }"
            />
            <p v-if="fieldErrors.identifier" class="signin-view__error">
              {{ fieldErrors.identifier[0] }}
            </p>
          </div>

          <div class="signin-view__field">
            <label for="signin-password" class="signin-view__label">Password</label>
            <PasswordField
              id="signin-password"
              v-model="form.password"
              autocomplete="current-password"
              :invalid="!!fieldErrors.password"
            />
            <p v-if="fieldErrors.password" class="signin-view__error">
              {{ fieldErrors.password[0] }}
            </p>
          </div>

          <div class="signin-view__row">
            <label class="signin-view__remember">
              <input type="checkbox" checked />
              Remember me
            </label>
            <router-link to="/forgot-password" class="signin-view__forgot"
              >Forgot password?</router-link
            >
          </div>

          <p v-if="errorMessage" class="signin-view__error" role="alert">{{ errorMessage }}</p>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="isSubmitting"
            class="signin-view__submit"
          >
            Sign in
          </BaseButton>

          <p class="signin-view__signup">
            New to CorpersLink? <router-link to="/register">Create account</router-link>
          </p>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
.signin-view {
  min-height: 100vh;
  display: flex;
}

.signin-view__grid {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}

.signin-view__hero {
  display: none;
  background: var(--cl-color-navy);
  color: var(--cl-color-text-inverse);
  padding: 3rem 3.5rem;
  flex-direction: column;
}

.signin-view__brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.1875rem;
  font-weight: 800;
  color: inherit;
  text-decoration: none;
}

.signin-view__hero-media {
  margin: 1.75rem 0 0;
}

.signin-view__hero-image {
  display: block;
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: var(--cl-radius-xl);
}

.signin-view__hero-caption {
  margin-top: 0.625rem;
  font-size: 0.8125rem;
  color: var(--cl-color-text-inverse-muted);
}

.signin-view__hero-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
}

.signin-view__hero-title {
  font-size: 2.125rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.signin-view__hero-body {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--cl-color-text-inverse-muted);
  max-width: 40ch;
}

.signin-view__hero-footer {
  font-size: 0.8125rem;
  color: #7e93b5;
}

.signin-view__form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.signin-view__form {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.signin-view__heading {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.signin-view__title {
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-text);
}

.signin-view__subtitle {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.signin-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.signin-view__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cl-color-text);
}

.signin-view__input {
  height: 48px;
  border-radius: var(--cl-radius-md);
  border: 1.5px solid var(--cl-color-border);
  padding: 0 0.875rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--cl-color-text);
}

.signin-view__input:focus {
  outline: none;
  border-color: var(--cl-color-navy);
}

.signin-view__input.is-invalid {
  border-color: var(--cl-color-danger);
}

.signin-view__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
}

.signin-view__remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--cl-color-text-muted);
}

.signin-view__forgot {
  font-weight: 700;
  color: var(--cl-color-navy);
}

.signin-view__error {
  font-size: 0.8125rem;
  color: var(--cl-color-danger);
  margin: 0;
}

.signin-view__submit {
  width: 100%;
}

.signin-view__signup {
  text-align: center;
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.signin-view__signup a {
  font-weight: 700;
  color: var(--cl-color-green);
}

@media (min-width: 960px) {
  .signin-view__grid {
    grid-template-columns: 1.1fr 1fr;
  }

  .signin-view__hero {
    display: flex;
  }
}
</style>
