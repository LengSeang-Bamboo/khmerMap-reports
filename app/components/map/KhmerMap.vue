<template>
  <div class="flex size-full min-h-0 overflow-hidden bg-map-black max-[900px]:flex-col">
    <MapHoverCard :province="hoveredProvince" :x="mouseX" :y="mouseY" />

    <section class="relative flex min-w-0 flex-1 flex-col bg-map-black">
      <div class="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] gap-2 rounded-xl border border-white/[0.06] bg-[#0b0e14]/90 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl max-sm:left-3 max-sm:top-3 max-sm:grid max-sm:w-[calc(100%-1.5rem)] max-sm:grid-cols-3">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="group relative flex min-w-[120px] items-center gap-3 rounded-xl bg-white/[0.02] px-3.5 py-2.5 transition-all duration-300 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(239,68,38,0.1)] max-sm:min-w-0 max-sm:flex-col max-sm:items-center max-sm:gap-2 max-sm:px-2 max-sm:py-3"
        >
          <div class="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.04] transition-all duration-300 group-hover:ring-brand/20" />
          
          <span class="relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ring-1 ring-brand/20 max-sm:size-8">
            <component :is="stat.icon" class="size-[18px] max-sm:size-4" aria-hidden="true" />
            <div class="absolute inset-0 rounded-xl bg-brand/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </span>
          
          <span class="relative z-10 min-w-0 text-left max-sm:text-center">
            <strong class="block text-xl font-black leading-none tracking-tight text-slate-100 max-sm:text-lg">{{ stat.value }}</strong>
            <span class="mt-1 block truncate text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 max-sm:mt-0.5 max-sm:text-[8px]">{{ stat.label }}</span>
          </span>
        </div>
      </div>

      <div class="relative flex min-h-0 flex-1 overflow-hidden bg-map-black">
        <MapSvgLayer
          :theme="interaction.theme.value"
          :selected-ids="selectedIds"
          :choropleth-fn="mapData.choroplethColor"
          :province-map="mapData.provinceMap.value"
          @province-hover="onProvinceHover"
          @province-unhover="onProvinceUnhover"
        />
      </div>
    </section>

    <MapSidebar
      :active-province="interaction.activeProvince.value"
      :all-provinces="mapData.data.value?.items ?? []"
      @province-hover="onProvinceListHover"
    />
  </div>
</template>

<script setup lang="ts">
import { Activity, MapPinned, Siren } from 'lucide-vue-next'
import type { MapApiResponse, ProvinceItem } from '~/types/map'

const props = defineProps<{
  apiData?: MapApiResponse
  totalReport?: number
  totalProvinces?: number
  activeProvinces?: number
}>()

const apiDataRef = computed(() => props.apiData ?? null)
const mapData = useMapData(apiDataRef as Ref<MapApiResponse | null>)
const interaction = useMapInteraction()

const selectedIds = computed(() => {
  const hoveredId = interaction.hoveredId.value
  return new Set(hoveredId ? [hoveredId] : [])
})
const stats = computed(() => [
  { icon: Siren, value: props.totalReport ?? 0, label: 'Reports' },
  { icon: MapPinned, value: props.totalProvinces ?? 0, label: 'Provinces' },
  { icon: Activity, value: props.activeProvinces ?? 0, label: 'Active' },
])

const mouseX = ref(0)
const mouseY = ref(0)
const hoveredProvince = ref<ProvinceItem | null>(null)

function onProvinceHover(id: string, _name: string, x: number, y: number) {
  const item = mapData.getProvince(id)
  mouseX.value = x
  mouseY.value = y
  hoveredProvince.value = item ?? null
  interaction.hoveredId.value = id
  interaction.activeProvince.value = item ?? null
}

function onProvinceUnhover() {
  hoveredProvince.value = null
  interaction.hoveredId.value = null
  interaction.activeProvince.value = null
}

function onProvinceListHover(p: ProvinceItem) {
  hoveredProvince.value = null
  interaction.hoveredId.value = p.id
  interaction.activeProvince.value = p
}
</script>
