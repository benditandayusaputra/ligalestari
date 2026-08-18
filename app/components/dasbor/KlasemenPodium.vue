<script setup lang="ts">
import type { TimKelas } from '#shared/types'
import { REKOR_DUEL } from '#shared/data/duel'

/** Tampilan podium tiga besar + daftar peringkat 4 ke bawah. */
const props = defineProps<{ tim: TimKelas[] }>()

const [juara1, juara2, juara3] = props.tim
const sisanya = props.tim.slice(3)

/** Rekor Duel Pekan ringkas: "M-S-K · poin duel" (data demo shared/). */
const duel = (id: string) => {
  const r = REKOR_DUEL[id]
  return r ? `${r.menang}-${r.seri}-${r.kalah} · ${r.poinDuel} pd` : ''
}
</script>

<template>
  <div>
    <div class="flex items-end justify-between px-1 pt-4.5 pb-3">
      <h2 class="font-display text-[1.0625rem] font-bold tracking-[-0.01em]">Podium Musim</h2>
      <span class="text-[0.6875rem] font-semibold text-teks-samar">Poin Hijau</span>
    </div>

    <div class="mx-auto flex max-w-md items-end gap-2.25" role="img" aria-label="Podium tiga besar klasemen">
      <div class="flex flex-1 flex-col items-center">
        <TimEmblem :warna="juara2!.warna" :teks="juara2!.emblem" :ukuran="54" class="border-2 border-white shadow-[0_6px_14px_rgba(20,32,22,0.18)]" />
        <div class="mt-1.75 text-[0.6875rem] font-bold">{{ juara2!.nama }}</div>
        <div class="font-display text-sm font-bold text-teks-redup">{{ formatAngka(juara2!.poin) }}</div>
        <div class="text-[0.625rem] font-semibold text-teks-samar tabular-nums" :title="`Rekor duel (M-S-K) · poin duel`">{{ duel(juara2!.id) }}</div>
        <div class="mt-1.75 flex h-18.5 w-full justify-center rounded-t-[14px] bg-[linear-gradient(180deg,#C7CDD4,#AAB2BB)] pt-2.25 font-display text-[1.625rem] font-bold text-tinta/80">2</div>
      </div>

      <div class="flex flex-[1.12] flex-col items-center">
        <Icon name="lucide:crown" size="18" class="text-emas" aria-hidden="true" />
        <TimEmblem :warna="juara1!.warna" :teks="juara1!.emblem" :ukuran="64" class="mt-0.5 border-2 border-white shadow-[0_8px_20px_rgba(230,180,34,0.4)]" />
        <div class="mt-1.75 text-xs font-bold">{{ juara1!.nama }}</div>
        <div class="font-display text-base font-bold text-hijau-teks">{{ formatAngka(juara1!.poin) }}</div>
        <div class="text-[0.625rem] font-semibold text-teks-samar tabular-nums" :title="`Rekor duel (M-S-K) · poin duel`">{{ duel(juara1!.id) }}</div>
        <div class="mt-1.75 flex h-26 w-full justify-center rounded-t-[14px] bg-[linear-gradient(180deg,#F2CE52,#E6B422)] pt-2.75 font-display text-[2rem] font-bold text-tinta/80">1</div>
      </div>

      <div class="flex flex-1 flex-col items-center">
        <TimEmblem :warna="juara3!.warna" :teks="juara3!.emblem" :ukuran="54" class="border-2 border-white shadow-[0_6px_14px_rgba(20,32,22,0.18)]" />
        <div class="mt-1.75 text-[0.6875rem] font-bold">{{ juara3!.nama }}</div>
        <div class="font-display text-sm font-bold text-teks-redup">{{ formatAngka(juara3!.poin) }}</div>
        <div class="text-[0.625rem] font-semibold text-teks-samar tabular-nums" :title="`Rekor duel (M-S-K) · poin duel`">{{ duel(juara3!.id) }}</div>
        <div class="mt-1.75 flex h-14.5 w-full justify-center rounded-t-[14px] bg-[linear-gradient(180deg,#D79A5E,#C77F3E)] pt-2 font-display text-2xl font-bold text-tinta/80">3</div>
      </div>
    </div>

    <ol class="mt-3.5 overflow-hidden rounded-[18px] border border-garis bg-surface" aria-label="Peringkat 4 ke bawah">
      <li v-for="(t, i) in sisanya" :key="t.id" class="flex items-center gap-3 border-t border-krem px-3.5 py-3.25 first:border-t-0">
        <div class="w-6 text-center font-display text-[0.9375rem] font-bold text-teks-samar">{{ i + 4 }}</div>
        <TimEmblem :warna="t.warna" :teks="t.emblem" :ukuran="40" />
        <div class="min-w-0 flex-1">
          <div class="text-[0.84375rem] font-bold">{{ t.nama }}</div>
          <div class="text-[0.6875rem] font-medium text-teks-samar">{{ t.julukan }} · {{ t.kg }} kg · Duel {{ duel(t.id) }}</div>
        </div>
        <div class="text-right">
          <div class="font-display text-[0.9375rem] font-bold text-hijau-teks">{{ formatAngka(t.poin) }}</div>
          <TrenPeringkat :tren="t.tren" />
        </div>
      </li>
    </ol>
  </div>
</template>
