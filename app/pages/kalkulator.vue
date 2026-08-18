<script setup lang="ts">
import type { InputKalkulator } from '#shared/types'
import { RATE } from '#shared/data/admin'
import { BATAS, INPUT_BAWAAN, hitungProyeksi } from '#shared/data/kalkulator'

useSeoMeta({
  title: 'Kalkulator Dampak',
  description:
    'Hitung proyeksi satu musim LigaLestari untuk sekolahmu: berapa kilogram sampah terpilah, berapa Poin Hijau, dan berapa estimasi serapan CO₂ dari pohon yang ditanam.',
})

// Tabel acuan diambil dari API yang sama dengan halaman Metodologi, jadi
// pilihan jenis pohon selalu ikut isi tabel acuan yang berlaku.
const { data } = await useFetch('/api/metodologi', { key: 'metodologi' })
const jenisPohon = computed(() => data.value?.jenisPohon ?? [])

const input = reactive<InputKalkulator>({ ...INPUT_BAWAAN })

/** Rate serapan jenis terpilih; jatuh ke jenis pertama bila tak ditemukan. */
const serapan = computed(() => {
  const pilihan = jenisPohon.value.find((p) => p.nama === input.jenisPohon)
  return (pilihan ?? jenisPohon.value[0])?.serapan ?? 0
})

const hasil = computed(() => hitungProyeksi(input, serapan.value))

/** Ringkasan satu kalimat, dibacakan pembaca layar saat isian berubah. */
const ringkasan = computed(
  () =>
    `Proyeksi ${hasil.value.pekan} pekan: ${formatAngka(hasil.value.sampahKg)} kilogram sampah terpilah, ` +
    `${formatAngka(hasil.value.pohon)} pohon, ${formatAngka(hasil.value.co2Kg)} kilogram CO2 per tahun, ` +
    `dan ${formatAngka(hasil.value.totalPoin)} Poin Hijau.`,
)

const KOLOM = [
  { id: 'kelas', label: 'Jumlah kelas peserta', satuan: 'kelas', batas: BATAS.kelas },
  { id: 'siswaPerKelas', label: 'Rata-rata siswa per kelas', satuan: 'siswa', batas: BATAS.siswaPerKelas },
  { id: 'kgPerSiswaPerPekan', label: 'Setoran per siswa tiap pekan', satuan: 'kg', batas: BATAS.kgPerSiswaPerPekan },
  { id: 'pohonPerKelas', label: 'Pohon ditanam per kelas semusim', satuan: 'pohon', batas: BATAS.pohonPerKelas },
] as const

function atur(id: (typeof KOLOM)[number]['id'], nilai: string) {
  input[id] = Number(nilai)
}

function setelUlang() {
  Object.assign(input, INPUT_BAWAAN)
}
</script>

<template>
  <div>
    <!-- Pembuka halaman -->
    <header class="px-5 pt-7.5 lg:px-10 lg:pt-11.5">
      <div v-anim class="mx-auto max-w-190">
        <p class="text-caption font-semibold tracking-[0.14em] text-hijau-teks uppercase">Proyeksi Satu Musim</p>
        <h1 class="mt-2.5 max-w-170 text-h1 font-bold tracking-[-0.02em]">Kalkulator Dampak</h1>
        <p class="mt-3.5 max-w-150 text-body text-teks">
          Ubah angkanya sesuai sekolahmu untuk melihat berapa besar dampak satu musim LigaLestari.
          Rumus dan tarif yang dipakai persis sama dengan yang menjalankan liga sungguhan, jadi
          hasilnya bisa ditelusuri sampai ke sumbernya.
        </p>
      </div>
    </header>

    <!-- Formulir dan hasil -->
    <section class="px-5 pt-9 lg:px-10 lg:pt-12" aria-labelledby="judul-hitung">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-hitung" kicker="Asumsi Sekolahmu" judul="Isi lalu lihat hasilnya" />

        <div class="mt-6 grid items-start gap-4 lg:grid-cols-[1fr_1.05fr]">
          <!-- Isian -->
          <form v-anim class="rounded-[18px] border border-garis bg-surface px-5 py-5 lg:px-6" @submit.prevent>
            <div class="flex flex-col gap-4">
              <div v-for="k in KOLOM" :key="k.id">
                <label :for="`kal-${k.id}`" class="block text-small font-semibold">{{ k.label }}</label>
                <div class="mt-1.5 flex items-center gap-2.5">
                  <input
                    :id="`kal-${k.id}`"
                    type="number"
                    inputmode="decimal"
                    :min="k.batas.min"
                    :max="k.batas.max"
                    :step="'langkah' in k.batas ? k.batas.langkah : 1"
                    :value="input[k.id]"
                    class="w-full rounded-xl border border-garis-tegas bg-surface-2 px-3.5 py-2.5 font-display text-body font-bold tabular-nums focus:border-hijau focus:outline-none"
                    @input="atur(k.id, ($event.target as HTMLInputElement).value)"
                  >
                  <span class="w-14 shrink-0 text-small text-teks-samar">{{ k.satuan }}</span>
                </div>
              </div>

              <div>
                <label for="kal-jenis" class="block text-small font-semibold">Jenis pohon yang ditanam</label>
                <select
                  id="kal-jenis"
                  v-model="input.jenisPohon"
                  class="mt-1.5 w-full rounded-xl border border-garis-tegas bg-surface-2 px-3.5 py-2.5 text-body font-semibold focus:border-hijau focus:outline-none"
                >
                  <option v-for="p in jenisPohon" :key="p.nama" :value="p.nama">
                    {{ p.nama }}, {{ formatAngka(p.serapan) }} kg CO₂/pohon/tahun
                  </option>
                </select>
              </div>
            </div>

            <button
              type="button"
              class="mt-5 inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-small font-semibold text-hijau-teks hover:bg-mint"
              @click="setelUlang"
            >
              <Icon name="lucide:rotate-ccw" size="15" aria-hidden="true" />
              Kembalikan ke angka musim berjalan
            </button>
          </form>

          <!-- Hasil -->
          <div v-anim="80" class="garis-lapangan overflow-hidden rounded-[20px] border border-white/10 bg-tinta px-5.5 py-6 lg:px-7">
            <p class="text-caption font-semibold tracking-[0.12em] text-lime uppercase">
              Proyeksi {{ hasil.pekan }} pekan
            </p>
            <p class="sr-only" aria-live="polite">{{ ringkasan }}</p>

            <dl class="mt-4 grid grid-cols-2 gap-x-5 gap-y-5">
              <div>
                <dt class="text-caption text-white/70">Sampah terkelola</dt>
                <dd class="font-display text-h1 leading-none font-bold text-white tabular-nums">
                  {{ formatAngka(hasil.sampahKg) }}<span class="ml-1 text-h3 text-white/60">kg</span>
                </dd>
              </div>
              <div>
                <dt class="text-caption text-white/70">Pohon ditanam</dt>
                <dd class="font-display text-h1 leading-none font-bold text-white tabular-nums">
                  {{ formatAngka(hasil.pohon) }}
                </dd>
              </div>
              <div>
                <dt class="text-caption text-white/70">Estimasi serapan CO₂</dt>
                <dd class="font-display text-h1 leading-none font-bold text-lime tabular-nums">
                  {{ formatAngka(hasil.co2Kg) }}<span class="ml-1 text-h3 text-white/60">kg/th</span>
                </dd>
              </div>
              <div>
                <dt class="text-caption text-white/70">Total Poin Hijau</dt>
                <dd class="font-display text-h1 leading-none font-bold text-lime tabular-nums">
                  {{ formatAngka(hasil.totalPoin) }}
                </dd>
              </div>
            </dl>

            <ul class="mt-5.5 flex flex-col gap-2 border-t border-white/10 pt-4.5 text-small text-white/75">
              <li class="flex justify-between gap-3">
                <span>Poin dari setoran sampah</span>
                <span class="font-display font-bold text-white tabular-nums">{{ formatAngka(hasil.poinSampah) }}</span>
              </li>
              <li class="flex justify-between gap-3">
                <span>Poin dari tanam pohon</span>
                <span class="font-display font-bold text-white tabular-nums">{{ formatAngka(hasil.poinPohon) }}</span>
              </li>
              <li class="flex justify-between gap-3">
                <span>Siswa yang terlibat</span>
                <span class="font-display font-bold text-white tabular-nums">{{ formatAngka(hasil.siswa) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Rincian komposisi -->
    <section class="px-5 pt-10 lg:px-10 lg:pt-14" aria-labelledby="judul-komposisi">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-komposisi" kicker="Rincian" judul="Sebaran setoran per kategori" />
        <p v-anim class="mt-2.5 mb-5 max-w-150 text-small text-teks-redup">
          Proyeksi memakai komposisi setoran musim berjalan, bukan tarif tertinggi. Tarif rata-rata
          tertimbangnya {{ formatIndeks(hasil.tarifRata) }} poin/kg.
        </p>

        <div v-anim="80" class="rounded-[18px] border border-garis bg-surface px-5 py-5 lg:px-6">
          <div
            class="lintasan flex"
            role="img"
            :aria-label="`Sebaran proyeksi setoran: ${hasil.komposisi.map((s) => `${s.label} ${formatAngka(s.kg)} kg`).join(', ')}`"
          >
            <div
              v-for="s in hasil.komposisi"
              :key="s.kategori"
              class="h-full first:rounded-l-[5px] last:rounded-r-[5px]"
              :style="{ width: `${s.persen}%`, background: s.warna }"
            />
          </div>

          <ul class="mt-4 flex flex-col gap-2.5">
            <li v-for="s in hasil.komposisi" :key="s.kategori" class="flex items-center gap-2.5 text-small">
              <span class="h-2.5 w-2.5 shrink-0 rounded-[3px]" :style="{ background: s.warna }" aria-hidden="true" />
              <span class="flex-1 font-semibold">{{ s.label }}</span>
              <span class="font-display font-bold tabular-nums">{{ formatAngka(s.kg) }} kg</span>
              <span class="w-16 text-right font-semibold text-teks-samar tabular-nums">{{ formatAngka(s.poin) }} poin</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Asumsi dan sumber -->
    <section class="mt-12 bg-hijau-muda px-5 py-12 lg:mt-16 lg:px-10 lg:py-16" aria-labelledby="judul-asumsi">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-asumsi" kicker="Yang Perlu Dibaca" judul="Asumsi di balik angka ini" />

        <div v-anim="80" class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-[18px] border border-garis-hijau bg-surface px-6 py-5.5">
            <h3 class="text-h3 font-semibold">Cara menghitungnya</h3>
            <ul class="mt-3 flex flex-col gap-2.5 text-small text-teks">
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks">Sampah</span>
                <span>jumlah siswa × setoran per pekan × {{ hasil.pekan }} pekan musim.</span>
              </li>
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks">Poin sampah</span>
                <span>
                  tiap kategori dihitung terpisah dengan tarifnya sendiri
                  ({{ formatIndeks(hasil.tarifRata) }} poin/kg rata-rata tertimbang), lalu dijumlahkan.
                </span>
              </li>
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks">Poin pohon</span>
                <span>{{ RATE.pohonPerBatang }} poin untuk tiap pohon yang lolos verifikasi.</span>
              </li>
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks">CO₂</span>
                <span>jumlah pohon × rate acuan jenisnya ({{ formatAngka(hasil.serapan) }} kg per pohon per tahun).</span>
              </li>
            </ul>
          </div>

          <div class="rounded-[18px] border border-garis-hijau bg-surface px-6 py-5.5">
            <div class="mb-3 flex items-center gap-2">
              <Icon name="lucide:triangle-alert" size="18" class="shrink-0 text-hijau-teks" aria-hidden="true" />
              <h3 class="text-h3 font-semibold">Ini proyeksi, bukan janji</h3>
            </div>
            <p class="text-small text-teks">
              Hasilnya bergantung penuh pada asumsi yang kamu isi dan mengandaikan seluruh setoran
              lolos verifikasi. Rate serapan CO₂ adalah estimasi acuan yang bervariasi menurut usia
              pohon, tanah, dan iklim; angka tertinggi di tabel berlaku pada kondisi ideal.
              Rincian rumus dan rujukannya ada di
              <NuxtLink to="/metodologi" class="font-semibold text-hijau-teks hover:underline">halaman Metodologi Dampak</NuxtLink>,
              sedangkan tarif tiap kategori dijelaskan di
              <NuxtLink to="/aturan" class="font-semibold text-hijau-teks hover:underline">Aturan Liga</NuxtLink>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
