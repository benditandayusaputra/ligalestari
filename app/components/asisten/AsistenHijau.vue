<script setup lang="ts">
/**
 * Widget Asisten Hijau global: tombol mengambang (FAB) di kanan bawah
 * semua halaman, membuka panel chat. Dipasang sekali di app.vue.
 */
const route = useRoute()
const buka = ref(false)

// Halaman chat penuh di dasbor sudah menjadi asistennya sendiri.
const sembunyi = computed(() => route.path === '/dasbor/asisten')

// Di area dasbor versi ponsel ada bilah tab bawah, angkat FAB di atasnya.
const diDasbor = computed(() => route.path.startsWith('/dasbor') || route.path.startsWith('/admin'))
</script>

<template>
  <div v-if="!sembunyi">
    <!-- Latar redup di ponsel saat panel terbuka -->
    <Transition
      enter-active-class="transition-opacity duration-200 motion-reduce:transition-none"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 motion-reduce:transition-none"
      leave-to-class="opacity-0"
    >
      <div v-show="buka" class="fixed inset-0 z-40 bg-tinta/40 sm:hidden" aria-hidden="true" @click="buka = false" />
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
      enter-from-class="translate-y-6 opacity-0 sm:translate-y-2 sm:scale-95"
      leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
      leave-to-class="translate-y-6 opacity-0 sm:translate-y-2 sm:scale-95"
    >
      <!-- v-show agar riwayat percakapan bertahan selama sesi -->
      <AsistenPanel v-show="buka" :buka="buka" @tutup="buka = false" />
    </Transition>

    <Transition
      enter-active-class="transition duration-200 motion-reduce:transition-none"
      enter-from-class="scale-50 opacity-0"
      leave-active-class="transition duration-150 motion-reduce:transition-none"
      leave-to-class="scale-50 opacity-0"
    >
      <AsistenFab
        v-show="!buka"
        class="fixed right-4 z-50 sm:right-6 sm:bottom-6"
        :class="diDasbor ? 'bottom-24' : 'bottom-4'"
        @klik="buka = true"
      />
    </Transition>
  </div>
</template>
