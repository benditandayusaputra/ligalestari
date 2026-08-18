<script setup lang="ts">
/** Layar keberhasilan bersama untuk alur masuk/daftar/gabung. */
defineProps<{
  judul: string
  teks?: string
  ctaLabel?: string
  /** Tujuan tombol utama (default beranda). */
  ctaKe?: string
}>()
</script>

<template>
  <div class="py-2 text-center">
    <div class="anim-pop mx-auto mb-4.5 flex h-21 w-21 items-center justify-center rounded-full bg-hijau-pucat">
      <div class="flex h-14.5 w-14.5 items-center justify-center rounded-full bg-hijau">
        <Icon name="lucide:check" size="29" class="text-lime" aria-hidden="true" />
      </div>
    </div>
    <h1 class="font-display text-[1.4375rem] font-bold">{{ judul }}</h1>
    <p v-if="teks" class="mx-auto mt-1.5 max-w-75 text-sm text-teks-redup">{{ teks }}</p>

    <!-- Tempat konten tambahan, mis. kartu kelas yang berhasil diikuti -->
    <slot />

    <NuxtLink
      :to="ctaKe ?? '/'"
      class="mt-6 block w-full rounded-[14px] bg-hijau p-3.75 text-center text-[0.9375rem] font-bold text-white hover:bg-hijau-pekat"
    >
      {{ ctaLabel ?? 'Kembali ke Beranda' }}
    </NuxtLink>
  </div>
</template>
