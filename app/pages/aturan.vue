<script setup lang="ts">
import { RATE } from '#shared/data/admin'
import { DAFTAR_KATEGORI, KATEGORI_SAMPAH, RENTANG_TARIF } from '#shared/data/kategori-sampah'

useSeoMeta({
  title: 'Aturan Liga',
  description:
    'Aturan main LigaLestari: tarif poin 6 kategori sampah terpilah (8–20 poin/kg), formula Poin Hijau, Duel Pekan head-to-head, dan tiga jalur gelar musim.',
})

/** Langkah cara main liga, urut dari gabung sampai juara musim. */
const CARA_MAIN = [
  { judul: 'Gabung tim kelasmu', teks: 'Daftar dengan kode kelas dari wali kelas atau admin; satu kelas adalah satu tim liga.' },
  { judul: 'Pilah sampah jadi 6 kategori', teks: 'Pisahkan organik, kertas, plastik, kaca, logam, dan B3 ringan sebelum dibawa ke bank sampah sekolah.' },
  { judul: 'Setor & timbang di bank sampah', teks: 'Admin menimbang setoran per kategori; poin langsung dihitung dari berat × tarif kategori.' },
  { judul: 'Tanam pohon & unggah bukti', teks: `Setiap pohon yang lolos verifikasi bernilai ${RATE.pohonPerBatang} poin plus estimasi serapan CO₂ untuk timmu.` },
  { judul: 'Rebut puncak klasemen', teks: 'Poin seluruh anggota terakumulasi ke tim; tim teratas di akhir musim jadi juara liga.' },
]

/** Tarif tertinggi, dihitung dari data supaya tag tidak salah sasaran. */
const tarifTertinggi = Math.max(...DAFTAR_KATEGORI.map((k) => KATEGORI_SAMPAH[k].tarif))
</script>

<template>
  <div>
    <!-- Pembuka halaman -->
    <header class="px-5 pt-7.5 lg:px-10 lg:pt-11.5">
      <div v-anim class="mx-auto max-w-190">
        <p class="text-caption font-semibold tracking-[0.14em] text-hijau-teks uppercase">Buku Aturan Musim</p>
        <h1 class="mt-2.5 max-w-170 text-h1 font-bold tracking-[-0.02em]">Aturan Liga</h1>
        <p class="mt-3.5 max-w-140 text-body text-teks">
          Semua poin di LigaLestari lahir dari aksi nyata yang bisa ditimbang dan diverifikasi.
          Halaman ini merangkum cara main, tarif poin tiap kategori sampah, dan rumus perhitungannya.
        </p>
      </div>
    </header>

    <!-- Cara main -->
    <section class="px-5 pt-9 lg:px-10 lg:pt-12" aria-labelledby="judul-cara-main">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-cara-main" kicker="Cara Main" judul="Dari gabung kelas sampai juara musim" />
        <ol class="mt-6 flex flex-col gap-3">
          <li
            v-for="(langkah, i) in CARA_MAIN"
            :key="langkah.judul"
            v-anim="i * 60"
            class="flex gap-4 rounded-[18px] border border-garis bg-surface px-5 py-4.5"
          >
            <span class="font-display text-h2 leading-none font-bold text-hijau-teks tabular-nums" aria-hidden="true">{{ i + 1 }}</span>
            <div>
              <h3 class="text-body font-bold">{{ langkah.judul }}</h3>
              <p class="mt-1 text-small text-teks">{{ langkah.teks }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Tabel tarif 6 kategori -->
    <section class="px-5 pt-10 lg:px-10 lg:pt-14" aria-labelledby="judul-tarif">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-tarif" kicker="Tarif Poin" judul="Enam kategori sampah terpilah" />
        <p v-anim class="mt-2.5 mb-5 max-w-150 text-small text-teks-redup">
          Makin sulit sebuah kategori dipilah dan makin besar nilai lingkungannya, makin tinggi
          poin per kilogramnya ({{ RENTANG_TARIF.min }}–{{ RENTANG_TARIF.max }} poin/kg).
        </p>

        <!-- Tabel (layar sedang ke atas) -->
        <div v-anim="80" class="hidden overflow-hidden rounded-[18px] border border-garis bg-surface md:block">
          <table class="w-full border-collapse text-left">
            <thead class="bg-surface-3">
              <tr>
                <th scope="col" class="px-4.5 py-3 text-caption font-semibold tracking-[0.08em] text-teks-redup uppercase">Kategori</th>
                <th scope="col" class="px-4.5 py-3 text-right text-caption font-semibold tracking-[0.08em] text-teks-redup uppercase">
                  Tarif <span class="font-normal normal-case">(poin/kg)</span>
                </th>
                <th scope="col" class="px-4.5 py-3 text-caption font-semibold tracking-[0.08em] text-teks-redup uppercase">Alasan tarif</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="k in DAFTAR_KATEGORI" :key="k" class="border-t border-krem hover:bg-surface-2">
                <td class="px-4.5 py-3.75">
                  <span class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span class="text-body font-semibold">{{ KATEGORI_SAMPAH[k].label }}</span>
                    <span
                      v-if="KATEGORI_SAMPAH[k].tarif === tarifTertinggi"
                      class="rounded-md bg-sorot px-2 py-0.5 text-caption font-semibold text-emas-teks"
                    >
                      Tarif tertinggi
                    </span>
                  </span>
                  <span class="mt-0.5 block max-w-70 text-caption text-teks-samar">{{ KATEGORI_SAMPAH[k].deskripsi }}</span>
                </td>
                <td class="px-4.5 py-3.75 text-right font-display text-body font-bold text-hijau-teks tabular-nums">
                  {{ KATEGORI_SAMPAH[k].tarif }}
                </td>
                <td class="px-4.5 py-3.75 text-small text-teks">{{ KATEGORI_SAMPAH[k].alasan }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Kartu (layar kecil) -->
        <div class="flex flex-col gap-3 md:hidden">
          <div v-for="k in DAFTAR_KATEGORI" :key="k" v-anim class="rounded-xl border border-garis bg-surface px-4.5 py-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <span class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span class="text-body font-semibold">{{ KATEGORI_SAMPAH[k].label }}</span>
                  <span
                    v-if="KATEGORI_SAMPAH[k].tarif === tarifTertinggi"
                    class="rounded-md bg-sorot px-2 py-0.5 text-caption font-semibold text-emas-teks"
                  >
                    Tarif tertinggi
                  </span>
                </span>
                <p class="mt-0.5 text-caption text-teks-samar">{{ KATEGORI_SAMPAH[k].deskripsi }}</p>
              </div>
              <div class="shrink-0 text-right">
                <div class="font-display text-h3 font-bold text-hijau-teks tabular-nums">{{ KATEGORI_SAMPAH[k].tarif }}</div>
                <div class="text-caption font-medium text-teks-samar">poin/kg</div>
              </div>
            </div>
            <p class="mt-2.5 border-t border-krem pt-2.5 text-small text-teks">{{ KATEGORI_SAMPAH[k].alasan }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Formula poin -->
    <section class="px-5 pt-10 lg:px-10 lg:pt-14" aria-labelledby="judul-formula">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-formula" kicker="Formula Poin" judul="Cara Poin Hijau dihitung" />

        <div
          v-anim="80"
          class="garis-lapangan mt-6 overflow-hidden rounded-[20px] border border-white/10 bg-tinta px-5.5 py-6.5 lg:px-9 lg:py-8.5"
        >
          <div class="flex flex-wrap items-center gap-4 lg:gap-6.5">
            <div class="text-center">
              <div class="font-display text-h1 leading-none font-bold text-lime">Poin</div>
              <div class="mt-1.5 text-caption text-white/70">Hijau per setoran</div>
            </div>
            <div class="flex items-center gap-4 lg:gap-6.5">
              <span class="font-display text-h2 font-bold text-white/50" aria-hidden="true">=</span>
              <span class="font-display text-h3 leading-[1.2] font-bold text-white">berat<br />(kg)</span>
            </div>
            <div class="flex items-center gap-4 lg:gap-6.5">
              <span class="font-display text-h2 font-bold text-white/50" aria-hidden="true">×</span>
              <span class="font-display text-h3 leading-[1.2] font-bold text-white">tarif<br />kategori</span>
            </div>
          </div>
          <ul class="mt-5.5 flex flex-col gap-2 border-t border-white/10 pt-4.5 text-small text-white/75">
            <li>
              <strong class="text-white">Bonus event</strong>: saat event berlangsung, hasil rumus dikalikan
              pengali event (mis. Pekan Tanam Pohon 2×) sebelum masuk klasemen.
            </li>
            <li>
              <strong class="text-white">Tanam pohon</strong>: setiap pohon yang lolos verifikasi bernilai
              {{ RATE.pohonPerBatang }} poin, di luar rumus setoran sampah.
            </li>
            <li>
              <strong class="text-white">Verifikasi wajib</strong>: poin baru sah setelah setoran ditimbang admin
              atau bukti tanam disetujui; tidak ada poin dari klaim tanpa bukti.
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Duel Pekan -->
    <section id="duel-pekan" class="px-5 pt-10 lg:px-10 lg:pt-14" aria-labelledby="judul-duel">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-duel" kicker="Kompetisi Pekanan" judul="Duel Pekan" />
        <p v-anim class="mt-3 max-w-160 text-body text-teks">
          Di atas klasemen musim, setiap pekan 8 kelas dipasangkan head-to-head dalam 4 duel.
          Skor duel adalah <strong>poin aksi terverifikasi</strong> yang dikumpulkan kelas pada pekan
          itu: tidak ada babak tambahan, cukup terus setor dan tanam. Jadwal lengkap dan hasilnya
          ada di halaman
          <NuxtLink to="/jadwal" class="font-semibold text-hijau-teks hover:underline">Jadwal &amp; Hasil</NuxtLink>.
        </p>

        <div v-anim="80" class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-[18px] border border-garis bg-surface px-6 py-5.5">
            <h3 class="text-h3 font-semibold">Format musim 16 pekan</h3>
            <ul class="mt-3 flex flex-col gap-2.5 text-small text-teks">
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks tabular-nums">1–7</span>
                <span>Putaran 1 round-robin: tiap kelas bertemu semua lawan sekali (metode lingkaran).</span>
              </li>
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks tabular-nums">8–14</span>
                <span>Putaran 2: pasangan yang sama diulang, posisi kandang/tandang ditukar.</span>
              </li>
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks tabular-nums">15</span>
                <span>Pekan Wildcard: 4 duel paling ketat putaran 1 (selisih skor terkecil) diulang.</span>
              </li>
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks tabular-nums">16</span>
                <span>Pekan Final: peringkat 1 vs 2, 3 vs 4, dan seterusnya menurut klasemen pekan 15.</span>
              </li>
            </ul>
          </div>

          <div class="rounded-[18px] border border-garis bg-surface px-6 py-5.5">
            <h3 class="text-h3 font-semibold">Poin duel per laga</h3>
            <div class="mt-3.5 flex flex-col gap-3">
              <div class="flex items-center gap-4">
                <span class="w-9 shrink-0 text-right font-display text-h3 font-bold text-hijau-teks tabular-nums">+3</span>
                <span class="text-small text-teks">Menang: poin aksi pekan itu lebih tinggi dari lawan duel.</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="w-9 shrink-0 text-right font-display text-h3 font-bold text-emas-teks tabular-nums">+1</span>
                <span class="text-small text-teks">Seri: kedua kelas mencetak poin aksi sama persis.</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="w-9 shrink-0 text-right font-display text-h3 font-bold text-teks-samar tabular-nums">0</span>
                <span class="text-small text-teks">Kalah: tidak dapat poin duel, tetapi seluruh poin aksinya tetap masuk klasemen.</span>
              </div>
            </div>
            <p class="mt-4 border-t border-krem pt-3.5 text-small text-teks">
              <strong>Poin duel tidak mengubah urutan klasemen utama.</strong> Klasemen liga tetap
              diurutkan murni dari Poin Hijau; duel adalah jalur gelar terpisah.
            </p>
          </div>
        </div>

        <!-- Tiga jalur gelar musim -->
        <div v-anim="120" class="mt-4 rounded-[18px] border border-garis bg-surface px-6 py-5.5">
          <h3 class="text-h3 font-semibold">Tiga jalur gelar dalam satu musim</h3>
          <ul class="mt-3 flex flex-col gap-2.5 text-small text-teks">
            <li class="flex gap-2.25">
              <span class="shrink-0 font-semibold text-hijau-teks">Juara Liga:</span>
              <span>total Poin Hijau tertinggi di akhir musim (klasemen utama).</span>
            </li>
            <li class="flex gap-2.25">
              <span class="shrink-0 font-semibold text-hijau-teks">Juara Duel:</span>
              <span>poin duel terbanyak dari 16 pekan head-to-head; kelas menengah tetap bisa juara lewat kemenangan pekanannya.</span>
            </li>
            <li class="flex gap-2.25">
              <span class="shrink-0 font-semibold text-emas-teks">Kelas Terlestari:</span>
              <span>Indeks Lestari tertinggi: poin dibagi jumlah siswa. Kelas berisi 24 siswa bertanding adil melawan kelas 38 siswa karena yang dinilai rerata kontribusi per orang.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Verifikasi bukti -->
    <section id="verifikasi" class="mt-12 bg-hijau-muda px-5 py-12 lg:mt-16 lg:px-10 lg:py-16" aria-labelledby="judul-verif">
      <div class="mx-auto max-w-190">
        <SectionHeading v-anim id="judul-verif" kicker="Anti Klaim Kosong" judul="Verifikasi Bukti" />
        <div v-anim="80" class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-[18px] border border-garis-hijau bg-surface px-6 py-5.5">
            <h3 class="text-h3 font-semibold">Apa yang diperiksa admin</h3>
            <ul class="mt-3 flex flex-col gap-2.5 text-small text-teks">
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks tabular-nums">1.</span>
                <span>Setoran sampah ditimbang langsung per kategori di bank sampah sekolah.</span>
              </li>
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks tabular-nums">2.</span>
                <span>Bukti tanam pohon menyertakan foto, koordinat lokasi, dan jenis pohonnya.</span>
              </li>
              <li class="flex gap-2.25">
                <span class="shrink-0 font-semibold text-hijau-teks tabular-nums">3.</span>
                <span>Bukti yang meragukan ditolak; poin hanya lahir dari aksi yang terbukti.</span>
              </li>
            </ul>
          </div>

          <div class="rounded-[18px] border border-garis-hijau bg-surface px-6 py-5.5">
            <h3 class="text-h3 font-semibold">Status yang mungkin kamu lihat</h3>
            <div class="mt-4 flex flex-col gap-4">
              <div class="flex items-center gap-4">
                <span class="stempel-verif text-caption">Terverifikasi</span>
                <span class="text-small text-teks">Bukti sah, poin masuk ke klasemen tim.</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="stempel-verif text-caption" style="color: var(--emas-teks); border-color: var(--emas-teks)">Menunggu</span>
                <span class="text-small text-teks">Sedang diperiksa admin, poin belum dihitung.</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="stempel-verif text-caption" style="color: var(--merah-teks); border-color: var(--merah-teks)">Ditolak</span>
                <span class="text-small text-teks">Bukti kurang jelas, unggah ulang dengan foto & lokasi.</span>
              </div>
            </div>
          </div>
        </div>

        <p v-anim class="mt-6 text-small text-teks-redup">
          Aturan seketat ini yang membedakan LigaLestari dari aplikasi lingkungan lain.
          <NuxtLink to="/mengapa-berbeda" class="font-semibold text-hijau-teks hover:underline">Lihat perbandingannya</NuxtLink>.
        </p>
      </div>
    </section>
  </div>
</template>
