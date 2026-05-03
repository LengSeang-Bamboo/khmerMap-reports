<template>
  <aside
    class="flex shrink-0 flex-col bg-panel/95 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-300 min-[901px]:border-l min-[901px]:border-white/10 max-[900px]:w-full max-[900px]:border-t max-[900px]:border-white/10"
    :class="[
      collapsed ? 'min-[901px]:w-16 max-[900px]:h-[64px]' : 'min-[901px]:w-[330px] max-[900px]:h-[50dvh]'
    ]"
  >
    <div class="flex items-center justify-between border-b border-white/[0.06] px-3 py-3">
      <button
        class="grid size-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-brand/60 hover:text-brand-light"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="collapsed = !collapsed"
      >
        <PanelRightClose v-if="!collapsed" class="size-4 hidden min-[901px]:block" aria-hidden="true" />
        <PanelRightOpen v-if="collapsed" class="size-4 hidden min-[901px]:block" aria-hidden="true" />
        <ChevronDown v-if="!collapsed" class="size-4 min-[901px]:hidden" aria-hidden="true" />
        <ChevronUp v-if="collapsed" class="size-4 min-[901px]:hidden" aria-hidden="true" />
      </button>

      <div class="min-w-0 flex-1 px-2 transition-opacity" :class="collapsed ? 'max-[900px]:opacity-100 min-[901px]:hidden' : ''">
        <h2 class="truncate text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Provinces</h2>
        <p class="mt-0.5 truncate text-xs text-slate-500">{{ activeProvince?.name ?? 'Hover a province' }}</p>
      </div>
    </div>

    <div v-if="collapsed" class="hidden flex-1 flex-col items-center gap-3 px-2 py-3 min-[901px]:flex">
      <button
        class="grid size-10 place-items-center rounded-lg border border-white/[0.08] bg-panel-soft text-brand-light transition hover:border-brand/60"
        aria-label="Expand sidebar"
        @click="collapsed = false"
      >
        <MapPinned class="size-4" aria-hidden="true" />
      </button>
      <div class="h-px w-8 bg-white/10" />
      <p class="writing-vertical text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Province list</p>
    </div>

    <section v-else class="flex min-h-0 flex-1 flex-col px-4 py-4">
      <MapInfoCard :province="activeProvince" />

      <div class="mt-4 mb-3 flex items-center justify-between gap-3">
        <div class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">All provinces</div>
        <span class="rounded-md border border-white/[0.08] bg-panel-soft px-2 py-1 text-[11px] font-semibold text-slate-500">
          {{ allProvinces.length }}
        </span>
      </div>

      <div class="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        <button
          v-for="p in allProvinces"
          :key="p.id"
          class="group flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition hover:border-brand/70 hover:bg-brand/10"
          :class="activeProvince?.id === p.id ? 'border-brand/70 bg-brand/10 shadow-lg shadow-brand/10' : 'border-white/[0.08] bg-panel-soft'"
          @mouseenter="emit('province-hover', p)"
          @focus="emit('province-hover', p)"
        >
          <span class="min-w-0">
            <span class="block truncate text-xs font-semibold uppercase text-slate-100">{{ p.name }}</span>
            <span class="mt-0.5 block text-[11px] text-slate-500">{{ p.id }}</span>
          </span>
          <span class="flex shrink-0 items-center gap-2">
            <span
              class="rounded-md px-2 py-1 text-xs font-bold tabular-nums"
              :class="p.totalReport > 0 ? 'bg-brand/15 text-brand-light' : 'bg-white/[0.05] text-slate-500'"
            >
              {{ p.totalReport }}
            </span>
           
          </span>
        </button>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronRight, ChevronUp, MapPinned, PanelRightClose, PanelRightOpen } from 'lucide-vue-next'
import type { ProvinceItem, SelectedProvince } from '~/types/map'

defineProps<{
  activeProvince: SelectedProvince | null
  allProvinces: ProvinceItem[]
}>()

const emit = defineEmits<{
  'province-hover': [p: ProvinceItem]
}>()

const collapsed = ref(false)
</script>
