<script setup lang="ts">
import type { KategoriSampah, SetoranSampah } from '#shared/types'
import { DAFTAR_KATEGORI, KATEGORI_SAMPAH, poinSetoran, validasiSetoran } from '#shared/data/kategori-sampah'

definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Setor Sampah' })

const [{ data: liga }, { data: setoran }] = await Promise.all([
  useFetch('/api/klasemen', { key: 'klasemen' }),
  useFetch('/api/admin/setoran', { key: 'admin-setoran' }),
])
if (!liga.value || !setoran.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data setoran tidak tersedia' })
}

const KLASEMEN = liga.value.tim
const transaksi = ref<SetoranSampah[]>([...setoran.value.transaksi])

const kelas = ref(KLASEMEN[0]!.nama)
const kategori = ref<KategoriSampah>('plastik')
const berat = ref('')
const pesanSalah = ref('')

const infoKategori = computed(() => KATEGORI_SAMPAH[kategori.value])
const kgBersih = computed(() => Number.parseFloat(berat.value) || 0)
const perkiraanPoin = computed(() => poinSetoran(kgBersih.value, kategori.value))

/**
 * Gaya chip kategori: latar tipis warna semantiknya, teks memakai turunan
 * warna itu yang sudah dijamin lolos kontras di kedua tema (teksMerek).
 */
function gayaChip(k: KategoriSampah) {
  const warna = KATEGORI_SAMPAH[k].warna
  return { ...teksMerek(warna, 0.13), background: `color-mix(in oklab, ${warna} 13%, transparent)` }
}

/** Catat lewat API; di hosting statis dicatat lokal dengan validator & rumus shared yang sama. */
async function catat() {
  const kg = Number.parseFloat(berat.value)
  const salah = validasiSetoran({ kelas: kelas.value, kategori: kategori.value, kg })
  if (salah) {
    pesanSalah.value = salah
    return
  }
  pesanSalah.value = ''
  let baris: SetoranSampah
  try {
    baris = await $fetch('/api/admin/setoran', {
      method: 'POST',
      body: { kelas: kelas.value, kategori: kategori.value, kg },
    })
  } catch {
    baris = {
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      kelas: kelas.value,
      kategori: kategori.value,
      kg: Math.round(kg * 10) / 10,
      poin: poinSetoran(kg, kategori.value),
    }
  }
  transaksi.value.unshift(baris)
  berat.value = ''
}
</script>

<template>
  <div>
    <DasborHeader
      variant="gelap"
      kicker="CRUD · Setoran"
      judul="Setor Sampah"
      sub="6 kategori terpilah · poin = berat × tarif kategori"
    />

    <div class="px-4 lg:px-0">
      <!-- Formulir pencatatan -->
      <form class="mt-3.5 rounded-[18px] border border-garis bg-surface p-4" @submit.prevent="catat">
        <label for="setor-kelas" class="mb-1.75 block text-[0.6875rem] font-bold text-teks-redup uppercase">Kelas / Tim</label>
        <div class="relative mb-3.5">
          <select
            id="setor-kelas"
            v-model="kelas"
            class="w-full cursor-pointer appearance-none rounded-xl border border-garis bg-surface-2 px-3.5 py-3 text-[0.84375rem] font-semibold outline-none focus:border-hijau focus-visible:outline-none"
          >
            <option v-for="t in KLASEMEN" :key="t.id" :value="t.nama">{{ t.nama }}</option>
          </select>
          <Icon name="lucide:chevron-down" size="16" class="pointer-events-none absolute top-3.5 right-3.5 text-teks-samar" aria-hidden="true" />
        </div>

        <label for="setor-kategori" class="mb-1.75 block text-[0.6875rem] font-bold text-teks-redup uppercase">Kategori sampah</label>
        <div class="relative mb-1.75">
          <select
            id="setor-kategori"
            v-model="kategori"
            class="w-full cursor-pointer appearance-none rounded-xl border border-garis bg-surface-2 px-3.5 py-3 text-[0.84375rem] font-semibold outline-none focus:border-hijau focus-visible:outline-none"
          >
            <option v-for="k in DAFTAR_KATEGORI" :key="k" :value="k">
              {{ KATEGORI_SAMPAH[k].label }}, {{ KATEGORI_SAMPAH[k].tarif }} poin/kg
            </option>
          </select>
          <Icon name="lucide:chevron-down" size="16" class="pointer-events-none absolute top-3.5 right-3.5 text-teks-samar" aria-hidden="true" />
        </div>
        <p class="mb-3.5 text-[0.6875rem] text-teks-samar">{{ infoKategori.deskripsi }}</p>

        <label for="setor-berat" class="mb-1.75 block text-[0.6875rem] font-bold text-teks-redup uppercase">Berat (kg)</label>
        <input
          id="setor-berat"
          v-model="berat"
          type="number"
          step="0.1"
          min="0"
          inputmode="decimal"
          placeholder="0,0"
          class="mb-3.5 w-full rounded-xl border border-garis bg-surface-2 px-3.5 py-3 font-display text-lg font-bold outline-none focus:border-hijau focus-visible:outline-none"
        />

        <!-- Pratinjau perhitungan sebelum simpan -->
        <div class="mb-3.5 flex items-center justify-between rounded-xl bg-hijau-pucat px-3.5 py-3">
          <span class="text-xs font-semibold text-teks tabular-nums">
            {{ formatAngka(kgBersih) }} kg × {{ infoKategori.tarif }} poin/kg ({{ infoKategori.label }})
          </span>
          <span class="font-display text-xl font-bold text-hijau-teks tabular-nums">+{{ perkiraanPoin }}</span>
        </div>

        <p v-if="pesanSalah" class="mb-3.5 rounded-xl border border-garis bg-surface-2 px-3.5 py-2.5 text-xs font-semibold text-merah-teks" role="alert">
          {{ pesanSalah }}
        </p>

        <button type="submit" class="w-full rounded-[13px] bg-hijau p-3.5 text-sm font-bold text-white transition-colors hover:bg-hijau-pekat">
          Catat Setoran
        </button>
      </form>

      <!-- Riwayat hari ini -->
      <section aria-label="Transaksi hari ini">
        <h2 class="px-0.5 pt-4.5 pb-2 font-display text-[0.9375rem] font-bold">Transaksi hari ini</h2>
        <div class="overflow-hidden rounded-[18px] border border-garis bg-surface">
          <div class="flex border-b border-garis bg-surface-2 px-3.5 py-2.5 text-[0.625rem] font-bold tracking-[0.04em] text-teks-samar uppercase">
            <span class="w-11">Jam</span>
            <span class="flex-1">Kelas · Kategori</span>
            <span class="w-13.5 text-right">Kg</span>
            <span class="w-13.5 text-right">Poin</span>
          </div>
          <div v-for="(r, i) in transaksi" :key="`${r.waktu}-${i}`" class="flex items-center border-t border-krem px-3.5 py-2.75 first:border-t-0">
            <span class="w-11 text-[0.6875rem] font-semibold text-teks-samar">{{ r.waktu }}</span>
            <span class="min-w-0 flex-1">
              <span class="block text-[0.8125rem] font-bold">{{ r.kelas }}</span>
              <span class="teks-merek mt-0.5 inline-block rounded-md px-1.5 py-0.5 text-[0.625rem] font-bold" :style="gayaChip(r.kategori)">
                {{ KATEGORI_SAMPAH[r.kategori].label }} · {{ KATEGORI_SAMPAH[r.kategori].tarif }}/kg
              </span>
            </span>
            <span class="w-13.5 text-right font-display text-[0.8125rem] font-semibold">{{ formatAngka(r.kg) }}</span>
            <span class="w-13.5 text-right font-display text-[0.8125rem] font-bold text-hijau-teks">+{{ r.poin }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
