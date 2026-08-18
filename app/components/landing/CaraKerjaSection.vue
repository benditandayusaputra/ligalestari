<script setup lang="ts">
const LANGKAH = [
  {
    judul: 'Ikut event kelas',
    teks: 'Wali kelas atau admin sekolah membuka event: Setoran Sampah atau Tanam Pohon.',
  },
  {
    judul: 'Kumpulkan Poin Hijau',
    teks: 'Berat sampah terpilah dan jumlah pohon dihitung otomatis menjadi poin kelasmu.',
  },
  {
    judul: 'Naik klasemen',
    teks: 'Pantau posisi kelasmu tiap pekan dan pertahankan sampai musim berakhir.',
  },
]
</script>

<template>
  <section id="cara" class="px-5 py-12 lg:px-10 lg:py-18">
    <div class="mx-auto max-w-275">
      <div v-anim class="mb-9 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <SectionHeading kicker="Cara Main" judul="Tiga langkah menuju puncak." />
        <NuxtLink
          to="/metodologi"
          class="inline-flex items-center gap-1.5 py-1 text-small font-semibold text-hijau-teks hover:underline"
        >
          Baca cara poin dihitung
          <Icon name="lucide:chevron-right" size="15" aria-hidden="true" />
        </NuxtLink>
      </div>

      <ol class="grid gap-8 md:grid-cols-3 md:gap-x-8">
        <li
          v-for="(langkah, i) in LANGKAH"
          v-anim="(i % 3) * 80"
          :key="langkah.judul"
          class="border-t border-garis-tegas pt-5"
        >
          <span class="angka-outline font-display text-[3.25rem] leading-none font-bold" aria-hidden="true">
            {{ i + 1 }}
          </span>
          <h3 class="mt-3 text-h3 font-semibold">{{ langkah.judul }}</h3>
          <p class="mt-1.5 max-w-70 text-small text-teks-redup">{{ langkah.teks }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
