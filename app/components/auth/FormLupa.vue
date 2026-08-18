<script setup lang="ts">
const emit = defineEmits<{ ganti: [layar: 'masuk'] }>()

const pengguna = ref('')
const terkirim = ref(false)

function kirim() {
  if (pengguna.value.trim()) terkirim.value = true
}
</script>

<template>
  <div>
    <div class="mb-2 flex items-center gap-2.75">
      <button
        type="button"
        class="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[11px] bg-krem hover:bg-garis"
        aria-label="Kembali ke halaman Masuk"
        @click="emit('ganti', 'masuk')"
      >
        <Icon name="lucide:chevron-left" size="18" aria-hidden="true" />
      </button>
      <h1 class="text-2xl font-bold tracking-[-0.02em] lg:text-[1.6875rem]">Lupa Password</h1>
    </div>

    <!-- Setelah permintaan dicatat -->
    <div v-if="terkirim" class="pt-3.5 pb-1 text-center">
      <div class="anim-pop mx-auto mb-4 flex h-18.5 w-18.5 items-center justify-center rounded-full bg-hijau-pucat">
        <Icon name="lucide:circle-check" size="34" class="text-hijau-teks" aria-hidden="true" />
      </div>
      <h2 class="font-display text-[1.1875rem] font-bold">Permintaan dicatat</h2>
      <p class="mx-auto mt-2 max-w-80 text-[0.84375rem] leading-[1.6] text-teks-redup">
        Tunjukkan username <strong class="text-teks-kuat">{{ pengguna }}</strong> ke admin atau wali
        kelasmu untuk mereset password secara manual.
      </p>
      <button
        type="button"
        class="mt-5.5 w-full rounded-[14px] bg-hijau p-3.75 text-[0.9375rem] font-bold text-white transition-colors hover:bg-hijau-pekat"
        @click="emit('ganti', 'masuk')"
      >
        Kembali ke Masuk
      </button>
    </div>

    <template v-else>
      <p class="mb-4.5 text-sm text-teks-redup">Reset password LigaLestari dilakukan oleh admin/guru.</p>

      <div class="mb-4.5 flex items-start gap-2.5 rounded-[14px] border border-mint-garis bg-hijau-pucat p-3.5">
        <Icon name="lucide:info" size="20" class="mt-px shrink-0 text-hijau-teks" aria-hidden="true" />
        <p class="text-[0.78125rem] leading-[1.55] text-teks">
          LigaLestari tidak memakai email. Untuk reset password,
          <strong class="text-hijau-teks">hubungi admin atau wali kelasmu</strong> dan tunjukkan
          username/NIS di bawah.
        </p>
      </div>

      <form class="flex flex-col gap-4.5" novalidate @submit.prevent="kirim">
        <InputTeks
          id="lupa-pengguna"
          v-model="pengguna"
          label="Username atau NIS"
          placeholder="mis. aditya.p / 2231045"
          autocomplete="username"
        />
        <button
          type="submit"
          class="w-full rounded-[14px] bg-hijau p-3.75 text-[0.9375rem] font-bold text-white transition-colors hover:bg-hijau-pekat"
        >
          Kirim Permintaan Reset
        </button>
      </form>

      <p class="mt-4 text-center text-[0.8125rem]">
        <button type="button" class="font-bold text-hijau-teks hover:underline" @click="emit('ganti', 'masuk')">
          Kembali ke Masuk
        </button>
      </p>
    </template>
  </div>
</template>
