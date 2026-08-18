<template>
  <div class="flex min-h-dvh flex-col">
    <!-- Tautan lompat untuk pengguna pembaca layar / navigasi keyboard -->
    <a
      href="#konten"
      class="sr-only z-50 rounded-lg bg-hijau px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Lewati ke konten utama
    </a>

    <AppNavbar />
    <main id="konten" class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
