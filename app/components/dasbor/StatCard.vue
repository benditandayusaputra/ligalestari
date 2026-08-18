<script setup lang="ts">
/** Kartu statistik kecil: label + angka (+ satuan / ikon opsional). */
defineProps<{
  label: string
  nilai: string | number
  satuan?: string
  ikon?: string
  tengah?: boolean
  /** Aksen warna angka, kelas dua-tema agar kontras aman di terang & gelap. */
  aksen?: 'hijau' | 'biru' | 'emas'
}>()

const KELAS_AKSEN = {
  hijau: 'text-hijau-teks',
  biru: 'text-[#1D6FB8] dark:text-[#7CBCF0]',
  emas: 'text-[#8A6508] dark:text-[#F2CE52]',
} as const
</script>

<template>
  <div class="rounded-2xl border border-garis bg-surface px-3.5 py-3.25" :class="tengah && 'text-center'">
    <div class="mb-1.5 flex items-center gap-1.75 text-[0.6875rem] font-semibold text-teks-redup" :class="tengah && 'justify-center'">
      <Icon v-if="ikon" :name="ikon" size="16" class="text-hijau-teks" aria-hidden="true" />
      {{ label }}
    </div>
    <div class="font-display text-2xl font-bold tracking-[-0.02em]" :class="aksen && KELAS_AKSEN[aksen]">
      {{ typeof nilai === 'number' ? formatAngka(nilai) : nilai
      }}<span v-if="satuan" class="text-[0.8125rem] font-semibold text-teks-samar"> {{ satuan }}</span>
    </div>
  </div>
</template>
