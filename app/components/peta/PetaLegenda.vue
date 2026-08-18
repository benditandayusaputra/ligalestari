<script setup lang="ts">
defineProps<{
  item: { id: string; nama: string; warna: string; pohon: number; titik: number; aktif: boolean }[]
}>()

const emit = defineEmits<{ alihkan: [id: string] }>()
</script>

<template>
  <aside
    aria-label="Legenda dan filter kelas"
    class="h-fit w-full shrink-0 rounded-[18px] border border-garis bg-surface p-4.5 lg:w-67.5"
  >
    <h2 class="mb-1 font-display text-body font-bold">Filter per kelas</h2>
    <p class="mb-3.5 text-caption text-teks-samar">Ketuk untuk sembunyikan / tampilkan.</p>

    <div class="flex flex-col gap-2">
      <button
        v-for="k in item"
        :key="k.id"
        type="button"
        :aria-pressed="k.aktif"
        class="flex w-full cursor-pointer items-center gap-2.75 rounded-xl border p-2.5 pl-3 text-left"
        :class="k.aktif ? 'border-garis bg-surface-2' : 'border-garis bg-surface-3 opacity-60'"
        @click="emit('alihkan', k.id)"
      >
        <span
          class="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white"
          :style="{ background: k.warna, boxShadow: `0 0 0 1px ${k.warna}` }"
          aria-hidden="true"
        />
        <span class="min-w-0 flex-1">
          <span class="block text-small font-bold text-teks-kuat">{{ k.nama }}</span>
          <span class="block text-caption font-semibold text-teks-samar">{{ k.pohon }} pohon · {{ k.titik }} titik</span>
        </span>
        <Icon
          :name="k.aktif ? 'lucide:eye' : 'lucide:eye-off'"
          size="16"
          :class="k.aktif ? 'text-hijau-teks' : 'text-teks-samar'"
          aria-hidden="true"
        />
      </button>
    </div>

    <div class="mt-4 flex items-center gap-2 border-t border-krem pt-3.5">
      <Icon name="lucide:info" size="16" class="shrink-0 text-hijau-teks" aria-hidden="true" />
      <p class="text-caption leading-[1.45] text-teks-redup">
        Data agregat per kelas. Tidak ada nama atau identitas siswa yang ditampilkan.
      </p>
    </div>
  </aside>
</template>
