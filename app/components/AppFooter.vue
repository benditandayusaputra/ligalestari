<script setup lang="ts">
const JELAJAHI = [
  { label: "Beranda", ke: "/" },
  { label: "Jadwal & Hasil", ke: "/jadwal" },
  { label: "Aturan Liga", ke: "/aturan" },
  { label: "Mengapa Berbeda", ke: "/mengapa-berbeda" },
  { label: "Artikel & Edukasi", ke: "/artikel" },
  { label: "Peta Pohon", ke: "/peta" },
  { label: "Metodologi Dampak", ke: "/metodologi" },
];

const AKUN = [
  { label: "Masuk", ke: "/masuk" },
  { label: "Daftar / Gabung Kelas", ke: "/daftar" },
];

// Kunci 'klasemen' sama dengan beranda, jadi data cukup diambil sekali.
const { data: liga } = await useFetch("/api/klasemen", { key: "klasemen" });
</script>

<template>
  <footer class="border-t border-white/10 bg-tinta">
    <div
      class="mx-auto grid max-w-275 gap-9 px-5 py-10 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12 lg:px-10 lg:py-12"
    >
      <div>
        <div class="flex items-center gap-2.5">
          <span
            class="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[10px] bg-white"
          >
            <LestariEmblem class="h-8 w-8 text-hijau" />
          </span>
          <span class="font-display text-h3 font-bold text-white">LigaLestari</span>
        </div>
        <p
          class="mt-3.5 text-caption font-semibold tracking-[0.14em] text-white/60 uppercase"
        >
          Satu musim, satu aksi, satu bumi.
        </p>
        <p class="mt-2.5 max-w-70 text-small text-white/70">
          Liga misi hijau antar-kelas: setor sampah, tanam pohon, dan rebut
          puncak klasemen bersama teman sekelasmu.
        </p>
        <p
          v-if="liga"
          class="mt-4 font-display text-caption font-semibold tracking-[0.12em] text-lime uppercase"
        >
          Pekan {{ liga.musim.pekan }}/{{ liga.musim.totalPekan }} ·
          {{ liga.tim[0]?.nama }} memimpin klasemen
        </p>
      </div>

      <nav aria-label="Tautan situs">
        <h2
          class="text-caption font-semibold tracking-[0.14em] text-white/50 uppercase"
        >
          Jelajahi
        </h2>
        <ul class="mt-3.5 flex flex-col">
          <li v-for="t in JELAJAHI" :key="t.ke">
            <NuxtLink
              :to="t.ke"
              class="inline-block py-1.75 text-small font-medium text-white/80 hover:text-lime"
            >
              {{ t.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <nav aria-label="Akun">
        <h2
          class="text-caption font-semibold tracking-[0.14em] text-white/50 uppercase"
        >
          Ikut Bertanding
        </h2>
        <ul class="mt-3.5 flex flex-col">
          <li v-for="t in AKUN" :key="t.ke">
            <NuxtLink
              :to="t.ke"
              class="inline-block py-1.75 text-small font-medium text-white/80 hover:text-lime"
            >
              {{ t.label }}
            </NuxtLink>
          </li>
        </ul>
        <p class="mt-3 max-w-60 text-caption text-white/55">
          Kode kelas didapat dari wali kelas atau admin sekolahmu.
        </p>
      </nav>
    </div>

    <div class="border-t border-white/10">
      <div
        class="mx-auto flex max-w-275 flex-col gap-1.5 px-5 py-4.5 text-caption text-white/55 lg:flex-row lg:items-center lg:justify-between lg:px-10"
      >
        <p>© 2026 Bendi Tandayu Saputra</p>
        <p>
          Subtema INVENTION 2026 — Going Green Through Smart Digital Solutions
        </p>
      </div>
    </div>
  </footer>
</template>
