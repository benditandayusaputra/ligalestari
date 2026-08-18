<script setup lang="ts">
import type { TimKelas } from '#shared/types'

const props = defineProps<{
  tim: TimKelas[]
  musim: { pekan: number }
}>()

// Pratinjau kartu pencapaian memakai data pemuncak klasemen sungguhan.
const juara = props.tim[0]!
const posisiLama = juara.tren > 0 ? 1 + juara.tren : null

const FITUR = [
  {
    ikon: 'lucide:trophy',
    judul: 'Liga antar-kelas',
    teks: 'Klasemen hidup ala liga olahraga: satu kelas satu tim, lengkap dengan julukan dan emblem.',
  },
  {
    ikon: 'lucide:recycle',
    judul: 'Dua jenis event',
    teks: 'Setoran Sampah dan Tanam Pohon menyatu ke satu sistem Poin Hijau yang adil antar-kelas.',
  },
  {
    ikon: 'lucide:leaf',
    judul: 'Estimasi serapan CO₂',
    teks: 'Tiap pohon dihitung dampak karbonnya per jenis — rumusnya terbuka untuk diperiksa.',
    tautan: { label: 'Lihat metodologinya', ke: '/metodologi' },
  },
]
</script>

<template>
  <section id="fitur" class="bg-hijau-muda px-5 py-12 lg:px-10 lg:py-18">
    <div class="mx-auto max-w-275">
      <div v-anim class="mb-9 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <SectionHeading kicker="Yang Kamu Dapat" judul="Bukan sekadar mencatat sampah." />
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <NuxtLink
            to="/mengapa-berbeda"
            class="inline-flex items-center gap-1.5 py-1 text-small font-semibold text-hijau-teks hover:underline"
          >
            Mengapa kami berbeda
            <Icon name="lucide:chevron-right" size="15" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink
            to="/peta"
            class="inline-flex items-center gap-1.5 py-1 text-small font-semibold text-hijau-teks hover:underline"
          >
            Lihat peta pohon
            <Icon name="lucide:chevron-right" size="15" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>

      <div class="grid items-start gap-9 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <!-- Fitur unggulan: pratinjau kartu pencapaian dengan data juara sungguhan -->
        <div v-anim class="rounded-[20px] border border-garis-hijau bg-surface p-6 lg:p-7">
          <h3 class="text-h3 font-semibold">Naik peringkat? Ada kartunya.</h3>
          <p class="mt-1.5 max-w-100 text-small text-teks-redup">
            Tiap kali kelasmu naik, LigaLestari otomatis membuatkan kartu pencapaian siap-unggah
            untuk media sosial kelas.
          </p>

          <div
            class="garis-lapangan mt-5 overflow-hidden rounded-xl border border-white/10 bg-tinta p-4.5"
            role="img"
            :aria-label="`Contoh kartu pencapaian: ${juara.nama} di posisi 1 klasemen dengan ${formatAngka(juara.poin)} Poin Hijau`"
          >
            <div class="flex items-center justify-between">
              <span class="text-caption font-semibold tracking-[0.12em] text-lime uppercase">Kartu Pencapaian</span>
              <span class="text-caption text-white/70 tabular-nums">Pekan {{ musim.pekan }}</span>
            </div>
            <div class="mt-4 flex items-center gap-3.5">
              <span
                class="flex h-11.5 w-11.5 shrink-0 items-center justify-center rounded-[13px] border-2 border-white font-display text-body font-bold"
                :style="gayaEmblem(juara.warna)"
              >
                {{ juara.emblem }}
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-body font-semibold text-white">{{ juara.nama }}</span>
                <span class="block text-caption text-white/70">Tim {{ juara.julukan }}</span>
              </span>
              <span class="text-right">
                <span class="block text-caption text-white/70">{{ posisiLama ? 'naik ke puncak' : 'puncak klasemen' }}</span>
                <span class="block font-display text-h3 font-bold text-lime tabular-nums">
                  <template v-if="posisiLama">#{{ posisiLama }} → </template>#1
                </span>
              </span>
            </div>
            <div class="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-caption text-white/70">
              <span class="tabular-nums">{{ formatAngka(juara.poin) }} Poin Hijau</span>
              <span>Siap dibagikan · LigaLestari</span>
            </div>
          </div>
          <p class="mt-3 text-caption text-teks-samar">
            Pratinjau kartu milik pemuncak klasemen pekan ini — dibuat otomatis, tinggal unggah.
          </p>
        </div>

        <ul class="flex flex-col">
          <li
            v-for="(fitur, i) in FITUR"
            v-anim="(i % 3) * 80"
            :key="fitur.judul"
            class="flex gap-3.5 border-t border-garis-hijau py-5 first:border-t-0 lg:first:pt-1"
          >
            <Icon :name="fitur.ikon" size="19" class="mt-0.5 shrink-0 text-hijau-teks" aria-hidden="true" />
            <div>
              <h3 class="text-body font-semibold">{{ fitur.judul }}</h3>
              <p class="mt-1 text-small text-teks-redup">
                {{ fitur.teks }}
                <NuxtLink
                  v-if="fitur.tautan"
                  :to="fitur.tautan.ke"
                  class="font-semibold text-hijau-teks hover:underline"
                >
                  {{ fitur.tautan.label }}
                </NuxtLink>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
