<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const halamanHilang = computed(() => props.error.statusCode === 404)

const judul = computed(() => (halamanHilang.value ? 'Bola keluar lapangan.' : 'Pertandingan terhenti sejenak.'))

const keterangan = computed(() =>
  halamanHilang.value
    ? 'Halaman yang kamu cari tidak ada di daftar pertandingan musim ini. Yuk kembali ke tengah lapangan.'
    : 'Ada gangguan di sisi kami — bukan di kamu. Coba muat ulang halaman, atau kembali ke beranda liga.',
)

useSeoMeta({ title: judul, robots: 'noindex' })
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center bg-krem px-6 text-center">
    <LestariEmblem class="mb-5 h-18 w-18 text-hijau-teks" />
    <!-- Kode status bergaya papan skor pertandingan -->
    <p class="rounded-xl bg-tinta px-5 py-2 font-display text-[2.5rem] font-bold tracking-[0.06em] text-lime tabular-nums">
      {{ error.statusCode }}
    </p>
    <h1 class="mt-5 text-h1 font-bold tracking-[-0.02em]">{{ judul }}</h1>
    <p class="mt-3 max-w-sm text-body text-teks">{{ keterangan }}</p>
    <button
      type="button"
      class="mt-7 inline-flex items-center gap-2 rounded-xl bg-hijau px-6 py-3.5 text-body font-semibold text-white hover:bg-hijau-pekat"
      @click="clearError({ redirect: '/' })"
    >
      <Icon name="lucide:arrow-left" size="17" class="text-lime" aria-hidden="true" />
      Kembali ke Beranda
    </button>
  </div>
</template>
