<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';
import { useAuthStore } from '@/stores/auth.store';

import ChangePasswordModal from '../components/ChangePasswordModal.vue';
import DeleteAccountModal from '../components/DeleteAccountModal.vue';
import { useAccountPage } from '../composables/useAccountPage';

const router = useRouter();
const authStore = useAuthStore();
const { data, isLoading, hasError, isReady, error, retry } = useAccountPage();

const isDeleteModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const passwordChanged = ref(false);

const institutionMeta = computed(() => {
  if (!data.value) return '';
  const parts = [
    data.value.institution?.name,
    data.value.batch && data.value.stream ? `Batch ${data.value.batch}, Stream ${data.value.stream}` : null,
  ].filter(Boolean);
  return parts.join(' · ');
});

async function handleSignOut(): Promise<void> {
  await authStore.signOut();
  await router.replace('/signin');
}

async function handleDeleted(): Promise<void> {
  isDeleteModalOpen.value = false;
  await authStore.signOut();
  await router.replace('/');
}

function handlePasswordChanged(): void {
  isPasswordModalOpen.value = false;
  passwordChanged.value = true;
}
</script>

<template>
  <main id="main-content" class="settings-view">
    <template v-if="isReady && data">
      <div class="settings-view__inner">
        <h1>Profile &amp; settings</h1>

        <div class="settings-view__profile-card">
          <div class="settings-view__avatar">
            <img v-if="data.avatarUrl" :src="data.avatarUrl" alt="" />
            <span v-else>{{ data.avatarInitials }}</span>
          </div>
          <div class="settings-view__profile-info">
            <div class="settings-view__name">{{ data.fullName }}</div>
            <div class="settings-view__meta">{{ institutionMeta }}</div>
          </div>
        </div>

        <div class="settings-view__grid">
          <div class="settings-view__card">
            <div class="settings-view__row">
              <span>Email address</span>
              <strong
                >{{ data.email }}
                <span v-if="!data.emailVerified" class="settings-view__unverified"
                  >(unverified)</span
                ></strong
              >
            </div>
            <div class="settings-view__row">
              <span>Phone number</span>
              <strong>{{ data.phone }}</strong>
            </div>
            <div v-if="data.callUpNumber" class="settings-view__row">
              <span>Call-up number</span>
              <strong>{{ data.callUpNumber }}</strong>
            </div>
            <div v-if="data.stateCode" class="settings-view__row">
              <span>State code</span>
              <strong>{{ data.stateCode }}</strong>
            </div>
          </div>

          <div class="settings-view__card">
            <div class="settings-view__setting-row">
              <div>
                <div class="settings-view__setting-label">Password</div>
                <div class="settings-view__setting-sub">
                  {{ passwordChanged ? 'Updated just now' : 'Change your account password' }}
                </div>
              </div>
              <button
                type="button"
                class="settings-view__setting-trail-btn"
                @click="isPasswordModalOpen = true"
              >
                Change
              </button>
            </div>
            <div class="settings-view__setting-row">
              <div>
                <div class="settings-view__setting-label">Emergency contact</div>
                <div class="settings-view__setting-sub">
                  {{ data.emergencyContact?.fullName ?? 'Not set' }}
                  <template v-if="data.emergencyContact?.relationship"
                    >· {{ data.emergencyContact.relationship }}</template
                  >
                </div>
              </div>
            </div>
            <div class="settings-view__setting-row">
              <div>
                <div class="settings-view__setting-label">Two-factor authentication</div>
                <div class="settings-view__setting-sub">Extra login verification</div>
              </div>
              <span class="settings-view__setting-trail">{{
                data.twoFactorEnabled ? 'Enabled' : 'Off'
              }}</span>
            </div>
          </div>
        </div>

        <div class="settings-view__danger">
          <div>
            <div class="settings-view__danger-title">Danger zone</div>
            <p>Sign out or permanently delete your account.</p>
          </div>
          <button type="button" class="settings-view__signout-btn" @click="handleSignOut">
            Sign out
          </button>
          <button type="button" class="settings-view__delete-btn" @click="isDeleteModalOpen = true">
            Delete account
          </button>
        </div>
      </div>

      <ChangePasswordModal
        v-if="isPasswordModalOpen"
        @close="isPasswordModalOpen = false"
        @changed="handlePasswordChanged"
      />

      <DeleteAccountModal
        v-if="isDeleteModalOpen"
        @close="isDeleteModalOpen = false"
        @deleted="handleDeleted"
      />
    </template>

    <PageSkeleton v-else-if="isLoading" :block-count="2" />

    <div v-else-if="hasError" class="settings-view__error">
      <ErrorState
        title="We couldn't load your settings"
        :message="error?.message ?? 'Please check your connection and try again.'"
        @retry="retry"
      />
    </div>
  </main>
</template>

<style scoped>
.settings-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.settings-view__inner {
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem clamp(1.25rem, 3vw, 2.5rem) 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.settings-view__inner h1 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-text);
}

.settings-view__profile-card {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.125rem;
}

.settings-view__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--cl-color-bg-muted);
  color: var(--cl-color-navy);
  font-weight: 800;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.settings-view__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.settings-view__profile-info {
  flex: 1;
}

.settings-view__name {
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.settings-view__meta {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.settings-view__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.settings-view__card {
  background: var(--cl-color-bg);
  border: 1px solid var(--cl-color-border);
  border-radius: var(--cl-radius-lg);
  padding: 0.25rem 1.375rem;
}

.settings-view__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--cl-color-bg-muted);
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.settings-view__row:last-child {
  border-bottom: none;
}

.settings-view__row strong {
  color: var(--cl-color-text);
  font-weight: 600;
  text-align: right;
}

.settings-view__unverified {
  color: var(--cl-color-warning-text);
  font-weight: 600;
}

.settings-view__setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--cl-color-bg-muted);
  gap: 0.75rem;
}

.settings-view__setting-row:last-child {
  border-bottom: none;
}

.settings-view__setting-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--cl-color-text);
}

.settings-view__setting-sub {
  font-size: 0.8125rem;
  color: var(--cl-color-text-muted);
}

.settings-view__setting-trail {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--cl-color-green);
}

.settings-view__setting-trail-btn {
  height: 36px;
  padding: 0 0.875rem;
  border-radius: var(--cl-radius-md);
  border: 1.5px solid var(--cl-color-border);
  background: var(--cl-color-bg);
  color: var(--cl-color-navy);
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
}

.settings-view__danger {
  background: var(--cl-color-bg);
  border: 1px solid #e2c6c6;
  border-radius: var(--cl-radius-lg);
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.settings-view__danger-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--cl-color-danger);
}

.settings-view__danger p {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.settings-view__signout-btn,
.settings-view__delete-btn {
  height: 42px;
  padding: 0 1.125rem;
  border-radius: var(--cl-radius-md);
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
}

.settings-view__signout-btn {
  border: 1.5px solid var(--cl-color-border);
  background: var(--cl-color-bg);
  color: var(--cl-color-text);
}

.settings-view__delete-btn {
  background: var(--cl-color-danger);
  color: #fff;
}

.settings-view__error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

@media (min-width: 720px) {
  .settings-view__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
