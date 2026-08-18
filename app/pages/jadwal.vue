<script setup lang="ts">
import type { DuelPekan } from '#shared/types'
import { CATATAN_PEKAN, JADWAL_DUEL, KLASEMEN_DUEL, labelPekan } from '#shared/data/duel'
import { KLASEMEN_PER_ID, MUSIM } from '#shared/data/klasemen'

useSeoMeta({
  title: 'Jadwal & Hasil Duel Pekan',
  description:
    'Jadwal round-robin dan hasil Duel Pekan LigaLestari: 4 duel antar-kelas tiap pekan, skor dari poin aksi terverifikasi, plus klasemen Juara Duel.',
})

/** Pekan yang sedang dilihat, bawaan: pekan berjalan musim ini. */
const pekanDipilih = ref(MUSIM.pekan)
const daftarPekan = JADWAL_DUEL.map((_, i) => i + 1)

const duelPekanIni = computed(() => JADWAL_DUEL[pekanDipilih.value - 1] ?? [])
const catatan = computed(() => CATATAN_PEKAN[pekanDipilih.value])

const tim = (id: string) => KLASEMEN_PER_ID[id]!

const GAYA_STATUS = {
  selesai: { label: 'Selesai', kelas: 'border-garis bg-surface-3 text-teks-redup' },
  berjalan: { label: 'Berjalan', kelas: 'border-garis-hijau bg-hijau-muda text-hijau-teks' },
  menyusul: { label: 'Menyusul', kelas: 'border-garis bg-surface text-teks-samar' },
} as const

/**
 * Hasil satu sisi duel: Menang/Seri/Kalah + panah tren, hanya untuk duel
 * yang sudah selesai (duel berjalan belum punya hasil sah).
 */
function hasilSisi(duel: DuelPekan, sisi: 'kandang' | 'tandang') {
  if (duel.status !== 'selesai' || duel.skorKandang == null || duel.skorTandang == null) return null
  const selisih = sisi === 'kandang' ? duel.skorKandang - duel.skorTandang : duel.skorTandang - duel.skorKandang
  if (selisih > 0) return { tanda: 'M', panah: '▲', kelas: 'text-hijau-teks', label: 'Menang' }
  if (selisih < 0) return { tanda: 'K', panah: '▼', kelas: 'text-merah-teks', label: 'Kalah' }
  return { tanda: 'S', panah: '=', kelas: 'text-emas-teks', label: 'Seri' }
}
</script>

<template>
  <div>
    <!-- Pembuka halaman -->
    <header class="px-5 pt-7.5 lg:px-10 lg:pt-11.5">
      <div v-anim class="mx-auto max-w-225">
        <p class="text-caption font-semibold tracking-[0.14em] text-hijau-teks uppercase">
          Duel Pekan · {{ MUSIM.nama }}
        </p>
        <h1 class="mt-2.5 max-w-170 text-h1 font-bold tracking-[-0.02em]">Jadwal & Hasil</h1>
        <p class="mt-3.5 max-w-150 text-body text-teks">
          Tiap pekan, 8 kelas dipasangkan head-to-head. Skor duel adalah poin aksi terverifikasi
          yang dikumpulkan kelas pada pekan itu: menang +3 poin duel, seri +1, kalah 0.
          Rincian aturannya ada di
          <NuxtLink to="/aturan#duel-pekan" class="font-semibold text-hijau-teks hover:underline">Buku Aturan</NuxtLink>.
        </p>
      </div>
    </header>

    <div class="px-5 pt-7 pb-14 lg:px-10 lg:pt-9 lg:pb-20">
      <div class="mx-auto max-w-225">
        <!-- Pemilih pekan -->
        <div v-anim>
          <div class="flex items-end justify-between gap-4">
            <h2 class="text-caption font-semibold tracking-[0.14em] text-teks-redup uppercase">Pilih Pekan</h2>
            <p class="text-caption font-semibold text-teks-samar">
              {{ labelPekan(pekanDipilih) }} · Pekan {{ pekanDipilih }}/{{ MUSIM.totalPekan }}
            </p>
          </div>
          <div class="-mx-5 mt-2.5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0" role="group" aria-label="Pilih pekan jadwal">
            <div class="flex w-max gap-1.5">
              <button
                v-for="p in daftarPekan"
                :key="p"
                type="button"
                :aria-pressed="pekanDipilih === p"
                class="relative h-10.5 min-w-10.5 rounded-[11px] border px-2 font-display text-small font-bold tabular-nums"
                :class="
                  pekanDipilih === p
                    ? 'border-hijau bg-hijau text-white'
                    : p === MUSIM.pekan
                      ? 'border-garis-hijau bg-surface text-hijau-teks'
                      : 'border-garis bg-surface text-teks-redup hover:border-garis-tegas'
                "
                @click="pekanDipilih = p"
              >
                {{ p }}
                <span v-if="p === MUSIM.pekan" class="sr-only">(pekan berjalan)</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 grid items-start gap-7 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
          <!-- Daftar duel pekan terpilih -->
          <section aria-labelledby="judul-duel-pekan">
            <h2 id="judul-duel-pekan" class="sr-only">Duel pekan {{ pekanDipilih }}</h2>
            <ul class="flex flex-col gap-3">
              <li
                v-for="duel in duelPekanIni"
                :key="`${duel.pekan}-${duel.kandang}-${duel.tandang}`"
                class="rounded-[18px] border border-garis bg-surface px-4 py-4 sm:px-5"
              >
                <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                  <!-- Sisi kandang -->
                  <div class="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <TimEmblem :warna="tim(duel.kandang).warna" :teks="tim(duel.kandang).emblem" :ukuran="42" />
                    <div class="min-w-0">
                      <div class="truncate text-small font-bold sm:text-body">{{ tim(duel.kandang).nama }}</div>
                      <div class="truncate text-caption text-teks-samar">{{ tim(duel.kandang).julukan }}</div>
                      <div v-if="hasilSisi(duel, 'kandang')" class="mt-0.5 text-caption font-bold" :class="hasilSisi(duel, 'kandang')!.kelas">
                        <span aria-hidden="true">{{ hasilSisi(duel, 'kandang')!.tanda }} {{ hasilSisi(duel, 'kandang')!.panah }}</span>
                        <span class="sr-only">{{ hasilSisi(duel, 'kandang')!.label }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Skor & status -->
                  <div class="text-center">
                    <span
                      class="inline-block rounded-md border px-2 py-0.5 text-[0.625rem] font-bold tracking-[0.08em] uppercase"
                      :class="GAYA_STATUS[duel.status].kelas"
                    >
                      {{ GAYA_STATUS[duel.status].label }}
                    </span>
                    <div v-if="duel.skorKandang != null" class="mt-1 font-display text-h3 font-bold tabular-nums sm:text-h2">
                      {{ formatAngka(duel.skorKandang) }}<span class="mx-1 text-teks-samar sm:mx-1.5">–</span>{{ formatAngka(duel.skorTandang!) }}
                    </div>
                    <div v-else class="mt-1 font-display text-h3 font-bold text-teks-samar">vs</div>
                    <div class="text-[0.625rem] font-medium text-teks-samar">poin aksi pekan {{ duel.pekan }}</div>
                  </div>

                  <!-- Sisi tandang -->
                  <div class="flex min-w-0 flex-row-reverse items-center gap-2.5 text-right sm:gap-3">
                    <TimEmblem :warna="tim(duel.tandang).warna" :teks="tim(duel.tandang).emblem" :ukuran="42" />
                    <div class="min-w-0">
                      <div class="truncate text-small font-bold sm:text-body">{{ tim(duel.tandang).nama }}</div>
                      <div class="truncate text-caption text-teks-samar">{{ tim(duel.tandang).julukan }}</div>
                      <div v-if="hasilSisi(duel, 'tandang')" class="mt-0.5 text-caption font-bold" :class="hasilSisi(duel, 'tandang')!.kelas">
                        <span aria-hidden="true">{{ hasilSisi(duel, 'tandang')!.tanda }} {{ hasilSisi(duel, 'tandang')!.panah }}</span>
                        <span class="sr-only">{{ hasilSisi(duel, 'tandang')!.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Penjelasan pekan khusus (wildcard/final) -->
            <p v-if="catatan" class="mt-3.5 rounded-[14px] border border-garis bg-surface-2 px-4.5 py-3.5 text-small text-teks">
              <strong class="font-bold text-teks-kuat">{{ labelPekan(pekanDipilih) }}.</strong>
              {{ catatan }}
            </p>
            <p v-else class="mt-3 text-center text-caption text-teks-samar">
              Skor = Poin Hijau terverifikasi kelas pada pekan tersebut · M = menang, S = seri, K = kalah
            </p>
          </section>

          <!-- Klasemen Duel -->
          <section aria-labelledby="judul-klasemen-duel">
            <div class="overflow-hidden rounded-[18px] border border-garis bg-surface">
              <div class="border-b border-garis bg-surface-3 px-4.5 py-3">
                <h2 id="judul-klasemen-duel" class="text-caption font-semibold tracking-[0.14em] text-teks-redup uppercase">
                  Klasemen Duel · Jalur Juara Duel
                </h2>
              </div>
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="text-[0.625rem] font-semibold tracking-[0.08em] text-teks-samar uppercase">
                    <th scope="col" class="py-2.5 pl-4.5">Tim</th>
                    <th scope="col" class="px-2 py-2.5 text-center" title="Menang-Seri-Kalah">M-S-K</th>
                    <th scope="col" class="py-2.5 pr-4.5 text-right">Poin Duel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(baris, i) in KLASEMEN_DUEL" :key="baris.tim.id" class="border-t border-krem">
                    <td class="py-2.75 pl-4.5">
                      <div class="flex items-center gap-2.5">
                        <span class="w-4 shrink-0 font-display text-small font-bold text-teks-samar tabular-nums">{{ i + 1 }}</span>
                        <TimEmblem :warna="baris.tim.warna" :teks="baris.tim.emblem" :ukuran="30" />
                        <span class="text-small font-semibold">{{ baris.tim.nama }}</span>
                      </div>
                    </td>
                    <td class="px-2 py-2.75 text-center text-small font-medium text-teks-redup tabular-nums">
                      {{ baris.rekor.menang }}-{{ baris.rekor.seri }}-{{ baris.rekor.kalah }}
                    </td>
                    <td class="py-2.75 pr-4.5 text-right font-display text-body font-bold text-hijau-teks tabular-nums">
                      {{ baris.rekor.poinDuel }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="mt-3 text-caption text-teks-samar">
              Juara Duel adalah gelar terpisah; klasemen utama liga tetap diurutkan murni dari
              Poin Hijau. Rekor dihitung dari {{ MUSIM.pekan - 1 }} pekan duel yang sudah selesai.
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
