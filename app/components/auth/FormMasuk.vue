<script setup lang="ts">
import { validasiAkun, type PeranAkun } from '#shared/data/akun-demo'

const emit = defineEmits<{ ganti: [layar: 'gabung' | 'lupa'] }>()

const peran = ref<PeranAkun>('siswa')
const pengguna = ref('')
const sandi = ref('')
const galat = ref('')
const memuat = ref(false)

watch([pengguna, sandi, peran], () => (galat.value = ''))

const PESAN_SALAH = 'Username atau password salah. Periksa kembali, atau pastikan peran sudah benar.'

const sesi = useUserSession()
// Bila penjaga rute aktif, sukses palsu tanpa sesi hanya membuat tombol
// lanjut ditolak middleware tanpa pesan — jadi fallback lokal khusus
// hosting statis TIDAK boleh menyamarkan kegagalan server.
const authWajib = useRuntimeConfig().public.authWajib

/** Masuk lewat API lalu langsung ke dasbor; di hosting statis divalidasi lokal. */
async function kirim() {
  const nama = pengguna.value.trim()
  if (!nama || !sandi.value) {
    galat.value = 'Lengkapi username/NIS dan password dulu.'
    return
  }
  if (memuat.value) return

  memuat.value = true
  let lolos = false
  try {
    await $fetch('/api/auth/masuk', {
      method: 'POST',
      body: { pengguna: nama, sandi: sandi.value, peran: peran.value },
    })
    await sesi.fetch() // muat sesi baru agar penjaga rute mengenalinya
    // Tanpa sesi terbaca, penjaga rute akan menolak dasbor tanpa pesan.
    if (authWajib && !sesi.loggedIn.value) {
      galat.value = 'Sesi tidak tersimpan di browser. Izinkan cookie untuk situs ini, lalu coba lagi.'
    } else {
      lolos = true
    }
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode
    if (status === 401) {
      galat.value = PESAN_SALAH
    } else if (!authWajib) {
      // Hosting statis: tidak ada API sesi, pakai aturan validasi yang sama.
      if (validasiAkun(nama, sandi.value, peran.value)) lolos = true
      else galat.value = PESAN_SALAH
    } else {
      galat.value = status
        ? `Server autentikasi bermasalah (kode ${status}). Coba lagi sebentar lagi.`
        : 'Tidak bisa menghubungi server. Muat ulang halaman, lalu coba lagi.'
    }
  } finally {
    memuat.value = false
  }

  if (lolos) await navigateTo(peran.value === 'admin' ? '/admin' : '/dasbor')
}
</script>

<template>
  <div>
    <h1 class="mb-1.5 text-2xl font-bold tracking-[-0.02em] lg:text-[1.6875rem]">Masuk</h1>
    <p class="mb-5.5 text-sm text-teks-redup">Selamat datang kembali di LigaLestari.</p>

    <!-- Pilihan peran -->
    <div class="mb-5 flex gap-1 rounded-[13px] bg-surface-3 p-1" role="group" aria-label="Pilih peran">
      <button
        v-for="p in (['siswa', 'admin'] as const)"
        :key="p"
        type="button"
        :aria-pressed="peran === p"
        class="flex-1 cursor-pointer rounded-[10px] p-2.75 text-[0.84375rem] font-bold capitalize transition-colors"
        :class="peran === p ? 'bg-hijau text-white' : 'text-teks-redup hover:text-teks-kuat'"
        @click="peran = p"
      >
        {{ p }}
      </button>
    </div>

    <form class="flex flex-col gap-4" novalidate @submit.prevent="kirim">
      <AlertGalat v-if="galat" :pesan="galat" />

      <InputTeks
        id="masuk-pengguna"
        v-model="pengguna"
        label="Username atau NIS"
        placeholder="mis. aditya.p / 2231045"
        autocomplete="username"
      />

      <div>
        <InputSandi
          id="masuk-sandi"
          v-model="sandi"
          label="Password"
          placeholder="Masukkan password"
          autocomplete="current-password"
        />
        <div class="mt-2 text-right">
          <button type="button" class="text-[0.78125rem] font-bold text-hijau-teks hover:underline" @click="emit('ganti', 'lupa')">
            Lupa password?
          </button>
        </div>
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
        {{ memuat ? 'Sedang masuk…' : 'Masuk' }}
      </button>
    </form>

    <p class="mt-4.5 text-center text-[0.8125rem] text-teks-redup">
      Belum punya akun?
      <NuxtLink to="/daftar" class="font-bold text-hijau-teks hover:underline">Daftar</NuxtLink>
      ·
      <button type="button" class="font-bold text-hijau-teks hover:underline" @click="emit('ganti', 'gabung')">
        Punya kode kelas?
      </button>
    </p>

    <div
      class="mt-5 rounded-xl border border-dashed border-mint-garis bg-hijau-pucat px-3.25 py-2.75 text-[0.71875rem] leading-[1.6] text-teks"
    >
      <strong class="text-hijau-teks">Mode demo</strong> · Siswa:
      <code class="font-display">aditya.p / hijau123</code> · Admin:
      <code class="font-display">admin / admin123</code>
    </div>
  </div>
</template>
