<script setup lang="ts">
import { KATEGORI } from '#shared/data/artikel'

const route = useRoute()
const slug = route.params.slug as string

const { data, error } = await useFetch(`/api/artikel/${slug}`, { key: `artikel-${slug}` })

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan', fatal: true })
}

const { artikel, terkait } = data.value
const kategori = KATEGORI[artikel.kategori]

// Paragraf pertama tampil sebagai lead, sedikit lebih besar dari isi.
const indeksLead = artikel.isi.findIndex((b) => b.jenis === 'paragraf')

useSeoMeta({
  title: artikel.judul,
  description: artikel.ringkasan,
  ogType: 'article',
})

useSchemaOrg([
  defineArticle({
    headline: artikel.judul,
    description: artikel.ringkasan,
    datePublished: artikel.tanggal,
    inLanguage: 'id',
    author: { name: 'Tim Redaksi LigaLestari' },
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Beranda', item: '/' },
      { name: 'Artikel & Edukasi', item: '/artikel' },
      { name: artikel.judul },
    ],
  }),
])
</script>

<template>
  <div>
    <article class="mx-auto max-w-180 px-5 pt-6.5 pb-2 lg:px-10 lg:pt-10 lg:pb-3">
      <NuxtLink
        to="/artikel"
        class="mb-5 inline-flex items-center gap-1.5 py-1.5 text-small font-semibold text-hijau-teks hover:underline"
      >
        <Icon name="lucide:chevron-left" size="16" aria-hidden="true" />
        Kembali ke daftar
      </NuxtLink>

      <div>
        <span
          class="inline-flex rounded-md px-2.5 py-1 text-caption font-semibold"
          :style="{ background: kategori.chipBg, color: kategori.chipTeks }"
        >
          {{ kategori.label }}
        </span>
      </div>

      <h1 class="mt-4 mb-3.5 text-h1 font-bold tracking-[-0.02em] text-balance">
        {{ artikel.judul }}
      </h1>

      <p class="mb-6 text-small font-normal text-teks-samar">
        {{ formatTanggal(artikel.tanggal) }} · {{ artikel.menitBaca }} menit baca · Tim Redaksi LigaLestari
      </p>

      <div
        class="relative mb-3 h-50 overflow-hidden rounded-[20px] lg:h-75"
        :style="{ backgroundColor: kategori.thumbBg }"
        role="img"
        :aria-label="`Ilustrasi artikel: ${artikel.thumb.alt}`"
      >
        <IlustrasiArtikel :slug="artikel.slug" :kategori="artikel.kategori" />
      </div>
      <p class="mb-8 text-caption text-teks-samar italic">Ilustrasi: {{ artikel.thumb.alt }}</p>

      <!-- Isi artikel dirender per blok: sub-judul, paragraf, atau butir -->
      <div class="text-baca text-teks-kuat">
        <template v-for="(blok, i) in artikel.isi" :key="i">
          <h2
            v-if="blok.jenis === 'judul'"
            class="mt-9 mb-3 text-h3 font-semibold text-teks-kuat first:mt-0"
          >
            {{ blok.teks }}
          </h2>
          <p
            v-else-if="blok.jenis === 'paragraf'"
            class="mb-4.5"
            :class="i === indeksLead && 'text-lead text-teks-kuat'"
          >
            {{ blok.teks }}
          </p>
          <div v-else class="mb-2.5 flex items-start gap-2.5">
            <span class="shrink-0 font-bold text-daun-teks" aria-hidden="true">&ndash;</span>
            <span>{{ blok.teks }}</span>
          </div>
        </template>
      </div>

      <div class="mt-8.5 rounded-[18px] border border-garis bg-surface px-6 py-5.5">
        <div class="mb-3.5 flex items-center gap-2">
          <Icon name="lucide:book-open" size="18" class="text-hijau-teks" aria-hidden="true" />
          <h2 class="text-h3 font-semibold">Sumber</h2>
        </div>
        <ol class="flex flex-col gap-2.5">
          <li
            v-for="(sumber, i) in artikel.sumber"
            :key="i"
            class="flex gap-2.25 text-small leading-normal text-teks"
          >
            <span class="shrink-0 font-semibold text-hijau-teks tabular-nums">{{ i + 1 }}.</span>
            <span>{{ sumber }}</span>
          </li>
        </ol>
      </div>

      <!-- Jembatan edukasi → aksi: artikel selesai, ajak praktik di liga -->
      <div class="my-8.5 rounded-[18px] border border-mint-garis bg-mint px-6 py-5.5">
        <h2 class="font-display text-h3 font-semibold">Sudah paham? Praktikkan di kelasmu.</h2>
        <p class="mt-1.5 max-w-120 text-small text-teks">
          Setiap ilmu di artikel ini bisa langsung jadi Poin Hijau, ikut event setoran atau
          tanam pohon bersama kelasmu, dan pantau hasilnya di klasemen.
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <NuxtLink
            to="/daftar"
            class="inline-flex items-center gap-2 rounded-xl bg-hijau px-5 py-2.75 text-small font-semibold text-white hover:bg-hijau-pekat"
          >
            Daftar / Gabung Kelas
            <Icon name="lucide:arrow-right" size="15" class="text-lime" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink to="/#klasemen" class="py-1 text-small font-semibold text-hijau-teks hover:underline">
            Lihat klasemen
          </NuxtLink>
        </div>
      </div>
    </article>

    <section class="bg-hijau-muda px-5 py-10 lg:px-10 lg:py-14" aria-label="Artikel terkait">
      <div class="mx-auto max-w-250">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <h2 class="text-h2 font-bold tracking-[-0.015em]">Artikel terkait</h2>
          <NuxtLink
            to="/artikel"
            class="inline-flex items-center gap-1.5 py-1 text-small font-semibold text-hijau-teks hover:underline"
          >
            Semua artikel
            <Icon name="lucide:chevron-right" size="15" aria-hidden="true" />
          </NuxtLink>
        </div>
        <div class="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          <ArtikelCard v-for="(a, i) in terkait" :key="a.slug" v-anim="(i % 3) * 60" :artikel="a" />
        </div>
      </div>
    </section>
  </div>
</template>
