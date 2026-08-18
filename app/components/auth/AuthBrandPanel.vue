<script setup lang="ts">
import { KLASEMEN, MUSIM } from "#shared/data/klasemen";

// Data live yang sama dengan beranda/footer (kunci sama → sekali ambil);
// data demo lokal menjadi cadangan bila API belum tersedia.
const { data: liga } = await useFetch("/api/klasemen", { key: "klasemen" });

const tigaBesar = computed(() => (liga.value?.tim ?? KLASEMEN).slice(0, 3));
const musim = computed(() => liga.value?.musim ?? MUSIM);
</script>

<template>
  <div
    class="garis-lapangan hidden w-[46%] min-w-95 flex-col justify-between bg-hijau-pekat px-10 py-11 lg:flex"
  >
    <NuxtLink
      to="/"
      class="flex items-center gap-2.5 self-start"
      aria-label="LigaLestari — beranda"
    >
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-white"
      >
        <LestariEmblem class="h-8.5 w-8.5 text-hijau" />
      </span>
      <span class="font-display text-h3 font-bold tracking-[-0.02em] text-white"
        >LigaLestari</span
      >
    </NuxtLink>

    <div>
      <ChipMusim :musim="musim" gelap />
      <h2 class="mt-4.5 text-h1 font-bold tracking-[-0.02em] text-white">
        Pilah sampah,<br /><span class="text-lime">rebut juara.</span>
      </h2>
      <p class="mt-3.5 max-w-85 text-body text-white/80">
        Masuk untuk catat setoran sampah, tanam pohon, dan bawa kelasmu ke
        puncak klasemen.
      </p>

      <!-- Cuplikan tiga besar klasemen -->
      <div class="mt-6.5 rounded-[18px] border border-white/10 bg-tinta p-3.5">
        <div class="mb-3 flex items-center justify-between">
          <span
            class="text-caption font-semibold tracking-[0.12em] text-lime uppercase"
            >Klasemen Liga</span
          >
          <span class="text-caption text-white/70 tabular-nums"
            >Pekan {{ musim.pekan }}/{{ musim.totalPekan }}</span
          >
        </div>
        <div
          v-for="(tim, i) in tigaBesar"
          :key="tim.id"
          class="flex items-center gap-2.75 border-t border-white/10 py-1.75"
        >
          <div
            class="w-5.5 font-display text-small font-bold tabular-nums"
            :class="i === 0 ? 'text-lime' : 'text-white/70'"
          >
            {{ i + 1 }}
          </div>
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] font-display text-caption font-bold"
            :style="gayaEmblem(tim.warna)"
          >
            {{ tim.emblem }}
          </div>
          <div class="flex-1 text-small font-semibold text-white">
            {{ tim.nama }}
          </div>
          <div class="font-display text-small font-bold text-lime tabular-nums">
            {{ formatAngka(tim.poin) }}
          </div>
        </div>
      </div>
    </div>

    <div>
      <p
        class="text-caption font-semibold tracking-[0.14em] text-lime uppercase"
      >
        Satu musim, satu aksi, satu bumi.
      </p>
      <p class="mt-1.5 text-caption text-white/70">
        Bendi Tandayu Saputra · 2026
      </p>
    </div>
  </div>
</template>
