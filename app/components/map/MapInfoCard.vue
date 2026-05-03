<template>
  <div class="rounded-lg border border-white/[0.08] bg-panel-soft p-3">
    <template v-if="province">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-light">{{ province.id }}</p>
          <h2 class="mt-1 truncate text-base font-semibold text-white">{{ province.name }}</h2>
        </div>
        <div class="flex flex-col items-center gap-1 shrink-0">
          <div class="rounded-md bg-brand/10 px-2.5 py-1 text-base font-bold tabular-nums text-brand-light">
            {{ province.totalReport }}
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider text-slate-500">Reports</span>
        </div>
      </div>
    </template>

    <div v-else class="flex min-h-16 items-center gap-3">
      <span class="grid size-9 shrink-0 place-items-center rounded-md bg-white/[0.04]">
        <MapPinned class="size-5 text-slate-600" aria-hidden="true" />
      </span>
      <p class="text-sm leading-5 text-slate-500">Hover any province to inspect it</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPinned } from 'lucide-vue-next'
import type { SelectedProvince } from '~/types/map'

defineProps<{
  province: SelectedProvince | null
}>()
</script>
