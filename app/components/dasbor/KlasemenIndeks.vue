<script setup lang="ts">
import type { TimKelas } from '#shared/types'

/**
 * Klasemen mode Indeks Lestari: poin per kapita (poin ÷ jumlah siswa),
 * diurutkan ulang, kelas kecil bisa mengalahkan kelas besar secara adil.
 */
const props = defineProps<{ tim: TimKelas[] }>()

const indeks = (t: TimKelas) => (t.jumlahSiswa > 0 ? t.poin / t.jumlahSiswa : 0)

const terurut = computed(() => [...props.tim].sort((a, b) => indeks(b) - indeks(a)))
const terlestari = computed(() => terurut.value[0])
</script>

<template>
  <div>
    <div class="flex items-end justify-between px-1 pt-4.5 pb-3">
      <h2 class="font-display text-[1.0625rem] font-bold tracking-[-0.01em]">Indeks Lestari</h2>
      <span class="text-[0.6875rem] font-semibold text-teks-samar">poin ÷ jumlah siswa</span>
    </div>

    <!-- Kartu pemuncak indeks: Kelas Terlestari -->
    <div
      v-if="terlestari"
      class="rounded-[18px] border border-garis bg-surface px-4.5 py-4.5 shadow-[inset_0_3px_0_0_var(--color-lime)]"
    >
      <div class="flex items-center gap-3.5">
        <TimEmblem :warna="terlestari.warna" :teks="terlestari.emblem" :ukuran="52" />
        <div class="min-w-0 flex-1">
          <span class="stempel-verif text-[0.625rem]" style="color: var(--emas-teks); border-color: var(--emas-teks)">
            Kelas Terlestari
          </span>
          <div class="mt-1.5 text-[0.9375rem] font-bold">{{ terlestari.nama }}</div>
          <div class="text-[0.6875rem] font-medium text-teks-samar">
            {{ terlestari.julukan }} · {{ formatAngka(terlestari.poin) }} poin ÷ {{ terlestari.jumlahSiswa }} siswa
          </div>
        </div>
        <div class="text-right">
          <div class="font-display text-[1.625rem] leading-none font-bold text-emas-teks tabular-nums">
            {{ formatIndeks(indeks(terlestari)) }}
          </div>
          <div class="mt-1 text-[0.625rem] font-semibold text-teks-samar">poin / siswa</div>
        </div>
      </div>
    </div>

    <!-- Daftar lengkap terurut indeks -->
    <ol class="mt-3 overflow-hidden rounded-[18px] border border-garis bg-surface" aria-label="Klasemen Indeks Lestari (poin per siswa)">
      <li
        v-for="(t, i) in terurut"
        :key="t.id"
        class="flex items-center gap-3 border-t border-krem px-3.5 py-3.25 first:border-t-0"
        :class="i === 0 && 'bg-sorot'"
      >
        <div class="w-6 text-center font-display text-[0.9375rem] font-bold text-teks-samar tabular-nums">{{ i + 1 }}</div>
        <TimEmblem :warna="t.warna" :teks="t.emblem" :ukuran="40" />
        <div class="min-w-0 flex-1">
          <div class="text-[0.84375rem] font-bold">{{ t.nama }}</div>
          <div class="text-[0.6875rem] font-medium text-teks-samar">{{ t.julukan }} · {{ t.jumlahSiswa }} siswa</div>
        </div>
        <div class="text-right">
          <div class="font-display text-[0.9375rem] font-bold text-hijau-teks tabular-nums">{{ formatIndeks(indeks(t)) }}</div>
          <div class="text-[0.625rem] font-medium text-teks-samar tabular-nums">{{ formatAngka(t.poin) }} poin</div>
        </div>
      </li>
    </ol>
    <p class="mt-3 px-1 text-center text-[0.6875rem] text-teks-samar">
      Indeks Lestari menilai rerata kontribusi per siswa, adil untuk kelas kecil maupun besar.
    </p>
  </div>
</template>
