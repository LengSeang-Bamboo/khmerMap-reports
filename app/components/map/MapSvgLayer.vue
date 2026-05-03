<template>
  <div ref="wrapEl" class="relative flex size-full items-center justify-center overflow-hidden bg-map-black">
    <svg
      v-if="svgFeatures"
      baseProfile="tiny"
      :fill="baseFill"
      stroke="rgba(255,255,255,0.12)"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width=".5"
      version="1.2"
      viewBox="0 0 1000 834"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      class="select-none"
      :style="{
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
      }"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      @wheel.prevent="onWheel"
      @mousedown="onMouseDown"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <g id="features" ref="featuresEl" v-html="svgFeatures" />

      <g id="labels" class="pointer-events-none select-none">
        <circle
          v-if="hoveredPos"
          :cx="hoveredPos.x"
          :cy="hoveredPos.y"
          r="4"
          fill="#020203"
          stroke="#ff6b52"
          stroke-width="1.8"
        />

        <g
          v-for="l in labels"
          :key="l.id"
          :transform="labelTransform(l)"
          style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.9));"
        >
          <text
            text-anchor="middle"
            :y="labelNameY(l)"
            fill="#f8fafc"
            :font-size="l.fontSize"
            font-weight="700"
            letter-spacing=".15"
            :opacity="hoveredId === l.id ? 1 : .84"
          >
            <tspan
              v-for="(line, index) in l.lines"
              :key="`${l.id}-${index}`"
              x="0"
              :dy="index === 0 ? 0 : l.fontSize + 1"
              :textLength="lineTextLength(l, line)"
              lengthAdjust="spacingAndGlyphs"
            >
              {{ line }}
            </tspan>
          </text>
          <text
            text-anchor="middle"
            :y="labelValueY(l)"
            :fill="l.count > 0 ? '#63e6d2' : 'rgba(248,250,252,0.42)'"
            :font-size="l.valueFontSize"
            font-weight="900"
          >
            {{ l.count }}
          </text>
        </g>
      </g>
    </svg>

    <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-slate-500">
      <div class="size-8 animate-spin rounded-full border-[3px] border-white/10 border-t-brand" />
      <span>Loading map...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapTheme, ProvinceItem } from '~/types/map'

const props = defineProps<{
  theme: MapTheme
  selectedIds: Set<string>
  choroplethFn: (id: string) => string
  provinceMap: Map<string, ProvinceItem>
}>()

const emit = defineEmits<{
  'province-hover': [id: string, name: string, x: number, y: number]
  'province-unhover': []
}>()

const { data } = await useFetch<{ features: string }>('/api/svg')
const svgFeatures = computed(() => data.value?.features ?? '')
const featuresEl = ref<SVGGElement | null>(null)
const wrapEl = ref<HTMLDivElement | null>(null)

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startDragPos = { x: 0, y: 0 }

const themeColors: Record<MapTheme, string> = {
  default: '#141821',
  heat: '#1d1113',
  cool: '#0f1a21',
  choropleth: '#141821',
}

const hoverColors: Record<MapTheme, string> = {
  default: '#ef4426',
  heat: '#ff6b52',
  cool: '#63e6d2',
  choropleth: '#ff6b52',
}

const baseFill = computed(() => themeColors[props.theme] ?? themeColors.default)
interface MapLabel {
  id: string
  name: string
  lines: string[]
  x: number
  y: number
  fontSize: number
  valueFontSize: number
  maxLineWidth: number
  count: number
}

const labels = ref<MapLabel[]>([])
const hoveredPos = ref<{ x: number, y: number } | null>(null)
const hoveredId = ref<string | null>(null)
const labelScale = computed(() => Math.max(0.46, Math.min(1.08, 1 / Math.sqrt(scale.value))))

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.min(Math.max(scale.value * delta, 0.55), 4)
}

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  isDragging.value = true
  startDragPos.x = e.clientX - translateX.value
  startDragPos.y = e.clientY - translateY.value
}

function onGlobalMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  translateX.value = e.clientX - startDragPos.x
  translateY.value = e.clientY - startDragPos.y
}

function onGlobalMouseUp() {
  isDragging.value = false
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  isDragging.value = true
  startDragPos.x = e.touches[0].clientX - translateX.value
  startDragPos.y = e.touches[0].clientY - translateY.value
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value || e.touches.length !== 1) return
  translateX.value = e.touches[0].clientX - startDragPos.x
  translateY.value = e.touches[0].clientY - startDragPos.y
}

function onTouchEnd() {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', onGlobalMouseMove)
  window.addEventListener('mouseup', onGlobalMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onGlobalMouseMove)
  window.removeEventListener('mouseup', onGlobalMouseUp)
})

watch([svgFeatures, () => props.theme, () => props.selectedIds], () => {
  nextTick(() => applyStyles())
}, { immediate: false })

watch(svgFeatures, () => {
  nextTick(() => {
    applyStyles()
    updateLabels()
  })
}, { immediate: true })

watch(() => props.selectedIds.size, () => nextTick(() => applyStyles()))
watch(() => props.provinceMap.size, () => nextTick(() => updateLabels()))

function fillFor(id: string, isSelected: boolean) {
  if (isSelected) return '#ef4426'
  if (props.theme === 'choropleth') return props.choroplethFn(id)
  return themeColors[props.theme] ?? themeColors.default
}

function applyStyles() {
  const g = featuresEl.value
  if (!g) return

  g.querySelectorAll<SVGElement>('path, circle').forEach(el => {
    const id = el.getAttribute('id') ?? ''
    const isSelected = props.selectedIds.has(id)

    el.style.fill = fillFor(id, isSelected)
    el.style.stroke = isSelected ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.11)'
    el.style.strokeWidth = isSelected ? '2' : '0.65'
    el.style.filter = isSelected ? 'drop-shadow(0 0 16px rgba(239,68,38,0.58))' : ''
    el.style.cursor = 'pointer'
    el.style.transition = 'fill 0.18s ease, stroke 0.18s ease, filter 0.18s ease, transform 0.18s ease'
    el.style.transformOrigin = 'center center'
    el.style.transform = isSelected ? 'scale(1.014)' : 'scale(1)'

    if (isSelected && el.parentNode?.lastElementChild !== el) {
      el.parentNode?.appendChild(el)
    }
  })
}

function updateLabels() {
  const g = featuresEl.value
  if (!g) return

  const newLabels: MapLabel[] = []
  g.querySelectorAll<SVGGraphicsElement>('path, circle').forEach(el => {
    const id = el.getAttribute('id') ?? ''
    const item = props.provinceMap.get(id)
    const name = item?.name ?? getName(el)

    try {
      const bbox = el.getBBox()
      const lines = wrapProvinceName(name, bbox)
      let cx = bbox.x + bbox.width / 2
      let cy = bbox.y + bbox.height / 2

      if (id === 'KH12') cy -= 10
      if (id === 'KH23') cx += 10
      if (id === 'KH24') cy -= 4

      newLabels.push({
        id,
        name,
        lines,
        x: cx,
        y: cy,
        fontSize: labelFontSize(lines, bbox),
        valueFontSize: labelValueFontSize(bbox),
        maxLineWidth: Math.max(12, bbox.width * 0.62),
        count: item?.totalReport ?? 0,
      })
    } catch {
      // Some SVG nodes may not report a bbox while the document is settling.
    }
  })
  labels.value = newLabels
}

function wrapProvinceName(name: string, bbox: { width: number, height: number }) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 1) return words
  const narrowShape = bbox.width < 80 || name.length > 13
  if (words.length === 2 && narrowShape) return words
  if (words.length === 2) return [name]

  const midpoint = Math.ceil(words.length / 2)
  return [
    words.slice(0, midpoint).join(' '),
    words.slice(midpoint).join(' '),
  ]
}

function labelFontSize(lines: string[], bbox: { width: number, height: number }) {
  const longestLine = Math.max(1, ...lines.map(line => line.length))
  const widthSize = bbox.width / longestLine * 1.4
  const heightSize = bbox.height / Math.max(1, lines.length + 1) * 0.34
  return Math.max(3.6, Math.min(7.2, widthSize, heightSize))
}

function labelValueFontSize(bbox: { width: number, height: number }) {
  return Math.max(3.8, Math.min(7.4, Math.min(bbox.width, bbox.height) * 0.12))
}

function labelTransform(label: MapLabel) {
  const hoverScale = hoveredId.value === label.id ? 1.12 : 1
  return `translate(${label.x}, ${label.y}) scale(${labelScale.value * hoverScale})`
}

function labelNameY(label: MapLabel) {
  return -((label.lines.length - 1) * (label.fontSize + 1)) / 2 - label.valueFontSize * 0.55
}

function labelValueY(label: MapLabel) {
  return ((label.lines.length - 1) * (label.fontSize + 1)) / 2 + label.valueFontSize + 1
}

function lineTextLength(label: MapLabel, line: string) {
  const naturalWidth = line.length * label.fontSize * 0.62
  if (naturalWidth <= label.maxLineWidth) return undefined
  return label.maxLineWidth
}

function getTarget(e: MouseEvent) {
  return (e.target as SVGElement)?.closest?.('path, circle') as SVGElement | null
}

function getName(el: SVGElement) {
  return el.getAttribute('name') ?? el.getAttribute('class') ?? ''
}

function onMouseMove(e: MouseEvent) {
  const el = getTarget(e)
  if (!el) {
    applyStyles()
    emit('province-unhover')
    hoveredPos.value = null
    hoveredId.value = null
    return
  }

  const id = el.getAttribute('id') ?? ''
  const name = getName(el)
  if (!id) return

  const label = labels.value.find(l => l.id === id)
  hoveredPos.value = label ? { x: label.x, y: label.y } : null
  hoveredId.value = id

  applyStyles()
  if (!props.selectedIds.has(id)) {
    el.style.fill = hoverColors[props.theme] ?? hoverColors.default
    el.style.filter = 'drop-shadow(0 0 18px rgba(239,68,38,0.62))'
    el.style.stroke = '#fff'
    el.style.strokeWidth = '1.8'
    el.style.transform = 'scale(1.018)'
    if (el.parentNode?.lastElementChild !== el) {
      el.parentNode?.appendChild(el)
    }
  }

  emit('province-hover', id, name, e.clientX, e.clientY)
}

function onMouseLeave() {
  applyStyles()
  emit('province-unhover')
  hoveredPos.value = null
  hoveredId.value = null
}

</script>
