<script setup lang="ts">
useSeoMeta({
  title: 'Metodologi Dampak',
  description:
    'Transparansi perhitungan LigaLestari: rumus estimasi serapan CO₂ beserta tabel acuan per jenis pohon dan rujukan yang dipakai.',
})

const { data } = await useFetch('/api/metodologi', { key: 'metodologi' })
const JENIS_POHON = computed(() => data.value?.jenisPohon ?? [])
const SUMBER_METODOLOGI = computed(() => data.value?.sumber ?? [])

// Nilai serapan terbesar, dihitung dari data supaya tag tidak salah sasaran
// saat tabel acuan berubah.
const serapanTertinggi = computed(() =>
  JENIS_POHON.value.length ? Math.max(...JENIS_POHON.value.map((p) => p.serapan)) : 0,
)
</script>

<template>
  <div>
    <!-- Pembuka halaman -->
    <header class="px-5 pt-7.5 lg:px-10 lg:pt-11.5">
      <div v-anim class="mx-auto max-w-190">
        <p class="text-caption font-semibold tracking-[0.14em] text-hijau-teks uppercase">Transparansi Perhitungan</p>
        <h1 class="mt-2.5 max-w-170 text-h1 font-bold tracking-[-0.02em]">Cara kami menghitung dampak</h1>
        <p class="mt-3.5 max-w-140 text-body text-teks">
          Poin Hijau dan estimasi CO₂ di LigaLestari bukan angka ajaib. Halaman ini menjelaskan rumus
          dan rujukan yang kami pakai, supaya hasilnya bisa diperiksa siapa saja.
        </p>
      </div>
    </header>

    <!-- Rumus inti -->
    <section class="px-5 pt-9 lg:px-10 lg:pt-12">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim kicker="Rumus Inti" judul="Estimasi serapan CO₂" />

        <div
          v-anim="80"
          class="garis-lapangan mt-6 overflow-hidden rounded-[20px] border border-white/10 bg-tinta px-5.5 py-6.5 lg:px-9 lg:py-8.5"
        >
          <div class="flex flex-wrap items-center gap-4 lg:gap-6.5">
            <div class="text-center">
              <div class="font-display text-h1 leading-none font-bold text-lime">CO₂</div>
              <div class="mt-1.5 text-caption text-white/70">estimasi (kg/tahun)</div>
            </div>
            <div class="flex items-center gap-4 lg:gap-6.5">
              <span class="font-display text-h2 font-bold text-white/50" aria-hidden="true">=</span>
              <span class="font-display text-h3 leading-[1.2] font-bold text-white">jumlah<br />pohon</span>
            </div>
            <div class="flex items-center gap-4 lg:gap-6.5">
              <span class="font-display text-h2 font-bold text-white/50" aria-hidden="true">×</span>
              <span class="font-display text-h3 leading-[1.2] font-bold text-white">rate serapan<br />per jenis</span>
            </div>
          </div>
          <p class="mt-5.5 border-t border-white/10 pt-4.5 text-small text-white/75">
            Total dampak sebuah kelas adalah penjumlahan estimasi dari setiap jenis pohon yang
            ditanam. Misal 3 trembesi + 5 angsana: (3 × 28.488,39) + (5 × 11,1) = 85.520,67;
            dibulatkan menjadi ≈ 85.520 kg CO₂ per tahun.
          </p>
        </div>
      </div>
    </section>

    <!-- Tabel acuan -->
    <section class="px-5 pt-10 lg:px-10 lg:pt-14">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim kicker="Tabel Acuan" judul="Rate serapan CO₂ per jenis pohon" />
        <p v-anim class="mt-2.5 mb-5 max-w-140 text-small text-teks-redup">
          Nilai kg CO₂ per pohon per tahun yang dipakai mesin perhitungan LigaLestari.
        </p>

        <!-- Tabel (layar sedang ke atas) -->
        <div v-anim="80" class="hidden overflow-hidden rounded-[18px] border border-garis bg-surface md:block">
          <table class="w-full border-collapse text-left">
            <thead class="bg-surface-3">
              <tr>
                <th scope="col" class="px-4.5 py-3 text-caption font-semibold tracking-[0.08em] text-teks-redup uppercase">
                  Jenis Pohon
                </th>
                <th scope="col" class="px-4.5 py-3 text-caption font-semibold tracking-[0.08em] text-teks-redup uppercase">
                  Nama Latin
                </th>
                <th scope="col" class="px-4.5 py-3 text-right text-caption font-semibold tracking-[0.08em] text-teks-redup uppercase">
                  Serapan CO₂ <span class="font-normal normal-case">(kg/th)</span>
                </th>
                <th scope="col" class="px-4.5 py-3 text-caption font-semibold tracking-[0.08em] text-teks-redup uppercase">
                  Sumber
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pohon in JENIS_POHON" :key="pohon.nama" class="border-t border-krem hover:bg-surface-2">
                <td class="px-4.5 py-3.75">
                  <span class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span class="text-body font-semibold">{{ pohon.nama }}</span>
                    <span
                      v-if="pohon.serapan === serapanTertinggi"
                      class="rounded-md bg-sorot px-2 py-0.5 text-caption font-semibold text-emas-teks"
                    >
                      Serapan tertinggi
                    </span>
                  </span>
                </td>
                <td class="px-4.5 py-3.75 text-small text-teks-redup italic">{{ pohon.latin }}</td>
                <td class="px-4.5 py-3.75 text-right font-display text-body font-bold text-hijau-teks tabular-nums">
                  {{ formatAngka(pohon.serapan) }}
                </td>
                <td class="px-4.5 py-3.75 text-caption text-teks-samar">{{ pohon.sumber }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Kartu (layar kecil) -->
        <div class="flex flex-col gap-3 md:hidden">
          <div v-for="pohon in JENIS_POHON" :key="pohon.nama" v-anim class="rounded-xl border border-garis bg-surface px-4.5 py-4">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span class="text-body font-semibold">{{ pohon.nama }}</span>
              <span
                v-if="pohon.serapan === serapanTertinggi"
                class="rounded-md bg-sorot px-2 py-0.5 text-caption font-semibold text-emas-teks"
              >
                Serapan tertinggi
              </span>
            </div>
            <div class="mt-0.5 mb-3 text-small text-teks-redup italic">{{ pohon.latin }}</div>
            <div class="flex items-end justify-between gap-2.5">
              <div>
                <div class="font-display text-h3 font-bold text-hijau-teks tabular-nums">{{ formatAngka(pohon.serapan) }}</div>
                <div class="text-caption font-medium text-teks-samar">kg CO₂ / pohon / tahun</div>
              </div>
              <div class="max-w-[46%] text-right text-caption text-teks-samar">{{ pohon.sumber }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Catatan & sumber -->
    <section class="mt-12 bg-hijau-muda px-5 py-12 lg:mt-16 lg:px-10 lg:py-16">
      <div v-anim class="mx-auto grid max-w-190 gap-4 md:grid-cols-2">
        <div class="rounded-[18px] border border-garis-hijau bg-surface px-6 py-5.5">
          <div class="mb-3 flex items-center gap-2">
            <Icon name="lucide:triangle-alert" size="18" class="shrink-0 text-hijau-teks" aria-hidden="true" />
            <h2 class="text-h3 font-semibold">Angka bersifat estimasi</h2>
          </div>
          <p class="text-small text-teks">
            Nilai serapan CO₂ adalah <strong>estimasi</strong> dan dapat bervariasi menurut usia
            pohon, kondisi tanah, iklim, serta metode pengukuran. LigaLestari memakai angka acuan agar
            perbandingan antar-kelas tetap adil dan konsisten, bukan klaim pengukuran karbon
            presisi.
          </p>
        </div>

        <div class="rounded-[18px] border border-garis-hijau bg-surface px-6 py-5.5">
          <div class="mb-3 flex items-center gap-2">
            <Icon name="lucide:book-open" size="18" class="shrink-0 text-hijau-teks" aria-hidden="true" />
            <h2 class="text-h3 font-semibold">Daftar sumber</h2>
          </div>
          <ol class="flex flex-col gap-2.5">
            <li
              v-for="(sumber, i) in SUMBER_METODOLOGI"
              :key="i"
              class="flex gap-2.25 text-small text-teks"
            >
              <span class="shrink-0 font-semibold text-hijau-teks tabular-nums">{{ i + 1 }}.</span>
              <span>{{ sumber }}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  </div>
</template>
