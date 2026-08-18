<script setup lang="ts">
import { DAFTAR_KATEGORI, KATEGORI_SAMPAH } from '#shared/data/kategori-sampah'

definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Profil Tim' })

const [{ data: liga }, { data: dasbor }] = await Promise.all([
  useFetch('/api/klasemen', { key: 'klasemen' }),
  useFetch('/api/dasbor', { key: 'dasbor' }),
])
if (!liga.value || !dasbor.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data dasbor tidak tersedia' })
}

const {
  saya,
  rincianPoin: RINCIAN_POIN,
  anggota: ANGGOTA_TIM,
  jumlahAnggota: JUMLAH_ANGGOTA,
  riwayat: RIWAYAT_TIM,
} = dasbor.value

const peringkat = liga.value.tim.findIndex((t) => t.id === saya.kelasId) + 1
const tim = liga.value.tim[peringkat - 1]!
const kartuTerbuka = ref(false)

/** Komposisi setoran tim per kategori — kg & persen, urutan baku kategori. */
const komposisi = computed(() => {
  const kgPerKategori = dasbor.value?.komposisi
  if (!kgPerKategori) return []
  const total = DAFTAR_KATEGORI.reduce((a, k) => a + (kgPerKategori[k] ?? 0), 0)
  if (!total) return []
  return DAFTAR_KATEGORI.map((k) => ({
    id: k,
    label: KATEGORI_SAMPAH[k].label,
    warna: KATEGORI_SAMPAH[k].warna,
    kg: kgPerKategori[k] ?? 0,
    persen: ((kgPerKategori[k] ?? 0) / total) * 100,
  }))
})
</script>

<template>
  <div>
    <DasborHeader :judul="tim.nama" :sub="`Tim ${tim.julukan}`" :latar="`linear-gradient(160deg, ${tim.warna}, #095536)`">
      <template #aksi>
        <div class="rounded-[14px] bg-white/16 px-3 py-2 text-center">
          <div class="text-[0.625rem] font-bold tracking-[0.06em] text-white/80">PERINGKAT</div>
          <div class="font-display text-2xl leading-none font-bold text-lime">#{{ peringkat }}</div>
        </div>
      </template>

      <div class="relative z-2 mt-4.5 flex items-end justify-between">
        <div>
          <div class="text-[0.6875rem] font-semibold text-white/70">Poin Hijau</div>
          <div class="font-display text-[2.125rem] leading-none font-bold text-white">{{ formatAngka(tim.poin) }}</div>
        </div>
        <button
          type="button"
          class="flex items-center gap-1.75 rounded-xl bg-lime px-3.5 py-2.5 hover:bg-daun"
          @click="kartuTerbuka = true"
        >
          <Icon name="lucide:upload" size="16" class="text-tinta" aria-hidden="true" />
          <span class="text-xs font-bold text-tinta">Bagikan</span>
        </button>
      </div>
    </DasborHeader>

    <div class="px-4 lg:px-0">
      <div class="mt-3.5 grid grid-cols-3 gap-2.5">
        <StatCard label="Total sampah" :nilai="tim.kg" satuan="kg" />
        <StatCard label="Pohon ditanam" :nilai="tim.pohon" satuan="phn" />
        <StatCard label="CO₂ serap" :nilai="tim.co2" satuan="kg" />
      </div>

      <!-- Rincian sumber poin -->
      <section class="mt-2.5 rounded-[18px] border border-garis bg-surface p-4" aria-label="Rincian Poin Hijau">
        <h2 class="mb-3.5 font-display text-[0.9375rem] font-bold">Rincian Poin Hijau</h2>
        <div v-for="(r, i) in RINCIAN_POIN" :key="r.label" :class="i > 0 && 'mt-3.5'">
          <div class="mb-1.5 flex justify-between text-xs">
            <span class="font-semibold">{{ r.label }}</span>
            <span class="font-display font-bold" :style="{ color: r.warna }">{{ formatAngka(r.poin) }}</span>
          </div>
          <div
            class="h-2.5 overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            :aria-valuenow="r.persen"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="`${r.label}: ${r.persen}% dari total poin`"
          >
            <div class="h-full rounded-full" :style="{ width: `${r.persen}%`, background: r.warna }" />
          </div>
        </div>
      </section>

      <!-- Komposisi setoran per kategori -->
      <section v-if="komposisi.length" class="mt-2.5 rounded-[18px] border border-garis bg-surface p-4" aria-label="Komposisi setoran per kategori">
        <div class="mb-3 flex items-baseline justify-between">
          <h2 class="font-display text-[0.9375rem] font-bold">Komposisi Setoran</h2>
          <span class="text-[0.6875rem] font-semibold text-teks-samar tabular-nums">{{ formatAngka(tim.kg) }} kg total</span>
        </div>

        <!-- Bar horizontal bertumpuk: satu segmen solid per kategori -->
        <div
          class="lintasan flex"
          role="img"
          :aria-label="`Komposisi setoran: ${komposisi.map((s) => `${s.label} ${formatAngka(s.kg)} kg`).join(', ')}`"
        >
          <div
            v-for="s in komposisi"
            :key="s.id"
            class="h-full first:rounded-l-[5px] last:rounded-r-[5px]"
            :style="{ width: `${s.persen}%`, background: s.warna }"
          />
        </div>

        <ul class="mt-3.5 flex flex-col gap-2">
          <li v-for="s in komposisi" :key="s.id" class="flex items-center gap-2.25 text-xs">
            <span class="h-2.5 w-2.5 shrink-0 rounded-[3px]" :style="{ background: s.warna }" aria-hidden="true" />
            <span class="flex-1 font-semibold">{{ s.label }}</span>
            <span class="font-display font-bold tabular-nums">{{ formatAngka(s.kg) }} kg</span>
            <span class="w-9.5 text-right font-semibold text-teks-samar tabular-nums">{{ Math.round(s.persen) }}%</span>
          </li>
        </ul>
      </section>

      <section aria-label="Anggota tim">
        <div class="flex items-center justify-between px-0.5 pt-4.5 pb-2">
          <h2 class="font-display text-[0.9375rem] font-bold">Anggota tim</h2>
          <span class="text-[0.6875rem] font-semibold text-teks-samar">{{ JUMLAH_ANGGOTA }} siswa</span>
        </div>
        <ul class="overflow-hidden rounded-[18px] border border-garis bg-surface">
          <li v-for="a in ANGGOTA_TIM" :key="a.nama" class="flex items-center gap-3 border-t border-krem px-3.5 py-2.75 first:border-t-0">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint font-display text-[0.8125rem] font-bold text-hijau-teks">
              {{ inisial(a.nama) }}
            </span>
            <div class="flex-1">
              <div class="text-[0.8125rem] font-semibold">{{ a.nama }}</div>
              <div v-if="a.peran" class="text-[0.6875rem] font-semibold text-teks-samar">{{ a.peran }}</div>
            </div>
            <div class="font-display text-sm font-bold text-hijau-teks">{{ a.poin }}</div>
          </li>
        </ul>
      </section>

      <section aria-label="Riwayat terbaru">
        <h2 class="px-0.5 pt-4.5 pb-2 font-display text-[0.9375rem] font-bold">Riwayat terbaru</h2>
        <div class="flex flex-col gap-2">
          <div v-for="r in RIWAYAT_TIM" :key="r.teks" class="flex items-center gap-3 rounded-[14px] border border-garis bg-surface px-3.25 py-2.75">
            <span class="h-2 w-2 shrink-0 rounded-full" :style="{ background: r.warna }" aria-hidden="true" />
            <div class="flex-1">
              <div class="text-[0.8125rem] font-semibold">{{ r.teks }}</div>
              <div class="text-[0.6875rem] text-teks-samar">{{ r.waktu }}</div>
            </div>
            <div v-if="r.poin" class="font-display text-[0.8125rem] font-bold text-hijau-teks">{{ r.poin }}</div>
          </div>
        </div>
      </section>
    </div>

    <KartuPencapaian v-model:buka="kartuTerbuka" :tim="tim" />
  </div>
</template>
