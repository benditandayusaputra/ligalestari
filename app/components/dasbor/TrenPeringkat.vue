<script setup lang="ts">
/** Indikator naik/turun peringkat dibanding pekan lalu. */
const props = defineProps<{ tren: number }>()

const label = computed(() =>
  props.tren > 0 ? `naik ${props.tren}` : props.tren < 0 ? `turun ${Math.abs(props.tren)}` : 'tetap',
)
</script>

<template>
  <span
    class="text-[0.625rem] font-bold"
    :class="tren > 0 ? 'text-hijau-teks' : tren < 0 ? 'text-[#B91C1C] dark:text-[#F28B82]' : 'text-teks-samar'"
    :aria-label="`Peringkat ${label}`"
  >
    {{ labelTren(tren) }}
  </span>
</template>
