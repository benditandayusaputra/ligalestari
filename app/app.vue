<script setup lang="ts">
// Judul default + pola judul per halaman ("Judul · LigaLestari").
useHead({
  titleTemplate: (judul) => (judul ? `${judul} · LigaLestari` : 'LigaLestari — Pilah Sampah, Rebut Juara'),
})

// Meta berbagi (Open Graph / Twitter) berlaku untuk semua halaman.
useSeoMeta({
  ogSiteName: 'LigaLestari',
  ogLocale: 'id_ID',
  ogImage: '/og.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'LigaLestari — liga misi hijau antar-kelas: pilah sampah, rebut juara',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="#0e6b46" error-color="#a83326" :height="3" :throttle="100" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- Widget chatbot global — chunk terpisah, dihidrasi saat browser
         senggang: keluar dari bundle awal tanpa mengubah pengalaman. -->
    <LazyAsistenHijau hydrate-on-idle />
  </div>
</template>
