<script setup lang="ts">
/** Kepala section: label kecil kapital (kicker) + judul besar. */
defineProps<{
  kicker: string
  judul: string
  /** Varian warna untuk section berlatar gelap. */
  gelap?: boolean
}>()
</script>

<template>
  <div>
    <p
      class="text-caption font-semibold tracking-[0.14em] uppercase"
      :class="gelap ? 'text-lime' : 'text-hijau-teks'"
    >
      {{ kicker }}
    </p>
    <h2
      class="mt-2 text-h2 font-bold tracking-[-0.015em]"
      :class="gelap && 'text-white'"
    >
      {{ judul }}
    </h2>
  </div>
</template>
