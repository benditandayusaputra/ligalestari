<script setup lang="ts">
import type { TimKelas } from '#shared/types'
import { REKOR_DUEL } from '#shared/data/duel'

/** Tampilan "balapan": bar kemajuan tiap tim relatif terhadap pemuncak. */
const props = defineProps<{ tim: TimKelas[] }>()

const poinPuncak = props.tim[0]?.poin ?? 1
const persen = (t: TimKelas) => Math.round((t.poin / poinPuncak) * 100)

/** Rekor Duel Pekan ringkas: "M-S-K · poin duel" (data demo shared/). */
const duel = (id: string) => {
  const r = REKOR_DUEL[id]
  return r ? `${r.menang}-${r.seri}-${r.kalah} · ${r.poinDuel} pd` : ''
}
</script>

<template>
  <div>
    <div class="flex items-end justify-between px-1 pt-4.5 pb-3">
      <h2 class="font-display text-[1.0625rem] font-bold tracking-[-0.01em]">Balapan Poin Hijau</h2>
      <span class="text-[0.6875rem] font-semibold text-teks-samar">% dari pemuncak</span>
    </div>

    <ol class="flex flex-col gap-2.25" aria-label="Klasemen lengkap dengan bar kemajuan">
      <li
        v-for="(t, i) in tim"
        :key="t.id"
        class="rounded-[15px] border px-3.25 py-3"
        :class="i === 0 ? 'border-[#EAD79A] bg-sorot' : 'border-garis bg-surface'"
      >
        <div class="mb-2.5 flex items-center gap-2.5">
          <div class="flex h-6.75 w-6.75 shrink-0 items-center justify-center rounded-lg font-display text-[0.8125rem] font-bold" :style="warnaMedali(i)">
            {{ i + 1 }}
          </div>
          <TimEmblem :warna="t.warna" :teks="t.emblem" :ukuran="34" />
          <div class="min-w-0 flex-1">
            <div class="text-[0.84375rem] font-bold">{{ t.nama }}</div>
            <div class="text-[0.65625rem] font-semibold text-teks-samar" :title="`Rekor duel (M-S-K) · poin duel`">
              {{ t.julukan }} · {{ t.kg }} kg · Duel {{ duel(t.id) }}
            </div>
          </div>
          <div class="text-right">
            <div class="font-display text-[0.9375rem] font-bold text-hijau-teks">{{ formatAngka(t.poin) }}</div>
            <TrenPeringkat :tren="t.tren" />
          </div>
        </div>
        <div
          class="h-2.75 overflow-hidden rounded-full bg-surface-3"
          role="progressbar"
          :aria-valuenow="persen(t)"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`${t.nama}: ${persen(t)}% dari poin pemuncak`"
        >
          <div class="h-full rounded-full" :style="{ width: `${persen(t)}%`, background: t.warna }" />
        </div>
      </li>
    </ol>
  </div>
</template>
