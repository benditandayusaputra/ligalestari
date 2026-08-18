<script setup lang="ts">
import type { EventLiga } from '#shared/types'
import { RENTANG_TARIF } from '#shared/data/kategori-sampah'

/**
 * Gaya lencana status event. Memakai token tema, bukan heks tetap: pasangan
 * warna lamanya hanya dirancang untuk tema terang dan gagal kontras AA.
 */
const GAYA_STATUS_EVENT: Record<EventLiga['status'], string> = {
  Aktif: 'bg-mint text-hijau-teks',
  Terjadwal: 'bg-sorot text-emas-teks',
  Selesai: 'bg-surface-3 text-teks-redup',
}

definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Kelola Event' })

const [{ data: liga }, { data: event }] = await Promise.all([
  useFetch('/api/klasemen', { key: 'klasemen' }),
  useFetch('/api/admin/event', { key: 'admin-event' }),
])
if (!liga.value || !event.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data event tidak tersedia' })
}

const MUSIM = liga.value.musim
const RATE = event.value.rate
const DAFTAR_EVENT = event.value.daftar

// Formulir event menyusul bersama penyimpanan database.
const infoBackend = ref(false)
</script>

<template>
  <div>
    <DasborHeader variant="gelap" kicker="Pengaturan" judul="Kelola Event & Musim" />

    <div class="px-4 lg:px-0">
      <!-- Kartu musim berjalan -->
      <section class="mt-3.5 rounded-[18px] bg-[linear-gradient(140deg,#0e6b46,#095536)] p-4 text-white" aria-label="Musim berjalan">
        <div class="mb-3.5 flex items-center justify-between">
          <h2 class="font-display text-[0.9375rem] font-bold">{{ MUSIM.nama }}</h2>
          <span class="rounded-full bg-lime px-2.25 py-0.75 text-[0.625rem] font-bold text-tinta">BERJALAN</span>
        </div>
        <div class="grid grid-cols-3 gap-2.5">
          <div class="rounded-xl bg-white/10 px-3 py-2.75">
            <div class="text-[0.625rem] font-semibold text-white/70">Tarif sampah</div>
            <div class="font-display text-[1.0625rem] font-bold">{{ RENTANG_TARIF.min }}–{{ RENTANG_TARIF.max }} <span class="text-[0.6875rem] text-white/70">poin/kg</span></div>
          </div>
          <div class="rounded-xl bg-white/10 px-3 py-2.75">
            <div class="text-[0.625rem] font-semibold text-white/70">Rate pohon</div>
            <div class="font-display text-[1.0625rem] font-bold">{{ RATE.pohonPerBatang }} <span class="text-[0.6875rem] text-white/70">poin/phn</span></div>
          </div>
          <div class="rounded-xl bg-white/10 px-3 py-2.75">
            <div class="text-[0.625rem] font-semibold text-white/70">Berakhir</div>
            <div class="font-display text-[1.0625rem] font-bold">{{ MUSIM.berakhir }}</div>
          </div>
        </div>
      </section>

      <button
        type="button"
        class="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-[#BFC7BB] bg-surface p-3.25 text-[0.84375rem] font-bold text-hijau-teks hover:bg-mint/40"
        @click="infoBackend = !infoBackend"
      >
        <Icon name="lucide:plus" size="18" aria-hidden="true" />
        Buat event baru
      </button>
      <p v-if="infoBackend" class="mt-2 rounded-xl border border-mint-garis bg-hijau-pucat px-3.5 py-2.5 text-center text-xs font-semibold text-hijau-teks" role="status">
        Formulir event tersedia saat backend aktif pada tahap berikutnya.
      </p>

      <!-- Daftar event -->
      <ul class="mt-3 flex flex-col gap-2.5" aria-label="Daftar event">
        <li v-for="e in DAFTAR_EVENT" :key="e.nama" class="rounded-2xl border border-garis bg-surface p-3.5">
          <div class="flex items-center gap-2.75">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hijau-pucat">
              <Icon :name="e.jenis === 'pohon' ? 'lucide:tree-deciduous' : 'lucide:trash-2'" size="20" class="text-hijau-teks" aria-hidden="true" />
            </span>
            <div class="min-w-0 flex-1">
              <h2 class="text-sm font-bold">{{ e.nama }}</h2>
              <p class="text-[0.6875rem] font-semibold text-teks-samar">
                {{ e.jenis === 'pohon' ? 'Tanam Pohon' : 'Setoran Sampah' }} · {{ e.periode }}
              </p>
            </div>
            <span
              class="rounded-full px-2.25 py-1 text-[0.625rem] font-bold"
              :class="GAYA_STATUS_EVENT[e.status]"
            >
              {{ e.status.toUpperCase() }}
            </span>
          </div>
          <div class="mt-2.75 flex items-center justify-between border-t border-krem pt-2.75">
            <span class="text-[0.71875rem] font-semibold text-teks-redup">Rate poin</span>
            <span class="font-display text-[0.8125rem] font-bold text-hijau-teks">{{ e.rate }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
