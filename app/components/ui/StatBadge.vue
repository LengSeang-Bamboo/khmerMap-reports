<template>
  <div
    class="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-panel-soft px-3 py-2 transition hover:border-white/15"
    :class="minimal && 'gap-2 px-2.5 py-2'"
  >
    <div class="grid size-8 shrink-0 place-items-center rounded-md bg-brand/10 text-brand-light" :class="minimal && 'size-7'">
      <component :is="icon" class="size-[18px]" :class="minimal && 'size-3.5'" aria-hidden="true" />
    </div>
    <div class="min-w-0 flex flex-col gap-0.5">
      <div class="text-lg font-bold leading-none tabular-nums text-white" :class="minimal && 'text-base'">{{ value }}</div>
      <div v-if="!minimal" class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{{ label }}</div>
      <div v-else class="truncate text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">{{ label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  value: number | string
  label: string
  minimal?: boolean
}>()
</script>
