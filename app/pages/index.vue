<script setup lang="ts">
// Data liga diambil dari API server; saat `nuxt generate` hasilnya
// dibekukan ke payload statis sehingga tetap cepat di hosting statis.
const { data: liga } = await useFetch('/api/klasemen', { key: 'klasemen' })

if (!liga.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data liga tidak tersedia' })
}

useSeoMeta({
  description:
    'LigaLestari adalah liga misi hijau antar-kelas: setor sampah, tanam pohon, kumpulkan Poin Hijau, dan bawa kelasmu ke puncak klasemen sekolah.',
})
</script>

<template>
  <div v-if="liga">
    <LandingHero :tim="liga.tim" :musim="liga.musim" />
    <MasalahSection />
    <CaraKerjaSection />
    <KlasemenSection :tim="liga.tim" :musim="liga.musim" />
    <FiturSection :tim="liga.tim" :musim="liga.musim" />
    <DampakSection :dampak="liga.dampak" :jumlah-kelas="liga.tim.length" />
    <AjakanSection />
  </div>
</template>
