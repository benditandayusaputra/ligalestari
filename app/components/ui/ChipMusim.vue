<script setup lang="ts">
/**
 * Penanda musim & pekan liga — data asli, bukan tagline marketing.
 * Gaya papan jadwal pertandingan: aksen garis kiri, tanpa pil, tanpa titik.
 */
defineProps<{
  musim: { nama?: string; pekan: number; totalPekan: number }
  /** Varian untuk latar gelap. */
  gelap?: boolean
}>()
</script>

<template>
  <p
    class="inline-flex items-center gap-2 border-l-2 pl-3 font-display text-caption font-semibold tracking-[0.12em] uppercase"
    :class="gelap ? 'border-lime text-white/85' : 'border-hijau text-teks-redup'"
  >
    <template v-if="musim.nama">
      <span>{{ musim.nama }}</span>
      <span aria-hidden="true" :class="gelap ? 'text-lime' : 'text-hijau-teks'">·</span>
    </template>
    <span class="tabular-nums" :class="gelap ? 'text-lime' : 'text-hijau-teks'">
      Pekan {{ musim.pekan }}/{{ musim.totalPekan }}
    </span>
  </p>
</template>
