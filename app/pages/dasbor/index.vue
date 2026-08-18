<script setup lang="ts">
definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Klasemen Liga' })

const { data } = await useFetch('/api/klasemen', { key: 'klasemen' })
if (!data.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data liga tidak tersedia' })
}
const { musim: MUSIM, tim: KLASEMEN, dampak: DAMPAK, eventAktif: EVENT_AKTIF } = data.value

const persenMusim = Math.round((MUSIM.pekan / MUSIM.totalPekan) * 100)
const tampilan = ref<'podium' | 'balapan'>('podium')
/** Metrik klasemen: total Poin Hijau, atau Indeks Lestari (poin per siswa). */
const metrik = ref<'poin' | 'indeks'>('poin')
const adaNotifBaru = true
</script>

<template>
  <div>
    <DasborHeader kicker="Klasemen Liga" :judul="MUSIM.nama">
      <template #aksi>
        <NuxtLink
          to="/dasbor/notifikasi"
          class="relative flex h-10.5 w-10.5 items-center justify-center rounded-[13px] bg-white/12 hover:bg-white/20"
          aria-label="Buka notifikasi"
        >
          <Icon name="lucide:bell" size="20" class="text-white" aria-hidden="true" />
          <span v-if="adaNotifBaru" class="absolute top-2.25 right-2.5 h-2 w-2 rounded-full border-2 border-hijau-pekat bg-lime" aria-hidden="true" />
        </NuxtLink>
      </template>

      <!-- Progres musim -->
      <div class="relative z-2 mt-4.5 rounded-2xl border border-white/14 bg-white/10 px-4 py-3.5">
        <div class="mb-2.25 flex items-center justify-between text-xs font-semibold">
          <span class="text-white">Pekan {{ MUSIM.pekan }} / {{ MUSIM.totalPekan }}</span>
          <span class="text-lime">Berakhir {{ MUSIM.berakhir }}</span>
        </div>
        <div
          class="h-2.25 overflow-hidden rounded-full bg-black/20"
          role="progressbar"
          :aria-valuenow="persenMusim"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Progres musim liga"
        >
          <div class="h-full rounded-full bg-[linear-gradient(90deg,#d9a13a,#e9b44c)]" :style="{ width: `${persenMusim}%` }" />
        </div>
      </div>
    </DasborHeader>

    <div class="px-4 lg:px-0">
      <div class="mt-3.5 grid grid-cols-2 gap-2.5">
        <StatCard label="Sampah terkelola" :nilai="DAMPAK.sampahKg" satuan="kg" ikon="lucide:trash-2" />
        <StatCard label="CO₂ diserap" :nilai="DAMPAK.co2Kg" satuan="kg" ikon="lucide:leaf" />
      </div>

      <!-- Banner event berjalan -->
      <div class="mt-2.5 flex items-center gap-3 rounded-2xl bg-[linear-gradient(100deg,#e9b44c,#d9a13a)] px-3.75 py-3.25">
        <span class="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[11px] bg-hijau-pekat">
          <Icon name="lucide:zap" size="19" class="text-lime" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="text-[0.625rem] font-bold tracking-[0.08em] text-tinta uppercase">{{ EVENT_AKTIF.label }}</div>
          <div class="font-display text-[0.9375rem] font-bold text-tinta">{{ EVENT_AKTIF.nama }}</div>
        </div>
        <span class="text-[0.6875rem] font-bold text-tinta">{{ EVENT_AKTIF.sisaHari }} hari</span>
      </div>

      <!-- Pilihan metrik: total poin vs poin per kapita -->
      <div class="mt-4 flex gap-1 rounded-[13px] bg-surface-3 p-1" role="group" aria-label="Pilih metrik klasemen">
        <button
          v-for="m in ([{ id: 'poin', label: 'Poin', ikon: 'lucide:leaf' }, { id: 'indeks', label: 'Indeks Lestari', ikon: 'lucide:scale' }] as const)"
          :key="m.id"
          type="button"
          :aria-pressed="metrik === m.id"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2.25 text-[0.78125rem] font-bold"
          :class="metrik === m.id ? 'bg-surface text-hijau-teks shadow-[0_2px_6px_rgba(20,32,22,0.1)]' : 'text-teks-redup'"
          @click="metrik = m.id"
        >
          <Icon :name="m.ikon" size="15" aria-hidden="true" />
          {{ m.label }}
        </button>
      </div>

      <!-- Pilihan tampilan klasemen (khusus metrik poin) -->
      <div v-if="metrik === 'poin'" class="mt-2 flex gap-1 rounded-[13px] bg-surface-3 p-1" role="group" aria-label="Pilih tampilan klasemen">
        <button
          v-for="pilihan in (['podium', 'balapan'] as const)"
          :key="pilihan"
          type="button"
          :aria-pressed="tampilan === pilihan"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2.25 text-[0.78125rem] font-bold capitalize"
          :class="tampilan === pilihan ? 'bg-surface text-hijau-teks shadow-[0_2px_6px_rgba(20,32,22,0.1)]' : 'text-teks-redup'"
          @click="tampilan = pilihan"
        >
          <Icon :name="pilihan === 'podium' ? 'lucide:trophy' : 'lucide:align-left'" size="15" aria-hidden="true" />
          {{ pilihan }}
        </button>
      </div>

      <KlasemenIndeks v-if="metrik === 'indeks'" :tim="KLASEMEN" />
      <KlasemenPodium v-else-if="tampilan === 'podium'" :tim="KLASEMEN" />
      <KlasemenBalapan v-else :tim="KLASEMEN" class="pt-1" />
    </div>
  </div>
</template>
