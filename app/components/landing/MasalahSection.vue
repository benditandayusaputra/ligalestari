<template>
  <section class="bg-tinta px-5 py-12 text-white lg:px-10 lg:py-18">
    <div class="mx-auto grid max-w-275 items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div v-anim>
        <p class="text-caption font-semibold tracking-[0.14em] text-lime uppercase">Kenapa LigaLestari</p>
        <h2 class="mt-2 text-h2 font-bold tracking-[-0.015em]">Imbauan saja tidak cukup.</h2>
        <p class="mt-4 max-w-130 text-body text-white/78">
          Poster hemat plastik dan slogan buang sampah pada tempatnya sering berhenti jadi
          hiasan dinding sekolah, dibaca sekali, lalu dilupakan.
        </p>
        <p class="mt-5 max-w-130 border-l-2 border-lime pl-4 text-body font-medium text-white">
          LigaLestari memberi kelas alasan untuk benar-benar bergerak: tiap kilogram sampah terpilah
          dan tiap pohon tertanam dihitung jadi poin, dan poin menentukan siapa juara sekolah.
        </p>
      </div>

      <!-- Data timbulan sampah nasional, sumber: SIPSN KLHK, 2023 -->
      <div v-anim="110" class="flex flex-col gap-5">
        <div class="border-t border-white/15 pt-4">
          <div class="font-display text-[2.75rem] leading-none font-bold">
            33,86<span class="ml-1.5 text-lead font-semibold text-white/70">juta ton</span>
          </div>
          <p class="mt-2 text-small text-white/70">sampah dihasilkan Indonesia setiap tahun</p>
        </div>

        <div class="border-t border-white/15 pt-4">
          <div class="font-display text-[2.75rem] leading-none font-bold text-lime">
            59,82<span class="ml-1.5 text-lead font-semibold text-white/70">%</span>
          </div>
          <p class="mt-2 text-small text-white/70">sampah yang sudah terkelola dengan baik</p>
          <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-white/12" aria-hidden="true">
            <div class="h-full w-[59.82%] rounded-full bg-lime" />
          </div>
          <p class="mt-2 text-caption text-white/60">sisanya menumpuk di TPA atau lepas ke lingkungan</p>
        </div>

        <p class="text-caption text-white/60">Sumber: SIPSN KLHK, 2023</p>
      </div>
    </div>
  </section>
</template>
