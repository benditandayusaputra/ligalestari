<script setup lang="ts">
import { cariKelas } from '#shared/data/akun-demo'

const nama = ref('')
const pengguna = ref('')
const sandi = ref('')
const sandi2 = ref('')
const kode = ref('')
const galat = ref('')
const memuat = ref(false)
const kelasBerhasil = ref<ReturnType<typeof cariKelas>>(null)

watch([nama, pengguna, sandi, sandi2, kode], () => (galat.value = ''))

/** Skor kekuatan password 1-4 beserta label & warnanya. */
const kekuatan = computed(() => {
  const s = sandi.value
  if (!s) return null
  let skor = 0
  if (s.length >= 6) skor++
  if (s.length >= 10) skor++
  if (/[a-z]/.test(s) && /[A-Z]/.test(s)) skor++
  if (/\d/.test(s)) skor++
  if (/[^A-Za-z0-9]/.test(s)) skor++
  skor = Math.min(4, Math.max(1, skor))
  const peta = {
    1: { label: 'Lemah', warna: '#C0392B', kelasTeks: 'text-[#B91C1C] dark:text-[#F28B82]' },
    2: { label: 'Cukup', warna: '#E6B422', kelasTeks: 'text-[#8A6508] dark:text-[#F2CE52]' },
    3: { label: 'Kuat', warna: '#4cc38a', kelasTeks: 'text-hijau-teks' },
    4: { label: 'Sangat kuat', warna: '#0e6b46', kelasTeks: 'text-hijau-teks' },
  } as const
  return { skor, ...peta[skor as 1 | 2 | 3 | 4] }
})

const PESAN_KODE_SALAH = 'Kode gabung kelas tidak ditemukan. Minta kode yang benar ke admin/guru.'

const sesi = useUserSession()
// Fallback lokal hanya untuk hosting statis (penjaga rute nonaktif);
// kegagalan server sungguhan harus tampil sebagai galat, bukan sukses palsu.
const authWajib = useRuntimeConfig().public.authWajib

/** Daftarkan akun lewat API (tabel profil); fallback lokal saat statis. */
async function kirim() {
  if (!nama.value.trim() || !pengguna.value.trim() || !sandi.value || !kode.value.trim()) {
    galat.value = 'Lengkapi semua kolom wajib terlebih dahulu.'
    return
  }
  if (sandi.value.length < 6) {
    galat.value = 'Password minimal 6 karakter.'
    return
  }
  if (sandi.value !== sandi2.value) {
    galat.value = 'Konfirmasi password belum cocok.'
    return
  }
  if (memuat.value) return

  memuat.value = true
  try {
    const { kelas } = await $fetch('/api/auth/daftar', {
      method: 'POST',
      body: { nama: nama.value, pengguna: pengguna.value, sandi: sandi.value, kode: kode.value },
    })
    await sesi.fetch() // pendaftaran langsung membuat sesi masuk
    kelasBerhasil.value = kelas
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode
    if (status === 404) {
      galat.value = PESAN_KODE_SALAH
      return
    }
    if (status === 409) {
      galat.value = 'Username sudah dipakai. Coba username lain.'
      return
    }
    if (!authWajib) {
      const kelas = cariKelas(kode.value)
      if (kelas) kelasBerhasil.value = kelas
      else galat.value = PESAN_KODE_SALAH
      return
    }
    galat.value = status
      ? `Server pendaftaran bermasalah (kode ${status}). Coba lagi sebentar lagi.`
      : 'Tidak bisa menghubungi server. Muat ulang halaman, lalu coba lagi.'
  } finally {
    memuat.value = false
  }
}
</script>

<template>
  <PanelSukses v-if="kelasBerhasil" judul="Berhasil gabung!" teks="Kamu sekarang anggota" cta-ke="/dasbor" cta-label="Lihat Klasemen">
    <div class="mt-3.5 inline-flex items-center gap-2.25 rounded-[14px] border border-garis bg-surface px-4 py-2.5">
      <span
        class="flex h-8.5 w-8.5 items-center justify-center rounded-[10px] font-display text-xs font-bold"
        :style="gayaEmblem(kelasBerhasil.warna)"
      >
        {{ kelasBerhasil.emblem }}
      </span>
      <span class="font-display text-base font-bold">{{ kelasBerhasil.nama }}</span>
    </div>
  </PanelSukses>

  <div v-else>
    <div class="mb-2 flex items-center gap-2.75">
      <NuxtLink
        to="/masuk"
        class="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[11px] bg-krem hover:bg-garis"
        aria-label="Kembali ke halaman Masuk"
      >
        <Icon name="lucide:chevron-left" size="18" aria-hidden="true" />
      </NuxtLink>
      <h1 class="text-2xl font-bold tracking-[-0.02em] lg:text-[1.6875rem]">Daftar Akun Siswa</h1>
    </div>
    <p class="mb-5 text-sm text-teks-redup">Buat akun &amp; langsung gabung ke kelasmu.</p>

    <form class="flex flex-col gap-4" novalidate @submit.prevent="kirim">
      <AlertGalat v-if="galat" :pesan="galat" />

      <InputTeks id="daftar-nama" v-model="nama" label="Nama lengkap" placeholder="mis. Aditya Pratama" autocomplete="name" />
      <InputTeks
        id="daftar-pengguna"
        v-model="pengguna"
        label="Username atau NIS"
        placeholder="mis. aditya.p / 2231045"
        autocomplete="username"
        keterangan="Email tidak wajib — cukup username atau NIS."
      />

      <div>
        <InputSandi
          id="daftar-sandi"
          v-model="sandi"
          label="Password"
          placeholder="Minimal 6 karakter"
          autocomplete="new-password"
        />
        <!-- Meter kekuatan password -->
        <div v-if="kekuatan" class="mt-2.5 flex items-center gap-2.25">
          <div class="flex flex-1 gap-1.25">
            <div
              v-for="i in 4"
              :key="i"
              class="h-1.25 flex-1 rounded-full"
              :style="{ background: i <= kekuatan.skor ? kekuatan.warna : '#E4E1D7' }"
            />
          </div>
          <span class="min-w-18.5 text-right text-[0.6875rem] font-bold" :class="kekuatan.kelasTeks">
            {{ kekuatan.label }}
          </span>
        </div>
      </div>

      <InputSandi
        id="daftar-sandi2"
        v-model="sandi2"
        label="Konfirmasi password"
        placeholder="Ulangi password"
        autocomplete="new-password"
      />

      <div>
        <label for="daftar-kode" class="mb-1.75 block text-[0.6875rem] font-bold tracking-[0.04em] text-teks-redup uppercase">
          Kode gabung kelas
        </label>
        <div class="relative">
          <input
            id="daftar-kode"
            v-model="kode"
            type="text"
            placeholder="mis. RPL1-7K2M"
            class="w-full rounded-xl border-[1.5px] border-mint-garis bg-hijau-pucat py-3.25 pr-11 pl-3.5 font-display text-[0.9375rem] font-bold tracking-[0.04em] text-hijau-pekat uppercase transition outline-none placeholder:normal-case focus:border-hijau focus:shadow-[0_0_0_3px_rgba(14,107,70,0.18)] focus-visible:outline-none"
          />
          <Icon
            name="lucide:qr-code"
            size="18"
            class="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-hijau-teks"
            aria-hidden="true"
          />
        </div>
        <p class="mt-1.5 text-[0.71875rem] text-teks-samar">Minta kode ke admin/guru kelasmu.</p>
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
        {{ memuat ? 'Mendaftarkan…' : 'Daftar & Gabung Kelas' }}
      </button>
    </form>

    <p class="mt-4.5 text-center text-[0.8125rem] text-teks-redup">
      Sudah punya akun?
      <NuxtLink to="/masuk" class="font-bold text-hijau-teks hover:underline">Masuk</NuxtLink>
    </p>
  </div>
</template>
