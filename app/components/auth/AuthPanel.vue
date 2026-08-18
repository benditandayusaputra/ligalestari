<script setup lang="ts">
type Layar = 'masuk' | 'daftar' | 'gabung' | 'lupa'

const props = defineProps<{ layarAwal: Layar }>()

// Layar "masuk" dan "daftar" punya rute sendiri; "gabung" dan "lupa"
// berpindah di dalam halaman lewat event `ganti` dari tiap form.
const layar = ref<Layar>(props.layarAwal)
</script>

<template>
  <div class="flex min-h-dvh bg-krem text-teks-kuat">
    <AuthBrandPanel />

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Logo untuk tampilan tanpa panel kiri -->
      <NuxtLink to="/" class="flex items-center gap-2.25 self-start px-5 pt-5 lg:hidden" aria-label="LigaLestari, beranda">
        <LestariEmblem class="h-9 w-9 text-hijau-teks" />
        <span class="font-display text-lg font-bold tracking-[-0.02em]">LigaLestari</span>
      </NuxtLink>

      <div class="flex flex-1 items-center justify-center px-5 py-7 lg:px-13 lg:py-11">
        <div class="w-full max-w-110">
          <Transition name="naik" mode="out-in">
            <FormMasuk v-if="layar === 'masuk'" @ganti="layar = $event" />
            <FormDaftar v-else-if="layar === 'daftar'" />
            <FormGabung v-else-if="layar === 'gabung'" @ganti="layar = $event" />
            <FormLupa v-else @ganti="layar = $event" />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
