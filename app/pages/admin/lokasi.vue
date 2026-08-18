<script setup lang="ts">
import type { LokasiSekolah } from '#shared/types'
import { LOKASI_SEKOLAH_BAWAAN } from '#shared/data/peta'

definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Lokasi Peta' })

const { data } = await useFetch('/api/admin/lokasi', { key: 'admin-lokasi' })

const lokasi = ref<LokasiSekolah>({ ...(data.value?.lokasi ?? LOKASI_SEKOLAH_BAWAAN) })
const petaGagal = ref(false)

const status = ref<'diam' | 'menyimpan' | 'tersimpan' | 'gagal'>('diam')

const valid = computed(
  () =>
    Number.isFinite(lokasi.value.lat) && Math.abs(lokasi.value.lat) <= 90 &&
    Number.isFinite(lokasi.value.lng) && Math.abs(lokasi.value.lng) <= 180 &&
    Number.isFinite(lokasi.value.zoom) && lokasi.value.zoom >= 3 && lokasi.value.zoom <= 20,
)

async function simpan() {
  if (!valid.value || status.value === 'menyimpan') return
  status.value = 'menyimpan'
  try {
    const { lokasi: tersimpan } = await $fetch('/api/admin/lokasi', { method: 'PUT', body: lokasi.value })
    lokasi.value = { ...tersimpan }
    status.value = 'tersimpan'
    // Buang cache halaman peta publik agar kunjungan berikutnya memuat pusat baru.
    clearNuxtData('peta')
  } catch {
    status.value = 'gagal'
  }
}

function kembaliKeBawaan() {
  lokasi.value = { ...LOKASI_SEKOLAH_BAWAAN }
  status.value = 'diam'
}
</script>

<template>
  <div>
    <DasborHeader variant="gelap" kicker="Pengaturan" judul="Lokasi Peta Sekolah" />

    <div class="px-4 lg:px-0">
      <section class="mt-3.5 rounded-[18px] border border-garis bg-surface p-4 lg:p-5" aria-label="Pengaturan lokasi sekolah">
        <p class="mb-4 max-w-135 text-[0.8125rem] leading-[1.55] text-teks">
          Titik ini menjadi pusat Peta Persebaran Pohon di halaman publik; semua pin pohon digambar
          skematis di sekitarnya. Klik peta, seret penanda sekolah, atau isi koordinat secara manual.
          Bawaan demo: <strong class="font-bold">SMK Negeri 26 Jakarta</strong> (Rawamangun, Jakarta Timur).
        </p>

        <ClientOnly>
          <PetaPilihLokasi v-if="!petaGagal" v-model="lokasi" @gagal="petaGagal = true" />
          <p
            v-else
            class="rounded-[14px] border border-dashed border-garis-tegas bg-surface-2 px-4 py-6 text-center text-[0.78125rem] font-semibold text-teks-redup"
          >
            Peta pratinjau tidak dapat dimuat (kemungkinan sedang luring). Isi koordinat secara manual
            di bawah; pengaturan tetap bisa disimpan.
          </p>
          <template #fallback>
            <div class="h-72 w-full animate-pulse rounded-[14px] border border-garis bg-surface-2 motion-reduce:animate-none lg:h-85" aria-hidden="true" />
          </template>
        </ClientOnly>

        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <label for="lokasi-lat" class="mb-1.5 block text-xs font-bold text-teks-kuat">Latitude</label>
            <input
              id="lokasi-lat"
              v-model.number="lokasi.lat"
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              class="w-full rounded-xl border border-garis bg-surface-2 px-3.5 py-3 font-display text-sm outline-none focus:border-hijau focus-visible:outline-none"
            />
          </div>
          <div>
            <label for="lokasi-lng" class="mb-1.5 block text-xs font-bold text-teks-kuat">Longitude</label>
            <input
              id="lokasi-lng"
              v-model.number="lokasi.lng"
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              class="w-full rounded-xl border border-garis bg-surface-2 px-3.5 py-3 font-display text-sm outline-none focus:border-hijau focus-visible:outline-none"
            />
          </div>
          <div>
            <label for="lokasi-zoom" class="mb-1.5 block text-xs font-bold text-teks-kuat">Zoom awal (3–20)</label>
            <input
              id="lokasi-zoom"
              v-model.number="lokasi.zoom"
              type="number"
              step="0.5"
              min="3"
              max="20"
              class="w-full rounded-xl border border-garis bg-surface-2 px-3.5 py-3 font-display text-sm outline-none focus:border-hijau focus-visible:outline-none"
            />
          </div>
        </div>

        <div class="mt-4.5 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            class="rounded-[11px] bg-hijau px-5 py-2.75 text-[0.8125rem] font-bold text-white hover:bg-hijau-pekat disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!valid || status === 'menyimpan'"
            @click="simpan"
          >
            {{ status === 'menyimpan' ? 'Menyimpan…' : 'Simpan lokasi' }}
          </button>
          <button
            type="button"
            class="rounded-[11px] border border-garis-tegas bg-surface px-4 py-2.75 text-[0.8125rem] font-bold text-teks hover:bg-surface-2"
            @click="kembaliKeBawaan"
          >
            Kembali ke bawaan
          </button>
          <span v-if="status === 'tersimpan'" class="flex items-center gap-1.5 text-[0.78125rem] font-bold text-hijau-teks" role="status">
            <Icon name="lucide:check" size="15" aria-hidden="true" /> Tersimpan, peta publik memakai pusat baru.
          </span>
          <span v-else-if="status === 'gagal'" class="text-[0.78125rem] font-bold text-[#C2410C]" role="status">
            Gagal menyimpan. Coba lagi.
          </span>
          <span v-else-if="!valid" class="text-[0.78125rem] font-semibold text-teks-samar">
            Koordinat di luar rentang yang sah.
          </span>
        </div>
      </section>
    </div>
  </div>
</template>
