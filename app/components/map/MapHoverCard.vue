<script setup lang="ts">
import type { ProvinceItem } from '~/types/map'

defineProps<{
  province: ProvinceItem | null
  x: number
  y: number
}>()
</script>

<template>
  <div
    v-if="province"
    class="pointer-events-none fixed z-50 min-w-36 rounded-lg border border-brand/30 bg-panel/95 px-4 py-3 text-center shadow-2xl shadow-black/60 ring-1 ring-white/10 backdrop-blur-md"
    :style="{ left: x + 16 + 'px', top: y + 16 + 'px' }"
  >
    <div class="truncate text-xs font-bold uppercase tracking-[0.08em] text-white">{{ province.name }}</div>
    <div
      class="mt-1 text-xl font-black tabular-nums"
      :class="province.totalReport > 0 ? 'text-brand-light' : 'text-slate-600'"
    >
      {{ province.totalReport }}
    </div>
  </div>
</template>
