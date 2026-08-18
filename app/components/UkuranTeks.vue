<script setup lang="ts">
/**
 * Pengatur ukuran huruf situs — berlaku seketika (realtime) dan tersimpan.
 * Dua wujud: popover "Aa" (navbar) atau daftar chip inline (`inline`,
 * untuk sidebar/panel). Bisa dioperasikan penuh lewat keyboard.
 */
const props = defineProps<{
  inline?: boolean
  /**
   * Kelas tambahan untuk tombol pemicu "Aa". Dipakai alih-alih class
   * fallthrough: template ini punya dua akar (v-if/v-else) sehingga
   * pewarisan atribut SSR vs klien bisa berbeda → hydration mismatch.
   */
  kelasTombol?: string
}>()

const { ukuran, setel } = useUkuranTeks()

const buka = ref(false)
const akar = ref<HTMLDivElement>()
const pemicu = ref<HTMLButtonElement>()

function tutup(kembalikanFokus = false) {
  if (!buka.value) return
  buka.value = false
  if (kembalikanFokus) pemicu.value?.focus()
}

function tanganiKlikLuar(e: MouseEvent) {
  if (buka.value && akar.value && !akar.value.contains(e.target as Node)) tutup()
}

onMounted(() => {
  if (!props.inline) document.addEventListener('click', tanganiKlikLuar)
})
onBeforeUnmount(() => {
  if (!props.inline) document.removeEventListener('click', tanganiKlikLuar)
})
</script>

<template>
  <!-- Varian inline: baris chip (sidebar dasbor / panel tampilan) -->
  <div v-if="inline" role="group" aria-label="Ukuran huruf">
    <div class="mb-1.5 text-[0.6875rem] font-bold tracking-wider text-teks-samar uppercase">Ukuran huruf</div>
    <div class="flex gap-1.5">
      <button
        v-for="p in PILIHAN_UKURAN_TEKS"
        :key="p.nilai"
        type="button"
        :aria-pressed="ukuran === p.nilai"
        :aria-label="`Ukuran huruf ${p.label.toLowerCase()}`"
        class="flex h-9.5 flex-1 items-center justify-center rounded-[9px] border font-display font-bold transition-colors"
        :class="
          ukuran === p.nilai
            ? 'border-hijau bg-mint text-hijau-teks'
            : 'border-garis bg-surface text-teks hover:text-hijau-teks'
        "
        :style="{ fontSize: `${(p.nilai / 100) * 0.85}rem` }"
        @click="setel(p.nilai)"
      >
        A
      </button>
    </div>
  </div>

  <!-- Varian popover: tombol "Aa" (navbar) -->
  <div v-else ref="akar" class="relative" @keydown.escape="tutup(true)">
    <button
      ref="pemicu"
      type="button"
      aria-label="Atur ukuran huruf"
      :aria-expanded="buka"
      aria-haspopup="true"
      class="flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border border-garis bg-surface font-display text-[0.8125rem] font-bold text-teks transition-colors hover:text-hijau-teks"
      :class="kelasTombol"
      @click="buka = !buka"
    >
      Aa
    </button>

    <div
      v-if="buka"
      role="group"
      aria-label="Pilihan ukuran huruf"
      class="anim-pop absolute right-0 z-50 mt-2 w-56 rounded-[14px] border border-garis bg-surface p-2 shadow-[0_16px_40px_rgba(20,32,22,0.18)]"
    >
      <div class="px-2 pt-1 pb-1.5 text-[0.6875rem] font-bold tracking-wider text-teks-samar uppercase">
        Ukuran huruf
      </div>
      <button
        v-for="p in PILIHAN_UKURAN_TEKS"
        :key="p.nilai"
        type="button"
        :aria-pressed="ukuran === p.nilai"
        class="flex w-full items-center gap-2.5 rounded-[9px] px-2 py-1.75 text-left transition-colors"
        :class="ukuran === p.nilai ? 'bg-mint text-hijau-teks' : 'text-teks hover:bg-surface-2'"
        @click="setel(p.nilai)"
      >
        <span
          class="w-7 shrink-0 text-center font-display font-bold"
          :style="{ fontSize: `${(p.nilai / 100) * 0.85}rem` }"
          aria-hidden="true"
        >
          Aa
        </span>
        <span class="flex-1 text-[0.8125rem] font-semibold">{{ p.label }}</span>
        <Icon v-if="ukuran === p.nilai" name="lucide:check" size="15" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
