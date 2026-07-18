<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useInstitutionsSearch } from '@/features/institutions/composables/useInstitutionsSearch';
import type { Institution } from '@/features/institutions/types';

const props = withDefaults(
  defineProps<{
    id: string;
    modelValue: number | null;
    selectedName?: string;
    invalid?: boolean;
  }>(),
  { selectedName: '', invalid: false },
);

const emit = defineEmits<{
  'update:modelValue': [value: number | null];
  'update:selectedName': [value: string];
}>();

const { query, institutions, isLoading } = useInstitutionsSearch();

const isOpen = ref(false);
const activeIndex = ref(-1);
const inputEl = ref<HTMLInputElement | null>(null);
// Tracks the last confirmed pick so an unfinished edit can be reverted — both
// the display text and the id — rather than leaving them out of sync.
const lastConfirmed = ref<{ id: number; name: string } | null>(null);

onMounted(() => {
  if (props.modelValue !== null && props.selectedName) {
    lastConfirmed.value = { id: props.modelValue, name: props.selectedName };
    query.value = props.selectedName;
  }
});

function openList(): void {
  isOpen.value = true;
  activeIndex.value = -1;
}

function closeList(): void {
  isOpen.value = false;
  activeIndex.value = -1;
  // Revert any unselected typing back to the last confirmed selection.
  query.value = lastConfirmed.value?.name ?? '';
  if (props.modelValue !== (lastConfirmed.value?.id ?? null)) {
    emit('update:modelValue', lastConfirmed.value?.id ?? null);
  }
}

function selectInstitution(institution: Institution): void {
  lastConfirmed.value = { id: institution.id, name: institution.name };
  emit('update:modelValue', institution.id);
  emit('update:selectedName', institution.name);
  query.value = institution.name;
  isOpen.value = false;
  activeIndex.value = -1;
}

function onInput(): void {
  if (props.modelValue !== null) {
    emit('update:modelValue', null);
  }
  isOpen.value = true;
  activeIndex.value = -1;
}

function moveActive(delta: number): void {
  if (!isOpen.value) {
    openList();
    return;
  }
  const count = institutions.value.length;
  if (count === 0) return;
  activeIndex.value = (activeIndex.value + delta + count) % count;
}

function confirmActive(): void {
  if (!isOpen.value) return;
  const active = institutions.value[activeIndex.value];
  if (active) selectInstitution(active);
}
</script>

<template>
  <div class="combobox">
    <input
      :id="id"
      ref="inputEl"
      v-model="query"
      type="text"
      role="combobox"
      autocomplete="off"
      placeholder="Search your institution…"
      class="combobox__input"
      :class="{ 'is-invalid': invalid }"
      aria-autocomplete="list"
      :aria-expanded="isOpen"
      :aria-controls="`${id}-listbox`"
      :aria-activedescendant="activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined"
      @focus="openList"
      @input="onInput"
      @blur="closeList"
      @keydown.down.prevent="moveActive(1)"
      @keydown.up.prevent="moveActive(-1)"
      @keydown.enter.prevent="confirmActive"
      @keydown.esc="closeList"
    />
    <ul v-if="isOpen" :id="`${id}-listbox`" role="listbox" class="combobox__listbox">
      <li v-if="isLoading" class="combobox__status">Searching…</li>
      <li v-else-if="institutions.length === 0" class="combobox__status">
        No institutions found
      </li>
      <li
        v-for="(institution, index) in institutions"
        :id="`${id}-option-${index}`"
        :key="institution.id"
        role="option"
        :aria-selected="index === activeIndex"
        class="combobox__option"
        :class="{ 'is-active': index === activeIndex }"
        @mousedown.prevent="selectInstitution(institution)"
        @mouseenter="activeIndex = index"
      >
        {{ institution.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.combobox {
  position: relative;
}

.combobox__input {
  width: 100%;
  height: 48px;
  border-radius: var(--cl-radius-md);
  border: 1.5px solid var(--cl-color-border);
  padding: 0 0.875rem;
  font-size: 0.9rem;
  font-family: inherit;
  background: var(--cl-color-bg);
}

.combobox__input:focus {
  outline: none;
  border-color: var(--cl-color-navy);
}

.combobox__input.is-invalid {
  border-color: var(--cl-color-danger);
}

.combobox__listbox {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  right: 0;
  z-index: 20;
  margin: 0;
  padding: 0.375rem;
  list-style: none;
  max-height: 240px;
  overflow-y: auto;
  background: var(--cl-color-bg);
  border: 1.5px solid var(--cl-color-border);
  border-radius: var(--cl-radius-md);
  box-shadow: 0 12px 32px rgba(26, 32, 44, 0.14);
}

.combobox__option {
  padding: 0.625rem 0.625rem;
  border-radius: var(--cl-radius-sm);
  font-size: 0.875rem;
  color: var(--cl-color-text);
  cursor: pointer;
}

.combobox__option.is-active {
  background: var(--cl-color-bg-muted);
}

.combobox__status {
  padding: 0.625rem;
  font-size: 0.8125rem;
  color: var(--cl-color-text-muted);
}
</style>
