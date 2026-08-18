<script setup lang="ts">
definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Laporan Dampak' })

const { data } = await useFetch('/api/admin/laporan', { key: 'admin-laporan' })
if (!data.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data laporan tidak tersedia' })
}
const { musim: NAMA_MUSIM, total: DAMPAK, bulanan: LAPORAN_BULANAN, spesies: LAPORAN_SPESIES, komposisi: KOMPOSISI } = data.value

const kgTertinggi = Math.max(...LAPORAN_BULANAN.map((b) => b.kg))

// Titik contoh untuk pratinjau peta sebaran pada laporan.
const TITIK_PRATINJAU = [
  { x: 24, y: 40, warna: '#4cc38a' },
  { x: 50, y: 30, warna: '#E6B422' },
  { x: 68, y: 55, warna: '#2D8FE0' },
  { x: 40, y: 62, warna: '#7B4BD1' },
  { x: 80, y: 38, warna: '#D14B3C' },
]

/** Unduh ringkasan laporan sebagai CSV, berjalan penuh di sisi klien. */
function unduhCsv() {
  const baris = [
    ['Laporan Dampak LigaLestari', NAMA_MUSIM],
    [],
    ['Total sampah terkelola (kg)', DAMPAK.sampahKg],
    ['Total pohon ditanam', DAMPAK.pohon],
    ['Total CO2 diserap (kg/tahun)', DAMPAK.co2Kg],
    [],
    ['Jenis pohon', 'Jumlah', 'CO2 (kg/tahun)'],
    ...LAPORAN_SPESIES.map((s) => [s.nama, s.jumlah, s.co2]),
    [],
    ['Kategori sampah', 'Kg terkumpul', 'Persen', 'Tarif (poin/kg)'],
    ...KOMPOSISI.map((k) => [k.label, k.kg, `${k.persen}%`, k.tarif]),
  ]
  const csv = baris.map((b) => b.join(';')).join('\n')
  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'laporan-dampak-ligalestari.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <DasborHeader variant="gelap" kicker="Adiwiyata" judul="Laporan Dampak" :sub="`${NAMA_MUSIM} · per 28 Jun`" />

    <div class="px-4 lg:px-0">
      <div class="mt-3.5 grid grid-cols-3 gap-2.25">
        <StatCard label="kg sampah" :nilai="DAMPAK.sampahKg" tengah />
        <StatCard label="pohon" :nilai="DAMPAK.pohon" tengah aksen="hijau" />
        <StatCard label="kg CO₂" :nilai="DAMPAK.co2Kg" tengah aksen="hijau" />
      </div>

      <div class="mt-2.5 grid gap-2.5 lg:grid-cols-2">
        <!-- Grafik batang bulanan -->
        <section class="rounded-[18px] border border-garis bg-surface p-4" aria-label="Sampah terkelola per bulan">
          <h2 class="mb-3.5 font-display text-sm font-bold">Sampah terkelola per bulan (kg)</h2>
          <div class="flex h-32 items-end justify-between gap-2.5">
            <div v-for="b in LAPORAN_BULANAN" :key="b.bulan" class="flex h-full flex-1 flex-col items-center justify-end">
              <div
                class="w-full rounded-t-[7px] bg-[linear-gradient(180deg,#4cc38a,#0e6b46)]"
                :style="{ height: `${Math.round((b.kg / kgTertinggi) * 100)}%` }"
                role="img"
                :aria-label="`${b.bulan}: ${b.kg} kg`"
              />
              <div class="mt-1.75 text-[0.625rem] font-bold text-teks-samar">{{ b.bulan }}</div>
            </div>
          </div>
        </section>

        <!-- Sebaran jenis pohon -->
        <section class="rounded-[18px] border border-garis bg-surface p-4" aria-label="Sebaran jenis pohon dan CO₂">
          <h2 class="mb-3.5 font-display text-sm font-bold">Sebaran jenis pohon &amp; CO₂</h2>
          <div v-for="(s, i) in LAPORAN_SPESIES" :key="s.nama" :class="i > 0 && 'mt-3'">
            <div class="mb-1.25 flex items-baseline justify-between">
              <span class="text-[0.78125rem] font-bold">{{ s.nama }}</span>
              <span class="text-[0.6875rem] font-semibold text-teks-samar">{{ s.jumlah }} pohon · {{ formatAngka(s.co2) }} kg CO₂</span>
            </div>
            <div
              class="h-2.25 overflow-hidden rounded-full bg-surface-3"
              role="progressbar"
              :aria-valuenow="s.persen"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-label="`${s.nama}: ${s.persen}% dari total serapan`"
            >
              <div class="h-full rounded-full" :style="{ width: `${s.persen}%`, background: s.warna }" />
            </div>
          </div>
        </section>
      </div>

      <!-- Komposisi kategori sampah -->
      <section class="mt-2.5 rounded-[18px] border border-garis bg-surface p-4" aria-label="Komposisi kategori sampah">
        <div class="mb-3.5 flex items-baseline justify-between">
          <h2 class="font-display text-sm font-bold">Komposisi kategori sampah</h2>
          <span class="text-[0.6875rem] font-semibold text-teks-samar tabular-nums">{{ formatAngka(DAMPAK.sampahKg) }} kg terpilah</span>
        </div>
        <div v-for="(k, i) in KOMPOSISI" :key="k.kategori" :class="i > 0 && 'mt-3'">
          <div class="mb-1.25 flex items-baseline justify-between">
            <span class="text-[0.78125rem] font-bold">{{ k.label }} <span class="font-semibold text-teks-samar">· {{ k.tarif }} poin/kg</span></span>
            <span class="text-[0.6875rem] font-semibold text-teks-samar tabular-nums">{{ formatAngka(k.kg) }} kg · {{ k.persen }}%</span>
          </div>
          <div
            class="h-2.25 overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            :aria-valuenow="k.persen"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="`${k.label}: ${k.persen}% dari total kg`"
          >
            <div class="h-full rounded-full" :style="{ width: `${k.persen}%`, background: k.warna }" />
          </div>
        </div>
      </section>

      <!-- Pratinjau peta sebaran -->
      <div class="relative mt-2.5 h-35 overflow-hidden rounded-2xl border border-garis bg-[repeating-linear-gradient(135deg,#E7EFE6_0_2px,#EEF4ED_2px_20px),radial-gradient(120%_120%_at_40%_30%,#DCEAD8,#E2EBDE)]">
        <NuxtLink to="/peta" class="absolute top-2.5 left-2.5 rounded-md bg-white/70 px-1.75 py-0.75 font-display text-[0.5625rem] font-semibold tracking-[0.06em] text-[#7A8A78] hover:bg-surface">
          PETA SEBARAN · 41 TITIK · LIHAT SELENGKAPNYA
        </NuxtLink>
        <span
          v-for="(t, i) in TITIK_PRATINJAU"
          :key="i"
          class="absolute h-3.5 w-3.5 -rotate-45 rounded-[50%_50%_50%_0] border-2 border-white"
          :style="{ left: `${t.x}%`, top: `${t.y}%`, background: t.warna }"
          aria-hidden="true"
        />
      </div>

      <!-- Ekspor -->
      <div class="mt-3 flex gap-2.5">
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-[13px] bg-hijau p-3.25 text-[0.8125rem] font-bold text-white transition-colors hover:bg-hijau-pekat"
          @click="print()"
        >
          <Icon name="lucide:printer" size="17" class="text-lime" aria-hidden="true" />
          Cetak / PDF
        </button>
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-[13px] border border-garis bg-surface p-3.25 text-[0.8125rem] font-bold text-hijau-teks hover:bg-mint/40"
          @click="unduhCsv"
        >
          <Icon name="lucide:download" size="17" aria-hidden="true" />
          Unduh CSV
        </button>
      </div>
    </div>
  </div>
</template>
