<script setup lang="ts">
definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Notifikasi' })

const { data } = await useFetch('/api/dasbor', { key: 'dasbor' })
const NOTIFIKASI = computed(() => data.value?.notifikasi ?? [])
const belumDibaca = computed(() => NOTIFIKASI.value.filter((n) => n.belumDibaca).length)
</script>

<template>
  <div>
    <DasborHeader variant="polos" judul="Notifikasi" :sub="`${belumDibaca} belum dibaca`" />

    <ul class="flex flex-col gap-2.5 px-4 pt-3.5 lg:px-0">
      <li
        v-for="n in NOTIFIKASI"
        :key="n.judul"
        class="flex gap-3 rounded-2xl border border-garis p-3.5"
        :class="n.belumDibaca ? 'bg-hijau-pucat' : 'bg-surface'"
        :style="{ '--warna-notifikasi': n.warna, ...teksMerek(n.warna) }"
      >
        <span class="ikon-notifikasi flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon :name="n.ikon" size="19" class="teks-merek" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="mb-0.75 flex items-center gap-2">
            <span class="teks-merek text-[0.59375rem] font-bold tracking-[0.04em] uppercase">{{ n.tag }}</span>
            <span v-if="n.belumDibaca" class="h-1.5 w-1.5 shrink-0 rounded-full bg-hijau-terang" aria-hidden="true" />
            <span v-if="n.belumDibaca" class="sr-only">Belum dibaca.</span>
            <span class="ml-auto text-[0.625rem] text-teks-samar">{{ n.waktu }}</span>
          </div>
          <h2 class="mb-0.5 text-[0.84375rem] leading-tight font-bold">{{ n.judul }}</h2>
          <p class="text-xs leading-[1.4] text-teks-redup">{{ n.isi }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ikon-notifikasi {
  background-color: color-mix(in srgb, var(--warna-notifikasi) 10%, transparent);
}

:global(.dark) .ikon-notifikasi {
  background-color: color-mix(in srgb, var(--warna-notifikasi) 20%, transparent);
}
</style>
