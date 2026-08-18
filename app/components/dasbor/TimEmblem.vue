<script setup lang="ts">
/** Lencana kotak tim: inisial di atas warna identitasnya. */
const props = withDefaults(defineProps<{ warna: string; teks: string; ukuran?: number }>(), {
  ukuran: 40,
})

const gaya = computed(() => ({
  ...gayaEmblem(props.warna),
  width: `${props.ukuran}px`,
  height: `${props.ukuran}px`,
  borderRadius: `${Math.round(props.ukuran * 0.3)}px`,
  fontSize: `${Math.round(props.ukuran * 0.35)}px`,
}))
</script>

<template>
  <span class="flex shrink-0 items-center justify-center font-display font-bold" :style="gaya">
    {{ teks }}
  </span>
</template>
