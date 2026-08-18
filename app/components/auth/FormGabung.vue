<script setup lang="ts">
import { cariKelas } from '#shared/data/akun-demo'

const emit = defineEmits<{ ganti: [layar: 'masuk'] }>()

const kode = ref('')
const galat = ref('')
const memuat = ref(false)
const kelasBerhasil = ref<string | null>(null)

watch(kode, () => (galat.value = ''))

const PESAN_KODE_SALAH = 'Kode tidak ditemukan. Periksa lagi atau minta kode baru ke admin/guru.'

// Fallback lokal hanya untuk hosting statis (penjaga rute nonaktif).
const authWajib = useRuntimeConfig().public.authWajib

/** Cek kode lewat API; di hosting statis divalidasi lokal. */
async function kirim() {
  if (!kode.value.trim()) {
    galat.value = 'Masukkan kode gabung dulu.'
    return
  }
  if (memuat.value) return

  memuat.value = true
  try {
    const { kelas } = await $fetch('/api/auth/gabung', { method: 'POST', body: { kode: kode.value } })
    kelasBerhasil.value = kelas.nama
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode
    if (status === 404) {
      galat.value = PESAN_KODE_SALAH
      return
    }
    if (!authWajib) {
      const kelas = cariKelas(kode.value)
      if (kelas) kelasBerhasil.value = kelas.nama
      else galat.value = PESAN_KODE_SALAH
      return
    }
    galat.value = status
      ? `Server bermasalah (kode ${status}). Coba lagi sebentar lagi.`
      : 'Tidak bisa menghubungi server. Muat ulang halaman, lalu coba lagi.'
  } finally {
    memuat.value = false
  }
}
</script>

<template>
  <PanelSukses
    v-if="kelasBerhasil"
    :judul="`Berhasil gabung ke ${kelasBerhasil}!`"
    teks="Kamu resmi jadi bagian tim. Ayo kumpulkan Poin Hijau."
    cta-ke="/dasbor"
    cta-label="Lihat Klasemen"
  />

  <div v-else>
    <div class="text-center">
      <div
        class="mx-auto mb-5 flex h-29.5 w-29.5 items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_40%,#EAF3EC,#DDEBE0)]"
      >
        <Icon name="lucide:user-plus" size="52" class="text-hijau-teks" aria-hidden="true" />
      </div>
      <h1 class="text-2xl font-bold tracking-[-0.02em] lg:text-[1.6875rem]">Belum punya kelas</h1>
      <p class="mx-auto mt-2 max-w-75 text-sm leading-[1.55] text-teks-redup">
        Masukkan kode gabung dari wali kelas atau admin untuk masuk ke timmu.
      </p>
    </div>

    <form class="mt-5.5 flex flex-col gap-3" novalidate @submit.prevent="kirim">
      <AlertGalat v-if="galat" :pesan="galat" />

      <div>
        <label
          for="gabung-kode"
          class="mb-2 block text-center text-[0.6875rem] font-bold tracking-[0.04em] text-teks-redup uppercase"
        >
          Kode gabung kelas
        </label>
        <input
          id="gabung-kode"
          v-model="kode"
          type="text"
          placeholder="MASUKKAN KODE"
          class="w-full rounded-[14px] border-[1.5px] border-mint-garis bg-hijau-pucat p-4.5 text-center font-display text-xl font-bold tracking-widest text-hijau-pekat uppercase transition outline-none focus:border-hijau focus:shadow-[0_0_0_3px_rgba(14,107,70,0.18)] focus-visible:outline-none"
        />
      </div>

      <button
        type="submit"
        :disabled="memuat"
        :aria-busy="memuat"
        class="flex w-full items-center justify-center gap-2 rounded-[14px] bg-hijau p-3.75 text-[0.9375rem] font-bold text-white transition-colors hover:bg-hijau-pekat disabled:cursor-progress disabled:bg-hijau-pekat"
      >
        <Icon
          v-if="memuat"
          name="lucide:loader-circle"
          size="18"
          class="animate-spin text-lime motion-reduce:animate-none"
          aria-hidden="true"
        />
        {{ memuat ? 'Memeriksa kode…' : 'Gabung Sekarang' }}
      </button>
    </form>

    <p class="mt-4 text-center text-[0.8125rem]">
      <button type="button" class="font-bold text-hijau-teks hover:underline" @click="emit('ganti', 'masuk')">
        Kembali ke Masuk
      </button>
    </p>
  </div>
</template>
