<script setup lang="ts">
const props = defineProps<{
  dampak: { sampahKg: number; pohon: number; co2Kg: number }
  jumlahKelas: number
}>()

const STATISTIK = [
  { nilai: props.dampak.sampahKg, satuan: 'kg', label: 'sampah terpilah & terkelola' },
  { nilai: props.dampak.pohon, satuan: '', label: 'pohon ditanam di area sekolah' },
  { nilai: props.dampak.co2Kg, satuan: 'kg', label: 'estimasi CO₂ terserap per tahun' },
]
</script>

<template>
  <section id="dampak" class="bg-hijau-pekat px-5 py-12 lg:px-10 lg:py-18">
    <div class="mx-auto max-w-275">
      <div v-anim class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <SectionHeading gelap kicker="Dampak Sejauh Ini" judul="Angka yang terus bertumbuh." />
        <p class="text-small text-white/75">
          Dikumpulkan {{ jumlahKelas }} kelas sejak pekan pertama musim ini.
        </p>
      </div>

      <dl class="mt-9 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/15">
        <div
          v-for="(stat, i) in STATISTIK"
          v-anim="(i % 3) * 80"
          :key="stat.label"
          class="flex flex-col-reverse gap-2.5 md:px-8 md:first:pl-0 md:last:pr-0"
        >
          <dt class="text-small font-medium text-lime">{{ stat.label }}</dt>
          <dd class="font-display text-[clamp(2.5rem,2rem+1.6vw,3.375rem)] leading-none font-bold text-white">
            <CountUp :nilai="stat.nilai" /><span v-if="stat.satuan" class="ml-1.5 text-lead font-semibold text-white/70">{{ stat.satuan }}</span>
          </dd>
        </div>
      </dl>

      <div v-anim class="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5">
        <NuxtLink to="/peta" class="inline-flex items-center gap-1.5 text-small font-semibold text-lime hover:underline">
          Lihat peta persebaran pohon
          <Icon name="lucide:chevron-right" size="15" aria-hidden="true" />
        </NuxtLink>
        <NuxtLink to="/metodologi" class="inline-flex items-center gap-1.5 text-small font-semibold text-lime hover:underline">
          Baca metodologi perhitungannya
          <Icon name="lucide:chevron-right" size="15" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
