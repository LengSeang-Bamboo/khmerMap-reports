export interface ProvinceItem {
  id: string
  name: string
  totalReport: number
}

export interface MapApiResponse {
  totalReport: number
  totalItems: number
  items: ProvinceItem[]
}

export type MapTheme = 'default' | 'heat' | 'cool' | 'choropleth'

export interface SelectedProvince {
  id: string
  name: string
  totalReport: number
}
