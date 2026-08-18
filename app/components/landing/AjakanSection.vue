<template>
  <section class="garis-lapangan bg-tinta px-5 py-14 lg:px-10 lg:py-20">
    <div v-anim class="mx-auto max-w-275">
      <h2 class="max-w-160 text-h1 font-bold tracking-[-0.02em] text-white text-balance">
        Musim ini masih berjalan. Bawa kelasmu naik.
      </h2>
      <p class="mt-4 max-w-120 text-body text-white/75">
        Gratis untuk sekolah. Daftar, masukkan kode kelas dari gurumu, dan mulai kumpulkan
        Poin Hijau pekan ini juga.
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
        <NuxtLink
          to="/daftar"
          class="group inline-flex items-center gap-2 rounded-xl bg-lime px-7 py-3.75 text-body font-bold text-tinta hover:bg-daun"
        >
          Daftar Sekarang
          <Icon
            name="lucide:arrow-right"
            size="18"
            class="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </NuxtLink>
        <NuxtLink to="/masuk" class="py-2 text-body font-semibold text-white/85 underline-offset-4 hover:text-lime hover:underline">
          Sudah punya akun? Masuk
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
