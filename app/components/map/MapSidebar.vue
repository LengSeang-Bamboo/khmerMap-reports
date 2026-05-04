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

      <!-- Search & Sort Controls -->
      <div class="mt-5 space-y-3">
        <div class="relative group">
          <Search class="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-brand" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search province..."
            class="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2.5 pl-9 pr-4 text-xs font-medium text-slate-200 outline-none transition-all focus:border-brand/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-brand/20 placeholder:text-slate-600"
          >
        </div>

        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-1.5">
            <button
              v-for="opt in sortOptions"
              :key="opt.id"
              class="rounded-md border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
              :class="sortBy === opt.id ? 'border-brand/40 bg-brand/10 text-brand-light' : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/10 hover:bg-white/[0.04]'"
              @click="sortBy = opt.id"
            >
              {{ opt.label }}
            </button>
          </div>
          
          <div class="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
            <span class="text-[10px] font-black tabular-nums text-slate-400">{{ filteredProvinces.length }}</span>
            <span class="text-[9px] font-black uppercase tracking-tighter text-slate-600">ITEMS</span>
          </div>
        </div>
      </div>

      <!-- Province List -->
      <div class="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 text-slate-100">
        <div class="relative space-y-1">
          <TransitionGroup
            enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            enter-from-class="opacity-0 translate-x-4"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="absolute transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-4"
            move-class="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          >
            <button
              v-for="p in filteredProvinces"
              :key="p.id"
              class="group flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-all duration-200 text-left hover:bg-white/[0.03]"
              :class="activeProvince?.id === p.id ? 'border-brand/40 bg-brand/5 shadow-[0_0_15px_rgba(239,68,38,0.05)]' : 'border-white/[0.04] bg-panel-soft'"
              @mouseenter="emit('province-hover', p)"
              @focus="emit('province-hover', p)"
            >
              <div class="min-w-0 flex-1">
                <span class="block truncate text-xs font-bold tracking-tight text-slate-200 transition-colors group-hover:text-white">{{ p.name }}</span>
                <span class="mt-0.5 block text-[10px] font-medium text-slate-500 uppercase tracking-wider">{{ p.id }}</span>
              </div>
              
              <div class="flex shrink-0 items-center gap-1.5">
                <!-- Flagged Badge (Fixed Symmetry) -->
                <div class="w-[34px] shrink-0">
                  <div 
                    v-if="p.totalFlagged > 0"
                    class="flex h-[34px] w-[34px] flex-col items-center justify-center rounded-md bg-red-500/10 ring-1 ring-inset ring-red-500/20"
                  >
                    <span class="block text-[11px] font-black tabular-nums leading-none text-red-500">{{ p.totalFlagged }}</span>
                    <span class="mt-0.5 block text-[6px] font-black uppercase tracking-tighter text-red-500/70">FLG</span>
                  </div>
                </div>

                <!-- Total Badge (Fixed Symmetry) -->
                <div 
                  class="flex h-[34px] w-[34px] flex-col items-center justify-center rounded-md transition-colors"
                  :class="p.totalReport > 0 ? 'bg-brand/10 text-brand-light ring-1 ring-brand/20' : 'bg-white/[0.03] text-slate-600'"
                >
                  <span class="block text-[11px] font-black tabular-nums leading-none">{{ p.totalReport }}</span>
                  <span class="mt-0.5 block text-[6px] font-black uppercase tracking-tighter opacity-70">REPS</span>
                </div>
              </div>
            </button>
          </TransitionGroup>
        </div>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronRight, ChevronUp, MapPinned, PanelRightClose, PanelRightOpen, Search, SortAsc, TrendingUp } from 'lucide-vue-next'
import type { ProvinceItem, SelectedProvince } from '~/types/map'

const props = defineProps<{
  activeProvince: SelectedProvince | null
  allProvinces: ProvinceItem[]
}>()

const emit = defineEmits<{
  'province-hover': [p: ProvinceItem]
}>()

const collapsed = ref(false)
const searchQuery = ref('')
const sortBy = ref<'name' | 'reports'>('reports')

const sortOptions = [
  { id: 'reports', label: 'Reports', icon: TrendingUp },
  { id: 'name', label: 'A-Z', icon: SortAsc },
] as const

const filteredProvinces = computed(() => {
  let result = [...props.allProvinces]
  
  // Filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q)
    )
  }
  
  // Sort
  result.sort((a, b) => {
    if (sortBy.value === 'reports') {
      return b.totalReport - a.totalReport || a.name.localeCompare(b.name)
    }
    return a.name.localeCompare(b.name)
  })
  
  return result
})
</script>
