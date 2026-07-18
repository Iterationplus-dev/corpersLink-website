<script setup lang="ts">
import { buildQrCells } from '@/features/booking/utils/qr-placeholder';

const cells = buildQrCells();
</script>

<template>
  <div class="qr" role="img" aria-label="Booking QR code">
    <div
      v-for="(color, index) in cells"
      :key="index"
      class="qr__cell"
      :style="{ background: color }"
    />
  </div>
</template>

<style scoped>
.qr {
  display: grid;
  grid-template-columns: repeat(17, 4.5px);
  grid-auto-rows: 4.5px;
  background: #fff;
  padding: 8px;
  border: 1px solid var(--cl-color-border);
  border-radius: 8px;
}

.qr__cell {
  width: 4.5px;
  height: 4.5px;
}
</style>
