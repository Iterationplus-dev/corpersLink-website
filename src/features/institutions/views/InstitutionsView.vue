<script setup lang="ts">
import { useRouter } from 'vue-router';

import BaseButton from '@/components/ui/BaseButton.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import PageSkeleton from '@/components/ui/PageSkeleton.vue';
import { useInstitutionsSearch } from '@/features/institutions/composables/useInstitutionsSearch';

import InstitutionCard from '../components/InstitutionCard.vue';

const router = useRouter();
const { query, institutions, isLoading, hasError, hasNoResults, error, search, clearSearch } =
  useInstitutionsSearch();

function goToVehicles(institutionId: number): void {
  void router.push(`/book/${institutionId}`);
}
</script>

<template>
  <main id="main-content" class="institutions-view">
    <div class="institutions-view__inner">
      <div class="institutions-view__header">
        <div class="institutions-view__heading">
          <h1>Choose departure institution.</h1>
          <p>Participating institutions running Batch B, Stream 1 camp transport</p>
        </div>

        <div class="institutions-view__search">
          <svg
            class="institutions-view__search-icon"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="6.5" fill="none" stroke="#8A94A3" stroke-width="1.75" />
            <path
              d="M14 14l4.5 4.5"
              stroke="#8A94A3"
              stroke-width="1.75"
              stroke-linecap="round"
            />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="Search by name, state or type…"
            @keyup.enter="search"
          />
          <button
            v-if="query"
            type="button"
            class="institutions-view__search-clear"
            aria-label="Clear search"
            @click="clearSearch"
          >
            ✕
          </button>
        </div>
      </div>

      <PageSkeleton v-if="isLoading" :block-count="3" block-height="200px" />

      <div v-else-if="hasError" class="institutions-view__error">
        <ErrorState
          title="We couldn't load institutions"
          :message="error?.message ?? 'Please check your connection and try again.'"
          @retry="search"
        />
      </div>

      <div v-else-if="hasNoResults" class="institutions-view__empty">
        <div class="institutions-view__empty-title">No institutions found</div>
        <p>Nothing matches "{{ query }}". Check the spelling, or browse the full list.</p>
        <BaseButton variant="secondary" size="md" @click="clearSearch">Clear search</BaseButton>
      </div>

      <div v-else class="institutions-view__grid">
        <InstitutionCard
          v-for="institution in institutions"
          :key="institution.id"
          :institution="institution"
          @select="goToVehicles(institution.id)"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.institutions-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--cl-color-bg-muted);
}

.institutions-view__inner {
  max-width: var(--cl-container-max);
  margin: 0 auto;
  width: 100%;
  padding: 2rem clamp(1.25rem, 3vw, 3.5rem) 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.institutions-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.institutions-view__heading h1 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--cl-color-text);
}

.institutions-view__heading p {
  font-size: 0.875rem;
  color: var(--cl-color-text-muted);
}

.institutions-view__search {
  position: relative;
  width: 100%;
  max-width: 340px;
  flex-shrink: 0;
}

.institutions-view__search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.institutions-view__search input {
  width: 100%;
  height: 46px;
  border-radius: var(--cl-radius-md);
  border: 1.5px solid var(--cl-color-border);
  padding: 0 2.25rem 0 2.5rem;
  font-size: 0.9rem;
  font-family: inherit;
  background: var(--cl-color-bg);
}

.institutions-view__search input:focus {
  outline: none;
  border-color: var(--cl-color-navy);
}

.institutions-view__search-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--cl-color-text-muted);
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.institutions-view__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.institutions-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--cl-color-text-muted);
}

.institutions-view__empty-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--cl-color-text);
}

.institutions-view__error {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

@media (min-width: 720px) {
  .institutions-view__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .institutions-view__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
