<script setup lang="ts">
import type { TimKelas } from '#shared/types'

const props = defineProps<{
  tim: TimKelas[]
  musim: { nama: string; pekan: number; totalPekan: number; berakhir: string; sisaHari: number }
}>()

// Tiga besar untuk visual podium (urutan tampil: 2 - 1 - 3).
const [juara1, juara2, juara3] = props.tim
const musim = props.musim
</script>

<template>
  <section
    class="motif-daun mx-auto flex max-w-275 flex-col items-center gap-10 overflow-x-clip px-5 py-12 md:py-16 lg:flex-row lg:gap-14 lg:px-10 lg:py-20"
  >
    <div v-anim class="min-w-0 flex-1">
      <ChipMusim :musim="musim" />
      <h1 class="mt-5 max-w-150 text-display font-bold tracking-[-0.02em] text-balance">
        <span class="sr-only">LigaLestari — </span>
        Pilah sampah, <span class="text-hijau-teks">rebut juara.</span>
      </h1>
      <p
        class="mt-4 text-caption font-semibold tracking-[0.14em] text-hijau-teks uppercase"
      >
        Satu musim, satu aksi, satu bumi.
      </p>
      <p class="mt-3 max-w-115 text-body text-teks lg:text-lead">
        Setor sampah, tanam pohon, dan kumpulkan Poin Hijau bersama teman sekelasmu —
        lalu bawa kelasmu ke puncak klasemen sekolah.
      </p>
      <div class="mt-7 flex flex-wrap gap-3">
        <NuxtLink
          to="/daftar"
          class="group inline-flex items-center gap-2 rounded-xl bg-hijau px-6 py-3.5 text-body font-semibold text-white hover:bg-hijau-pekat"
        >
          Daftar / Gabung Kelas
          <Icon
            name="lucide:arrow-right"
            size="17"
            class="text-lime transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </NuxtLink>
        <a
          href="#cara"
          class="inline-flex items-center rounded-xl border border-garis-tegas bg-surface px-6 py-3.5 text-body font-semibold hover:border-hijau-teks/40 hover:text-hijau-teks"
        >
          Lihat cara main
        </a>
      </div>
      <p class="mt-6 text-caption font-medium text-teks-samar">
        {{ tim.length }} kelas bertanding musim ini · Gratis untuk sekolah
      </p>
    </div>

    <!-- Papan skor tiga besar liga -->
    <div
      v-anim="130"
      class="w-full max-w-105 shrink-0 lg:w-105"
      role="img"
      :aria-label="`Papan klasemen pekan ${musim.pekan}: peringkat 1 ${juara1!.nama} ${formatAngka(juara1!.poin)} poin, peringkat 2 ${juara2!.nama} ${formatAngka(juara2!.poin)} poin, peringkat 3 ${juara3!.nama} ${formatAngka(juara3!.poin)} poin`"
    >
      <div
        class="garis-lapangan relative overflow-hidden rounded-[20px] border border-white/10 bg-tinta p-5 shadow-[0_22px_50px_rgba(14,40,24,0.28)]"
      >
        <div class="mb-4 flex items-center justify-between">
          <span class="text-caption font-semibold tracking-[0.12em] text-lime uppercase">Klasemen Liga</span>
          <span class="text-caption text-white/70 tabular-nums">Pekan {{ musim.pekan }}/{{ musim.totalPekan }}</span>
        </div>

        <div class="flex items-end gap-2.5">
          <div class="flex-1 text-center">
            <div
              class="mx-auto flex h-11.5 w-11.5 items-center justify-center rounded-[13px] border-2 border-white font-display text-body font-bold"
              :style="gayaEmblem(juara2!.warna)"
            >
              {{ juara2!.emblem }}
            </div>
            <div class="mt-1.5 text-caption font-semibold text-white">{{ juara2!.nama }}</div>
            <div class="font-display text-small font-bold text-lime tabular-nums"><CountUp :nilai="juara2!.poin" /></div>
            <div
              class="mt-1.5 flex h-13.5 justify-center rounded-t-[11px] bg-[linear-gradient(180deg,#C7CDD4,#AAB2BB)] pt-1.5 font-display text-lg font-bold text-tinta/80"
            >
              2
            </div>
          </div>

          <div class="flex-[1.1] text-center">
            <Icon name="lucide:crown" size="16" class="mx-auto mb-1 block text-emas" aria-hidden="true" />
            <div
              class="mx-auto flex h-13.5 w-13.5 items-center justify-center rounded-[15px] border-2 border-white font-display text-h3 font-bold"
              :style="gayaEmblem(juara1!.warna)"
            >
              {{ juara1!.emblem }}
            </div>
            <div class="mt-1.5 text-caption font-semibold text-white">{{ juara1!.nama }}</div>
            <div class="font-display text-body font-bold text-lime tabular-nums"><CountUp :nilai="juara1!.poin" /></div>
            <div
              class="mt-1.5 flex h-19.5 justify-center rounded-t-[11px] bg-[linear-gradient(180deg,#F2CE52,#E6B422)] pt-2 font-display text-2xl font-bold text-tinta/80"
            >
              1
            </div>
          </div>

          <div class="flex-1 text-center">
            <div
              class="mx-auto flex h-11.5 w-11.5 items-center justify-center rounded-[13px] border-2 border-white font-display text-body font-bold"
              :style="gayaEmblem(juara3!.warna)"
            >
              {{ juara3!.emblem }}
            </div>
            <div class="mt-1.5 text-caption font-semibold text-white">{{ juara3!.nama }}</div>
            <div class="font-display text-small font-bold text-lime tabular-nums"><CountUp :nilai="juara3!.poin" /></div>
            <div
              class="mt-1.5 flex h-10.5 justify-center rounded-t-[11px] bg-[linear-gradient(180deg,#D79A5E,#C77F3E)] pt-1.5 font-display text-base font-bold text-tinta/80"
            >
              3
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-white/10 pt-3.5 text-caption text-white/70">
          <span>Musim berakhir {{ musim.berakhir }}</span>
          <span class="font-semibold text-white/80 tabular-nums">{{ musim.sisaHari }} hari lagi</span>
        </div>
      </div>
    </div>
  </section>
</template>
