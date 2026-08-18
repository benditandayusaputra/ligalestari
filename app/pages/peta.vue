<script setup lang="ts">
useSeoMeta({
  title: 'Peta Persebaran Pohon',
  description:
    'Peta transparansi penghijauan LigaLestari: setiap titik mewakili penanaman pohon oleh sebuah kelas, lengkap dengan estimasi serapan CO₂-nya.',
})

// Jabat tangan awal ke server tile vektor supaya peta tampil lebih cepat.
useHead({ link: [{ rel: 'preconnect', href: 'https://tiles.openfreemap.org', crossorigin: '' }] })

import { LOKASI_SEKOLAH_BAWAAN } from '#shared/data/peta'

const { data } = await useFetch('/api/peta', { key: 'peta' })
const semuaTitik = computed(() => data.value?.titik ?? [])
const lokasi = computed(() => data.value?.lokasi ?? LOKASI_SEKOLAH_BAWAAN)

/** Benar bila gaya peta gagal dimuat (offline) → jatuh ke denah kanvas. */
const gagalPeta = ref(false)

/** Kelas yang sedang disembunyikan dari peta (toggle lewat legenda). */
const tersembunyi = ref<Record<string, boolean>>({})
const pilihan = ref<number | null>(null)

const titikTampil = computed(() => semuaTitik.value.filter((t) => !tersembunyi.value[t.kelasId]))

// Statistik mengikuti filter: hanya menjumlah titik yang sedang tampil.
const totalPohon = computed(() => titikTampil.value.reduce((a, t) => a + t.jumlah, 0))
const totalCo2 = computed(() => titikTampil.value.reduce((a, t) => a + t.co2, 0))

/** Legenda: agregat per kelas, hanya kelas yang punya titik tanam. */
const legenda = computed(() => {
  const perKelas = new Map<string, { id: string; nama: string; warna: string; pohon: number; titik: number; aktif: boolean }>()
  for (const t of semuaTitik.value) {
    const isi = perKelas.get(t.kelasId) ?? {
      id: t.kelasId,
      nama: t.kelas.nama,
      warna: t.kelas.warna,
      pohon: 0,
      titik: 0,
      aktif: !tersembunyi.value[t.kelasId],
    }
    isi.pohon += t.jumlah
    isi.titik += 1
    perKelas.set(t.kelasId, isi)
  }
  return [...perKelas.values()]
})

function alihkanKelas(id: string) {
  tersembunyi.value[id] = !tersembunyi.value[id]
  pilihan.value = null
}

function pilihTitik(indeks: number) {
  pilihan.value = pilihan.value === indeks ? null : indeks
}
</script>

<template>
  <div>
    <section class="mx-auto max-w-275 px-5 pt-7.5 pb-1 lg:px-10 lg:pt-11.5 lg:pb-1.5">
      <p class="text-caption font-semibold tracking-[0.14em] text-hijau-teks uppercase">Transparansi Penghijauan</p>
      <h1 class="mt-2.5 max-w-170 text-h1 font-bold tracking-[-0.02em]">Peta Persebaran Pohon</h1>
      <p class="mt-3.5 max-w-140 text-body text-teks">
        Setiap titik mewakili penanaman oleh sebuah kelas. Data ditampilkan per kelas — tanpa
        identitas pribadi siswa.
      </p>

      <div class="mt-6 grid gap-3.5 sm:grid-cols-2">
        <div v-anim class="rounded-[18px] border border-white/10 bg-tinta px-5.5 py-5">
          <div class="flex items-center gap-2">
            <Icon name="lucide:tree-deciduous" size="19" class="text-lime" aria-hidden="true" />
            <span class="text-caption font-semibold tracking-[0.12em] text-lime uppercase">Pohon ditanam</span>
          </div>
          <div class="mt-2.5 font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.125rem)] leading-none font-bold text-white">
            {{ formatAngka(totalPohon) }}
          </div>
        </div>
        <div v-anim="90" class="rounded-[18px] border border-white/10 bg-tinta px-5.5 py-5">
          <div class="flex items-center gap-2">
            <Icon name="lucide:leaf" size="19" class="text-lime" aria-hidden="true" />
            <span class="text-caption font-semibold tracking-[0.12em] text-lime uppercase">Estimasi CO₂ diserap / tahun</span>
          </div>
          <div class="mt-2.5 font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.125rem)] leading-none font-bold text-white">
            {{ formatAngka(totalCo2) }}<span class="text-lead font-semibold text-white/70"> kg</span>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-275 px-5 pt-4.5 pb-12 lg:px-10 lg:pt-5.5">
      <div class="flex flex-col items-stretch gap-4 lg:flex-row">
        <ClientOnly>
          <PetaLibre
            v-if="!gagalPeta"
            :titik="titikTampil"
            :pilihan="pilihan"
            :lokasi="lokasi"
            @pilih="pilihTitik"
            @tutup="pilihan = null"
            @gagal="gagalPeta = true"
          />
          <PetaKanvas v-else :titik="titikTampil" :pilihan="pilihan" @pilih="pilihTitik" @tutup="pilihan = null" />
          <template #fallback>
            <div class="min-w-0 flex-1">
              <div
                class="peta-skeleton h-95 w-full animate-pulse rounded-[18px] motion-reduce:animate-none lg:h-130"
                aria-hidden="true"
              />
            </div>
          </template>
        </ClientOnly>
        <PetaLegenda :item="legenda" @alihkan="alihkanKelas" />
      </div>
    </section>
  </div>
</template>
