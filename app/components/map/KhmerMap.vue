<template>
  <div class="flex size-full min-h-0 overflow-hidden bg-map-black max-[900px]:flex-col">
    <MapHoverCard :province="hoveredProvince" :x="mouseX" :y="mouseY" />

    <section class="relative flex min-w-0 flex-1 flex-col bg-map-black">
      <div class="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] gap-2 rounded-xl border border-white/10 bg-panel/80 p-2 shadow-2xl shadow-black/50 backdrop-blur-md max-sm:left-3 max-sm:top-3 max-sm:grid max-sm:grid-cols-3">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex min-w-24 items-center gap-2 rounded-lg border border-white/[0.08] bg-panel-soft/90 px-2.5 py-2 max-sm:min-w-0"
        >
          <span class="grid size-7 shrink-0 place-items-center rounded-md bg-brand/10 text-brand-light">
            <component :is="stat.icon" class="size-3.5" aria-hidden="true" />
          </span>
          <span class="min-w-0">
            <strong class="block text-base font-bold leading-none tabular-nums text-white">{{ stat.value }}</strong>
            <span class="block truncate text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">{{ stat.label }}</span>
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
