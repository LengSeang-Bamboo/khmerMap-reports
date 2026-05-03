import type { MapTheme, SelectedProvince } from '~/types/map'

export function useMapInteraction() {
  const theme = ref<MapTheme>('choropleth')
  const hoveredId = ref<string | null>(null)
  const activeProvince = ref<SelectedProvince | null>(null)

  return {
    theme,
    hoveredId,
    activeProvince,
  }
}
