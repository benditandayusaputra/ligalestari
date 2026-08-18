<script setup lang="ts">
import type { KategoriArtikel } from '#shared/types'

useSeoMeta({
  title: 'Artikel & Edukasi',
  description:
    'Panduan praktis memilah sampah dan menanam pohon, bekal supaya tiap misi LigaLestari benar-benar berdampak.',
})

const { data } = await useFetch('/api/artikel', { key: 'artikel' })
const daftar = computed(() => data.value?.artikel ?? [])

type Filter = 'semua' | KategoriArtikel

const PILIHAN: { kunci: Filter; label: string }[] = [
  { kunci: 'semua', label: 'Semua' },
  { kunci: 'sampah', label: 'Sampah' },
  { kunci: 'pohon', label: 'Pohon' },
]

const route = useRoute()
const router = useRouter()

// Filter aktif tersimpan di query URL agar hasil saringan bisa dibagikan.
const filter = ref<Filter>(
  PILIHAN.some((p) => p.kunci === route.query.kategori) ? (route.query.kategori as Filter) : 'semua',
)
watch(filter, (nilai) => {
  router.replace({ query: nilai === 'semua' ? {} : { kategori: nilai } })
})

const jumlah = (kunci: Filter) =>
  kunci === 'semua' ? daftar.value.length : daftar.value.filter((a) => a.kategori === kunci).length

const tampil = computed(() =>
  filter.value === 'semua' ? daftar.value : daftar.value.filter((a) => a.kategori === filter.value),
)
</script>

<template>
  <div>
    <section class="mx-auto max-w-275 px-5 pt-7.5 pb-1 lg:px-10 lg:pt-11.5 lg:pb-2">
      <div v-anim>
        <p class="text-caption font-semibold tracking-[0.14em] text-hijau-teks uppercase">Belajar Hijau</p>
        <h1 class="mt-2.5 max-w-170 text-h1 font-bold tracking-[-0.02em]">Artikel &amp; Edukasi</h1>
        <p class="mt-3.5 max-w-140 text-body text-teks">
          Panduan praktis memilah sampah dan menanam pohon, bekal supaya tiap misi LigaLestari
          benar-benar berdampak.
        </p>
      </div>

      <div v-anim="80" role="group" aria-label="Filter kategori artikel" class="mt-6.5 flex flex-wrap gap-2.5">
        <button
          v-for="pilihan in PILIHAN"
          :key="pilihan.kunci"
          type="button"
          :aria-pressed="filter === pilihan.kunci"
          class="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4.5 text-small font-semibold"
          :class="
            filter === pilihan.kunci
              ? 'border-hijau bg-hijau text-white'
              : 'border-garis-tegas bg-surface text-teks hover:border-hijau-teks/40'
          "
          @click="filter = pilihan.kunci"
        >
          {{ pilihan.label }}
          <span
            class="text-caption font-normal tabular-nums"
            :class="filter === pilihan.kunci ? 'text-white' : 'text-teks-samar'"
          >
            {{ jumlah(pilihan.kunci) }}
          </span>
        </button>
      </div>
    </section>

    <section class="mx-auto max-w-275 px-5 py-5 pb-14 lg:px-10 lg:pt-6">
      <div class="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Artikel pertama tampil sebagai kartu unggulan lebar di layar besar -->
        <ArtikelCard
          v-for="(artikel, i) in tampil"
          :key="artikel.slug"
          v-anim="(i % 3) * 60"
          :artikel="artikel"
          :unggulan="i === 0"
          :class="i === 0 && 'lg:col-span-2'"
        />
      </div>
    </section>
  </div>
</template>
