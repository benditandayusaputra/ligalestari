<script setup lang="ts">
definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Panel Admin' })

const [{ data: liga }, { data: ringkasan }] = await Promise.all([
  useFetch('/api/klasemen', { key: 'klasemen' }),
  useFetch('/api/admin/ringkasan', { key: 'admin-ringkasan' }),
])
if (!liga.value || !ringkasan.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data panel admin tidak tersedia' })
}

const tigaBesar = liga.value.tim.slice(0, 3)
const KPI_HARI_INI = ringkasan.value.kpi
const menunggu = ringkasan.value.buktiMenunggu

const AKSI_CEPAT = [
  { label: 'Setor sampah', ke: '/admin/setoran', ikon: 'lucide:plus' },
  { label: 'Kelola event', ke: '/admin/event', ikon: 'lucide:calendar-days' },
  { label: 'Laporan', ke: '/admin/laporan', ikon: 'lucide:chart-line' },
  { label: 'Kelas', ke: '/admin/kelas', ikon: 'lucide:users-round' },
]
</script>

<template>
  <div>
    <DasborHeader variant="gelap" kicker="Panel Admin" judul="Ringkasan Hari Ini">
      <template #aksi>
        <span class="flex h-10.5 w-10.5 items-center justify-center rounded-full bg-[#2C382F] font-display text-sm font-bold text-lime" aria-label="Admin Bank Sampah">
          BS
        </span>
      </template>
    </DasborHeader>

    <div class="px-4 lg:px-0">
      <div class="mt-3.5 grid grid-cols-2 gap-2.5">
        <StatCard label="Sampah masuk" :nilai="KPI_HARI_INI.sampahKg" satuan="kg" />
        <StatCard label="Transaksi setor" :nilai="KPI_HARI_INI.transaksi" />
        <StatCard label="Poin dibagikan" :nilai="KPI_HARI_INI.poinDibagikan" aksen="hijau" />
        <StatCard label="Bukti menunggu" :nilai="menunggu" aksen="emas" />
      </div>

      <!-- Ajakan verifikasi -->
      <NuxtLink to="/admin/verifikasi" class="mt-2.5 flex items-center gap-3 rounded-2xl bg-tinta p-3.75 hover:bg-hijau-pekat">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emas/20">
          <Icon name="lucide:clipboard-check" size="20" class="text-emas" aria-hidden="true" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block text-small font-semibold text-white">{{ menunggu }} bukti tanam pohon menunggu</span>
          <span class="block text-caption text-white/70">Verifikasi agar poin masuk klasemen</span>
        </span>
        <Icon name="lucide:chevron-right" size="20" class="text-lime" aria-hidden="true" />
      </NuxtLink>

      <nav aria-label="Aksi cepat">
        <h2 class="px-0.5 pt-4 pb-2 font-display text-body font-bold">Aksi cepat</h2>
        <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <NuxtLink
            v-for="a in AKSI_CEPAT"
            :key="a.ke"
            :to="a.ke"
            class="flex min-h-19 flex-col items-center justify-center gap-2 rounded-2xl border border-garis bg-surface px-2 py-3.5 text-center hover:border-hijau-teks/40 hover:bg-surface-2"
          >
            <Icon :name="a.ikon" size="21" class="block text-hijau-teks" aria-hidden="true" />
            <span class="text-caption leading-tight font-semibold">{{ a.label }}</span>
          </NuxtLink>
        </div>
      </nav>

      <section aria-label="Pemuncak klasemen">
        <h2 class="px-0.5 pt-4 pb-2 font-display text-body font-bold">Pemuncak klasemen</h2>
        <ol class="overflow-hidden rounded-[18px] border border-garis bg-surface">
          <li v-for="(t, i) in tigaBesar" :key="t.id" class="flex items-center gap-3 border-t border-krem px-3.5 py-3 first:border-t-0">
            <span
              class="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg font-display text-small font-bold tabular-nums"
              :style="warnaMedali(i)"
            >{{ i + 1 }}</span>
            <TimEmblem :warna="t.warna" :teks="t.emblem" :ukuran="34" />
            <span class="flex-1 text-small font-semibold">{{ t.nama }}</span>
            <span class="font-display text-body font-bold text-hijau-teks tabular-nums">{{ formatAngka(t.poin) }}</span>
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>
