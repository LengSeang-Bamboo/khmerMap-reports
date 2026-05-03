import type { MapApiResponse, ProvinceItem } from '~/types/map'

export function useMapData(apiData?: Ref<MapApiResponse | null>) {
  const { data, pending, error } = apiData
    ? { data: apiData, pending: ref(false), error: ref(null) }
    : useFetch<MapApiResponse>('/api/map')

  const provinceMap = computed<Map<string, ProvinceItem>>(() => {
    const m = new Map<string, ProvinceItem>()
    data.value?.items.forEach(p => m.set(p.id, p))
    return m
  })

  const maxReport = computed(() =>
    Math.max(1, ...(data.value?.items.map(p => p.totalReport) ?? [1]))
  )

  function getProvince(id: string): ProvinceItem | undefined {
    return provinceMap.value.get(id)
  }

  function choroplethColor(id: string): string {
    const item = provinceMap.value.get(id)
    if (!item || maxReport.value === 0) return '#141821'
    const t = item.totalReport / maxReport.value
    if (t === 0) return '#141821'
    const r = Math.round(20 + t * (239 - 20))
    const g = Math.round(24 + t * (68 - 24))
    const b = Math.round(33 + t * (38 - 33))
    return `rgb(${r},${g},${b})`
  }

  return { data, pending, error, provinceMap, maxReport, getProvince, choroplethColor }
}
