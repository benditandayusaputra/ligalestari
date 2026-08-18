<script setup lang="ts">
import type { PlatformPembeda, StatusKriteria } from '#shared/types'
import { KLAIM, KRITERIA_PEMBEDA, LANSKAP, TERBANYAK_PESAING, TONGGAK, jumlahAda } from '#shared/data/pembeda'

useSeoMeta({
  title: 'Mengapa Berbeda',
  description:
    'Posisi LigaLestari di antara sembilan aplikasi lingkungan yang sudah ada: matriks perbandingan enam kriteria, enam klaim keunikan yang bisa dibuktikan langsung di situs, dan rencana pengembangan lintas musim.',
})

/** Tampilan tiap status matriks, ikon, warna, dan namanya untuk pembaca layar. */
const GAYA_STATUS: Record<StatusKriteria, { ikon: string; label: string; warna: string }> = {
  ada: { ikon: 'lucide:check', label: 'Ada', warna: 'text-hijau-teks' },
  parsial: { ikon: 'lucide:minus', label: 'Sebagian', warna: 'text-emas-teks' },
  tidak: { ikon: 'lucide:x', label: 'Tidak ada', warna: 'text-teks-samar' },
}

/**
 * Isi kartu seluler: hanya kriteria yang terpenuhi (penuh/sebagian) atau
 * yang catatannya menjelaskan kenapa tidak terpenuhi. Platform yang polos
 * enam-enamnya jadi ringkas, nuansanya tetap tersampaikan.
 */
function sorotan(platform: PlatformPembeda) {
  return platform.sel
    .map((sel, i) => ({ sel, kriteria: KRITERIA_PEMBEDA[i]! }))
    .filter(({ sel }) => sel.status !== 'tidak' || sel.catatan)
}
</script>

<template>
  <div>
    <!-- Pembuka halaman -->
    <header class="px-5 pt-7.5 lg:px-10 lg:pt-11.5">
      <div v-anim class="mx-auto max-w-190">
        <p class="text-caption font-semibold tracking-[0.14em] text-hijau-teks uppercase">Originalitas</p>
        <h1 class="mt-2.5 max-w-170 text-h1 font-bold tracking-[-0.02em]">Mengapa Berbeda</h1>
        <p class="mt-3.5 max-w-150 text-body text-teks">
          Aplikasi lingkungan di Indonesia sudah banyak. Yang belum ada adalah yang
          memperlakukan aksi hijau sebagai <strong>kompetisi bermusim antar-kelas</strong>.
          Halaman ini menaruh LigaLestari berdampingan dengan sembilan platform yang sudah
          berjalan, lengkap dengan tautan bukti supaya setiap klaimnya bisa kamu periksa sendiri.
        </p>
      </div>
    </header>

    <!-- Inti pembeda: liga, bukan gamifikasi -->
    <section class="px-5 pt-9 lg:px-10 lg:pt-12" aria-labelledby="judul-inti">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-inti" kicker="Inti Pembeda" judul="Liga, bukan gamifikasi" />
        <p v-anim class="mt-3 max-w-160 text-body text-teks">
          Gamifikasi menempelkan poin pada aktivitas yang sudah ada. Liga menghadirkan
          struktur kompetisi utuh: musim, jadwal, klasemen, rivalitas, rekor, dan sejarah.
          Perbedaannya terasa pada apa yang sebenarnya dikelola sistemnya.
        </p>

        <div v-anim="80" class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-[18px] border border-garis bg-surface px-6 py-5.5">
            <h3 class="text-caption font-semibold tracking-[0.12em] text-teks-samar uppercase">Platform lain</h3>
            <p class="mt-2.5 text-h3 font-semibold">Mengelola sampah atau pohon</p>
            <p class="mt-2 text-small text-teks">
              Alur intinya transaksi: sampah ditimbang lalu ditukar uang, atau donasi dikumpulkan
              lalu pohon ditanam pihak lain. Selesai per transaksi, tanpa babak berikutnya.
            </p>
          </div>

          <div class="garis-lapangan overflow-hidden rounded-[18px] border border-white/10 bg-tinta px-6 py-5.5">
            <h3 class="text-caption font-semibold tracking-[0.12em] text-lime uppercase">LigaLestari</h3>
            <p class="mt-2.5 text-h3 font-semibold text-white">Mengelola kompetisinya</p>
            <p class="mt-2 text-small text-white/75">
              Sampah dan pohon adalah cara mencetak poin; yang dijalankan sistem adalah musimnya:
              klasemen bergerak tiap pekan, ada lawan duel, ada gelar yang diperebutkan sampai akhir.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Enam klaim + buktinya -->
    <section class="px-5 pt-10 lg:px-10 lg:pt-14" aria-labelledby="judul-klaim">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-klaim" kicker="Klaim & Bukti" judul="Enam hal yang bisa kamu periksa sendiri" />
        <p v-anim class="mt-2.5 mb-6 max-w-150 text-small text-teks-redup">
          Setiap klaim di bawah punya halaman yang membuktikannya di situs ini juga, bukan
          janji yang berhenti di paragraf.
        </p>

        <ol class="flex flex-col gap-3">
          <li
            v-for="(k, i) in KLAIM"
            :key="k.klaim"
            v-anim="(i % 3) * 60"
            class="flex gap-4 rounded-[18px] border border-garis bg-surface px-5 py-4.5"
          >
            <span class="font-display text-h2 leading-none font-bold text-hijau-teks tabular-nums" aria-hidden="true">
              {{ i + 1 }}
            </span>
            <div class="min-w-0">
              <h3 class="text-body font-bold">{{ k.klaim }}</h3>
              <p class="mt-1 text-small text-teks">{{ k.penjelasan }}</p>
              <p class="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-krem pt-2.5 text-caption text-teks-samar">
                <span class="font-semibold tracking-[0.08em] text-teks-redup uppercase">Bukti</span>
                <NuxtLink
                  v-if="k.ke"
                  :to="k.ke"
                  class="inline-flex items-center gap-1 font-semibold text-hijau-teks hover:underline"
                >
                  {{ k.bukti }}
                  <Icon name="lucide:arrow-right" size="13" aria-hidden="true" />
                </NuxtLink>
                <span v-else>{{ k.bukti }}</span>
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Matriks lanskap kompetitor -->
    <section class="px-5 pt-10 lg:px-10 lg:pt-14" aria-labelledby="judul-lanskap">
      <div class="mx-auto max-w-275">
        <div class="mx-auto max-w-190 lg:mx-0 lg:max-w-none">
          <SectionHeading v-anim id="judul-lanskap" kicker="Peta Lanskap" judul="Sembilan platform, enam kriteria" />
          <p v-anim class="mt-2.5 max-w-160 text-small text-teks-redup">
            Lima layanan bank sampah Indonesia, satu sistem pelaporan pemerintah, satu kampanye
            penghijauan, dan dua aplikasi lingkungan global; semuanya diperiksa terhadap
            enam kriteria yang sama.
          </p>

          <!-- Legenda simbol -->
          <ul v-anim="60" class="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <li v-for="(gaya, status) in GAYA_STATUS" :key="status" class="flex items-center gap-1.5 text-caption text-teks-redup">
              <Icon :name="gaya.ikon" size="15" :class="gaya.warna" aria-hidden="true" />
              {{ gaya.label }}
            </li>
          </ul>
        </div>

        <!-- Tabel (layar besar) -->
        <div v-anim="80" class="mt-5 hidden overflow-x-auto rounded-[18px] border border-garis bg-surface lg:block">
          <table class="w-full border-collapse text-left">
            <caption class="sr-only">
              Perbandingan LigaLestari dengan sembilan platform lingkungan lain terhadap enam kriteria.
            </caption>
            <thead class="bg-surface-3">
              <tr>
                <th scope="col" class="px-4.5 py-3 text-caption font-semibold tracking-[0.08em] text-teks-redup uppercase">
                  Platform
                </th>
                <th
                  v-for="kriteria in KRITERIA_PEMBEDA"
                  :key="kriteria"
                  scope="col"
                  class="px-3 py-3 text-caption font-semibold tracking-[0.08em] text-teks-redup uppercase"
                >
                  {{ kriteria }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in LANSKAP"
                :key="p.nama"
                class="border-t border-krem"
                :class="p.kami ? 'bg-hijau-pucat' : 'hover:bg-surface-2'"
              >
                <th scope="row" class="px-4.5 py-3.5 text-left align-top font-normal">
                  <span class="block text-body font-semibold" :class="p.kami && 'text-hijau-teks'">{{ p.nama }}</span>
                  <span class="mt-0.5 block max-w-45 text-caption text-teks-samar">{{ p.fokus }}</span>
                </th>
                <td v-for="(sel, i) in p.sel" :key="i" class="px-3 py-3.5 align-top">
                  <Icon :name="GAYA_STATUS[sel.status].ikon" size="17" :class="GAYA_STATUS[sel.status].warna" aria-hidden="true" />
                  <span class="sr-only">{{ GAYA_STATUS[sel.status].label }}</span>
                  <span v-if="sel.catatan" class="mt-0.5 block max-w-35 text-caption text-teks-samar">{{ sel.catatan }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Kartu (layar kecil & sedang) -->
        <div class="mx-auto mt-5 flex max-w-190 flex-col gap-3 lg:hidden">
          <div
            v-for="p in LANSKAP"
            :key="p.nama"
            v-anim
            class="rounded-xl border px-4.5 py-4"
            :class="p.kami ? 'border-mint-garis bg-hijau-pucat' : 'border-garis bg-surface'"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="text-body font-semibold" :class="p.kami && 'text-hijau-teks'">{{ p.nama }}</h3>
                <p class="mt-0.5 text-caption text-teks-samar">{{ p.fokus }}</p>
              </div>
              <p class="shrink-0 text-right">
                <span class="font-display text-h3 font-bold tabular-nums" :class="p.kami ? 'text-hijau-teks' : 'text-teks-samar'">
                  {{ jumlahAda(p) }}/{{ KRITERIA_PEMBEDA.length }}
                </span>
                <span class="block text-caption text-teks-samar">kriteria</span>
              </p>
            </div>

            <ul v-if="sorotan(p).length" class="mt-2.5 flex flex-col gap-1.5 border-t border-krem pt-2.5">
              <li v-for="s in sorotan(p)" :key="s.kriteria" class="flex gap-2 text-small text-teks">
                <Icon
                  :name="GAYA_STATUS[s.sel.status].ikon"
                  size="16"
                  :class="['mt-0.75 shrink-0', GAYA_STATUS[s.sel.status].warna]"
                  aria-hidden="true"
                />
                <span>
                  <span class="sr-only">{{ GAYA_STATUS[s.sel.status].label }}: </span>{{ s.kriteria }}<span
                    v-if="s.sel.catatan"
                    class="text-teks-samar"
                  >
                    ({{ s.sel.catatan }})</span>
                </span>
              </li>
            </ul>
            <p v-else class="mt-2.5 border-t border-krem pt-2.5 text-small text-teks-samar">
              Tidak memenuhi satu pun dari enam kriteria.
            </p>
          </div>
        </div>

        <!-- Kesimpulan matriks -->
        <div v-anim class="mx-auto mt-4 max-w-190 rounded-[18px] border border-garis-hijau bg-hijau-muda px-6 py-5.5 lg:mx-0 lg:max-w-none">
          <p class="max-w-170 text-body text-teks">
            <strong class="text-teks-kuat">
              Tidak ada satu pun pembanding yang memenuhi lebih dari
              {{ TERBANYAK_PESAING }} dari {{ KRITERIA_PEMBEDA.length }} kriteria secara penuh.
            </strong>
            Masing-masing kuat di bidangnya, dan memang tidak dirancang untuk menjalankan liga
            sekolah. Celah itulah yang diisi LigaLestari.
          </p>
        </div>
      </div>
    </section>

    <!-- Bukan pesaing, calon mitra -->
    <section class="px-5 pt-10 lg:px-10 lg:pt-14" aria-labelledby="judul-mitra">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-mitra" kicker="Posisi" judul="Bukan pesaing, calon mitra" />
        <p v-anim class="mt-3 max-w-160 text-body text-teks">
          Setiap kilogram sampah terpilah yang tercatat di sini adalah calon transaksi bagi bank
          sampah: Smash.id dan Rekosistem lebih masuk akal sebagai <strong>penyerap</strong>
          setoran yang liga ini hasilkan ketimbang sebagai lawan. Begitu juga setiap titik tanam
          berkoordinat: satu baris data siap pakai untuk dashboard karbon tingkat dinas.
          LigaLestari mengisi lapisan yang belum ada di atas mereka, yaitu yang membuat siswa
          mau bergerak setiap pekan.
        </p>
      </div>
    </section>

    <!-- Rencana pengembangan -->
    <section class="mt-12 bg-hijau-muda px-5 py-12 lg:mt-16 lg:px-10 lg:py-16" aria-labelledby="judul-tonggak">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-tonggak" kicker="Rencana" judul="Naik tingkat tanpa ganti mekanik" />
        <p v-anim class="mt-3 max-w-160 text-body text-teks">
          Struktur "kelas = tim, sekolah = liga" berlaku sama ketika satuannya diganti:
          sekolah = tim, kota = liga. Karena itu tiap tahap di bawah bisa ditempuh tanpa
          merombak aturan mainnya.
        </p>

        <ol class="mt-6 flex flex-col gap-3">
          <li
            v-for="(t, i) in TONGGAK"
            :key="t.judul"
            v-anim="(i % 3) * 60"
            class="rounded-[18px] border border-garis-hijau bg-surface px-5 py-4.5 sm:flex sm:gap-5"
          >
            <span class="block shrink-0 pt-0.5 text-caption font-semibold tracking-[0.12em] text-hijau-teks uppercase sm:w-30">
              {{ t.label }}
            </span>
            <span class="mt-1.5 block sm:mt-0">
              <span class="block text-body font-bold">{{ t.judul }}</span>
              <span class="mt-1 block text-small text-teks">{{ t.teks }}</span>
            </span>
          </li>
        </ol>

        <p v-anim class="mt-6 text-small text-teks-redup">
          Ingin melihat aturan mainnya lebih dulu?
          <NuxtLink to="/aturan" class="font-semibold text-hijau-teks hover:underline">Buka Aturan Liga</NuxtLink>
          atau lihat
          <NuxtLink to="/jadwal" class="font-semibold text-hijau-teks hover:underline">Jadwal &amp; Hasil</NuxtLink>
          musim yang sedang berjalan.
        </p>
      </div>
    </section>
  </div>
</template>
