<script setup lang="ts">
definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Verifikasi Bukti' })

type Keputusan = 'disetujui' | 'ditolak'

const [{ data: liga }, { data: bukti }] = await Promise.all([
  useFetch('/api/klasemen', { key: 'klasemen' }),
  useFetch('/api/admin/bukti', { key: 'admin-bukti' }),
])
if (!liga.value || !bukti.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data bukti tidak tersedia' })
}

const BUKTI_TANAM = bukti.value.daftar

// Keputusan awal dari server, perubahan dikirim balik lewat PATCH.
const keputusan = ref<Record<number, Keputusan>>(
  Object.fromEntries(BUKTI_TANAM.filter((b) => b.keputusan).map((b) => [b.id, b.keputusan!])),
)
const menunggu = computed(() => BUKTI_TANAM.filter((b) => !keputusan.value[b.id]).length)

const kelasDari = (id: string) => liga.value!.tim.find((t) => t.id === id)!

/** Simpan keputusan; di hosting statis cukup tersimpan lokal. */
async function putuskan(id: number, hasil: Keputusan) {
  keputusan.value[id] = hasil
  try {
    await $fetch(`/api/admin/bukti/${id}`, { method: 'PATCH', body: { keputusan: hasil } })
  } catch {
    // Hosting statis: keputusan hanya bertahan di sesi ini.
  }
}
</script>

<template>
  <div>
    <DasborHeader
      variant="gelap"
      kicker="Moderasi"
      judul="Verifikasi Bukti Tanam"
      :sub="`${menunggu} menunggu · poin masuk setelah disetujui`"
    />

    <ul class="grid gap-3.5 px-4 pt-3.5 sm:grid-cols-2 lg:px-0" aria-label="Daftar bukti tanam pohon">
      <li v-for="b in BUKTI_TANAM" :key="b.id" class="flex flex-col overflow-hidden rounded-[18px] border border-garis bg-surface">
        <!-- Placeholder foto bukti -->
        <div
          class="relative flex h-37.5 items-center justify-center bg-[repeating-linear-gradient(135deg,#E9EDE6_0_9px,#E2E7DE_9px_18px)]"
          role="img"
          :aria-label="`Foto bukti penanaman ${b.pohon} pohon ${b.jenisPohon} oleh ${kelasDari(b.kelasId).nama}`"
        >
          <span class="font-display text-[0.625rem] font-semibold tracking-widest text-teks-samar">FOTO BUKTI · {{ b.pohon }} POHON</span>
          <span class="absolute top-2.5 left-2.5 flex items-center gap-1.75 rounded-[10px] bg-white/95 px-2.25 py-1.25">
            <TimEmblem :warna="kelasDari(b.kelasId).warna" :teks="kelasDari(b.kelasId).emblem" :ukuran="22" />
            <span class="text-[0.71875rem] font-bold">{{ kelasDari(b.kelasId).nama }}</span>
          </span>
          <span class="absolute top-2.5 right-2.5 rounded-[10px] bg-white/95 px-2.25 py-1.25 text-[0.625rem] font-semibold text-teks-redup">
            {{ b.waktu }}
          </span>
        </div>

        <div class="flex flex-1 flex-col p-3.5">
          <div class="mb-2.75 grid grid-cols-3 gap-2.5">
            <div class="rounded-[11px] border border-garis bg-surface-2 px-2.75 py-2.25">
              <div class="text-[0.625rem] font-semibold text-teks-samar">Jenis pohon</div>
              <div class="text-[0.8125rem] font-bold">{{ b.jenisPohon }}</div>
            </div>
            <div class="rounded-[11px] border border-garis bg-surface-2 px-2.75 py-2.25">
              <div class="text-[0.625rem] font-semibold text-teks-samar">CO₂/th</div>
              <div class="text-[0.8125rem] font-bold text-hijau-teks">{{ b.co2 }} kg</div>
            </div>
            <div class="rounded-[11px] border border-garis bg-surface-2 px-2.75 py-2.25">
              <div class="text-[0.625rem] font-semibold text-teks-samar">Calon poin</div>
              <div class="text-[0.8125rem] font-bold text-hijau-teks">+{{ b.calonPoin }}</div>
            </div>
          </div>

          <div class="mb-3 flex items-center gap-2.25 rounded-[11px] bg-hijau-pucat px-3 py-2.5">
            <Icon name="lucide:map-pin" size="16" class="shrink-0 text-hijau-teks" aria-hidden="true" />
            <div class="min-w-0">
              <div class="text-[0.71875rem] font-bold text-teks">{{ b.koordinat }}</div>
              <div class="text-[0.65625rem] text-teks-redup">{{ b.lokasi }}</div>
            </div>
          </div>

          <!-- Keputusan -->
          <div v-if="!keputusan[b.id]" class="mt-auto flex gap-2.25">
            <button
              type="button"
              class="flex-1 rounded-xl border-[1.5px] border-merah-teks/40 bg-surface p-3 text-[0.8125rem] font-bold text-merah-teks hover:bg-surface-2"
              @click="putuskan(b.id, 'ditolak')"
            >
              Tolak
            </button>
            <button
              type="button"
              class="flex-[1.4] rounded-xl bg-hijau p-3 text-[0.8125rem] font-bold text-white transition-colors hover:bg-hijau-pekat"
              @click="putuskan(b.id, 'disetujui')"
            >
              Setujui · +{{ b.calonPoin }}
            </button>
          </div>
          <p
            v-else-if="keputusan[b.id] === 'disetujui'"
            class="mt-auto flex items-center justify-center gap-2 rounded-xl bg-hijau-pucat p-3 text-[0.8125rem] font-bold text-hijau-teks"
            role="status"
          >
            <Icon name="lucide:check" size="17" aria-hidden="true" />
            Disetujui · poin masuk klasemen
          </p>
          <p v-else class="mt-auto flex items-center justify-center gap-2 rounded-xl bg-surface-2 p-3 text-[0.8125rem] font-bold text-merah-teks" role="status">
            <Icon name="lucide:x" size="17" aria-hidden="true" />
            Bukti ditolak
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
