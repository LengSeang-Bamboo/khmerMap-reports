<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-[110%] whitespace-nowrap rounded-lg border border-brand/30 bg-panel/95 px-3 py-1.5 text-sm font-medium text-slate-100 shadow-xl shadow-black/50 ring-1 ring-brand/10 backdrop-blur-md"
      :style="{ left: x + 'px', top: y + 'px' }"
    >
      {{ text }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean, text: string, x: number, y: number }>()
</script>
