<script setup lang="ts">
import type { Artikel } from '#shared/types'
import { KATEGORI } from '#shared/data/artikel'

const props = defineProps<{
  artikel: Artikel
  /** Kartu unggulan (artikel pertama): layout horizontal lebar di layar besar. */
  unggulan?: boolean
}>()

const kategori = computed(() => KATEGORI[props.artikel.kategori])
</script>

<template>
  <NuxtLink
    :to="`/artikel/${artikel.slug}`"
    class="flex flex-col overflow-hidden rounded-[18px] border border-garis bg-surface transition hover:-translate-y-0.75 hover:shadow-[0_14px_32px_rgba(20,32,22,0.12)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    :class="unggulan && 'lg:flex-row'"
  >
    <!-- Ilustrasi SVG inline per artikel (tanpa foto agar halaman tetap ringan) -->
    <div
      class="relative h-37.5 shrink-0 overflow-hidden"
      :class="unggulan && 'lg:h-auto lg:w-[45%]'"
      :style="{ backgroundColor: kategori.thumbBg }"
      role="img"
      :aria-label="`Ilustrasi: ${artikel.thumb.alt}`"
    >
      <IlustrasiArtikel :slug="artikel.slug" :kategori="artikel.kategori" />
      <span
        class="absolute top-3 left-3 rounded-md px-2.5 py-1 text-caption font-semibold"
        :style="{ background: kategori.chipBg, color: kategori.chipTeks }"
      >
        {{ kategori.label }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-4.5 pb-5" :class="unggulan && 'lg:justify-center lg:p-7'">
      <h2
        class="mb-2 leading-[1.3] font-semibold"
        :class="unggulan ? 'text-h3 lg:text-h2 lg:tracking-[-0.015em]' : 'text-h3'"
      >
        {{ artikel.judul }}
      </h2>
      <p
        class="mb-4 flex-1 text-teks-redup"
        :class="unggulan ? 'text-small lg:flex-none lg:text-body' : 'text-small'"
      >
        {{ artikel.ringkasan }}
      </p>
      <div class="flex items-center gap-1.75 text-caption font-normal text-teks-samar">
        <Icon name="lucide:clock" size="14" aria-hidden="true" />
        <span>{{ artikel.menitBaca }} menit baca</span>
      </div>
    </div>
  </NuxtLink>
</template>
