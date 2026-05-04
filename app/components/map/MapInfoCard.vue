<template>
  <div class="rounded-lg border border-white/[0.08] bg-panel-soft p-3">
    <template v-if="province">
      <div class="flex items-center justify-between gap-4">
        <div class="min-w-0">
          <p class="text-[10px] font-black uppercase tracking-widest text-brand/80 transition-colors group-hover:text-brand">{{ province.id }}</p>
          <h2 class="mt-1 truncate text-lg font-black tracking-tight text-white">{{ province.name }}</h2>
        </div>
        
        <div class="flex shrink-0 items-center gap-2">
          <!-- Flagged Stats -->
          <div v-if="province.totalFlagged > 0" class="flex flex-col items-center">
            <div class="flex h-[44px] w-[58px] flex-col items-center justify-center rounded-lg bg-red-500/10 ring-1 ring-inset ring-red-500/20 shadow-lg shadow-red-500/5">
              <span class="block text-base font-black tabular-nums leading-none text-red-500">{{ province.totalFlagged }}</span>
              <span class="mt-1.5 block text-[7px] font-black uppercase tracking-tighter text-red-500/70">FLAGGED</span>
            </div>
          </div>
          
          <!-- Total Stats -->
          <div class="flex flex-col items-center">
            <div 
              class="flex h-[44px] w-[58px] flex-col items-center justify-center rounded-lg shadow-lg transition-all"
              :class="province.totalReport > 0 ? 'bg-brand/10 text-brand-light ring-1 ring-brand/20 shadow-brand/10' : 'bg-white/[0.03] text-slate-600 ring-1 ring-white/5'"
            >
              <span class="block text-base font-black tabular-nums leading-none">{{ province.totalReport }}</span>
              <span class="mt-1.5 block text-[7px] font-black uppercase tracking-tighter opacity-70">REPORTS</span>
            </div>
          </div>
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
