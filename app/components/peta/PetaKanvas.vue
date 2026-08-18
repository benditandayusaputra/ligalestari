<script setup lang="ts">
import type { TitikPeta } from '#shared/types'

const props = defineProps<{
  titik: TitikPeta[]
  /** Indeks titik yang sedang dipilih (null bila tidak ada). */
  pilihan: number | null
}>()

const emit = defineEmits<{ pilih: [indeks: number]; tutup: [] }>()

const titikAktif = computed(() => props.titik.find((t) => t.indeks === props.pilihan) ?? null)
</script>

<template>
  <div class="min-w-0 flex-1">
    <div
      class="peta-grid relative h-95 w-full overflow-hidden rounded-[18px] border border-[#C2D8BD] bg-[#DCEAD7] lg:h-130"
      role="application"
      aria-label="Peta area sekolah dengan titik penanaman pohon"
      @keydown.escape="emit('tutup')"
    >
      <!-- Zona denah (skematis) -->
      <div class="absolute top-[12%] left-[6%] h-[26%] w-[30%] rounded-xl border-[1.5px] border-dashed border-hijau/35 bg-hijau/10" aria-hidden="true" />
      <div class="absolute top-[12%] left-[6%] px-2.25 py-1.5 text-caption font-bold text-[#0e6b46]" aria-hidden="true">Lapangan</div>
      <div class="absolute top-[16%] right-[8%] h-[30%] w-[26%] rounded-xl border-[1.5px] border-[#7D9686]/40 bg-[#7D9686]/15" aria-hidden="true" />
      <div class="absolute top-[16%] right-[8%] px-2.25 py-1.5 text-caption font-bold text-[#5C6B5F]" aria-hidden="true">Gedung A</div>
      <div class="absolute bottom-[8%] left-[30%] h-[26%] w-[40%] rounded-xl border-[1.5px] border-dashed border-hijau/30 bg-hijau/8" aria-hidden="true" />
      <div class="absolute bottom-[30%] left-[30%] px-2.25 py-1.5 text-caption font-bold text-[#0e6b46]" aria-hidden="true">Taman belakang</div>
      <div class="absolute bottom-[6%] left-[3%] rounded-[7px] bg-white/60 px-2.25 py-1 font-display text-caption font-semibold text-[#7E9686]">
        denah area · skema
      </div>

      <!-- Pin penanaman -->
      <button
        v-for="t in titik"
        :key="t.indeks"
        type="button"
        class="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[50%_50%_50%_0] border-[2.5px] border-white shadow-[0_3px_9px_rgba(20,32,22,0.3)] transition-transform hover:scale-[1.18] motion-reduce:transition-none"
        :class="t.indeks === pilihan ? 'z-50 h-7.5 w-7.5' : 'z-10 h-6.5 w-6.5'"
        :style="{ left: `${t.x}%`, top: `${t.y}%`, background: t.kelas.warna }"
        :aria-label="`${t.kelas.nama}, ${t.jumlah} pohon ${t.jenisPohon}, ${t.tanggal}`"
        :aria-pressed="t.indeks === pilihan"
        @click="emit('pilih', t.indeks)"
      >
        <span class="absolute inset-0 m-auto h-2 w-2 rotate-45 rounded-full bg-white/90" aria-hidden="true" />
      </button>

      <!-- Kartu detail titik terpilih, menempel di dasar kanvas agar
           tidak pernah terpotong tepi, berapa pun tinggi fotonya -->
      <div
        v-if="titikAktif"
        role="dialog"
        :aria-label="`Detail penanaman ${titikAktif.kelas.nama}`"
        class="anim-pop absolute inset-x-3 bottom-3 z-60 mx-auto max-w-72 rounded-[14px] border border-[#E4E1D7] bg-white p-3.5 text-[#16201A] shadow-[0_16px_40px_rgba(20,32,22,0.22)]"
      >
        <button
          type="button"
          class="absolute top-5.5 right-5.5 z-10 flex h-6 w-6 items-center justify-center rounded-[7px] bg-white/90 hover:bg-white"
          aria-label="Tutup detail"
          @click="emit('tutup')"
        >
          <Icon name="lucide:x" size="13" class="text-[#5F6961]" aria-hidden="true" />
        </button>
        <!-- Foto dokumentasi yang diunggah kelas saat menanam -->
        <img
          v-if="titikAktif.foto"
          :src="titikAktif.foto"
          :alt="`Foto dokumentasi penanaman ${titikAktif.jenisPohon} oleh ${titikAktif.kelas.nama}`"
          class="mb-3 aspect-2/1 w-full rounded-[10px] border border-[#E4E1D7] object-cover"
          width="400"
          height="250"
          loading="lazy"
        />
        <div class="mb-3 flex items-center gap-2.25">
          <span class="h-3.25 w-3.25 shrink-0 rounded-full" :style="{ background: titikAktif.kelas.warna }" aria-hidden="true" />
          <span class="font-display text-body font-bold">{{ titikAktif.kelas.nama }}</span>
        </div>
        <div class="flex gap-2.5">
          <div class="flex-1 rounded-[10px] bg-[#F4F2EA] px-2.75 py-2.25">
            <div class="font-display text-[1.1875rem] font-bold text-[#0e6b46]">{{ titikAktif.jumlah }}</div>
            <div class="text-caption font-semibold text-[#5F6961]">pohon {{ titikAktif.jenisPohon }}</div>
          </div>
          <div class="flex-1 rounded-[10px] bg-[#F4F2EA] px-2.75 py-2.25">
            <div class="font-display text-[1.1875rem] font-bold text-[#0e6b46]">{{ formatAngka(titikAktif.co2) }}</div>
            <div class="text-caption font-semibold text-[#5F6961]">kg CO₂/th</div>
          </div>
        </div>
        <div class="mt-2.75 flex items-center justify-between gap-2 text-[#636D65]">
          <span class="flex items-center gap-1.75">
            <Icon name="lucide:calendar-days" size="14" aria-hidden="true" />
            <span class="text-caption font-semibold">{{ titikAktif.tanggal }}</span>
          </span>
          <span v-if="titikAktif.foto" class="text-caption text-[#8A948B]">Dokumentasi kelas</span>
        </div>
      </div>
    </div>

    <p class="mx-0.5 mt-2.5 text-caption text-teks-samar">
      Posisi titik bersifat skematis untuk menjaga privasi. Klik titik untuk melihat ringkasan per kelas.
    </p>
  </div>
</template>
