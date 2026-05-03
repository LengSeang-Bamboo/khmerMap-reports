<template>
  <div class="flex h-[100dvh] flex-col overflow-hidden bg-map-black text-slate-100">
    <main class="flex min-h-0 flex-1">
      <MapKhmerMap
        v-if="mapData"
        :api-data="mapData"
        :total-report="totalReport"
        :total-provinces="totalProvinces"
        :active-provinces="activeProvinces"
      />

      <div v-else-if="pending" class="flex flex-1 flex-col items-center justify-center gap-4 text-sm text-slate-500">
        <div class="size-12 animate-spin rounded-full border-4 border-white/10 border-t-brand" />
        <p>Fetching province data...</p>
      </div>

      <div v-else class="flex flex-1 flex-col items-center justify-center gap-4 text-sm text-slate-400">
        <p>Failed to load map data.</p>
        <button
          class="rounded-md border border-brand/70 px-5 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          @click="refresh()"
        >
          Retry
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { MapApiResponse } from '~/types/map'

useHead({ title: 'KhmerMap - Cambodia Interactive Province Map' })

const { data: mapData, pending, refresh } = await useFetch<MapApiResponse>('/api/map')

const totalReport = computed(() => mapData.value?.totalReport ?? 0)
const totalProvinces = computed(() => mapData.value?.totalItems ?? 25)
const activeProvinces = computed(() =>
  mapData.value?.items.filter(p => p.totalReport > 0).length ?? 0
)
</script>
