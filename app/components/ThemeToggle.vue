<script setup lang="ts">
/**
 * Tombol ganti tema terang/gelap. Ikon matahari/bulan ditukar lewat CSS
 * (varian dark:) sehingga benar sejak render pertama, tanpa kedipan.
 */
withDefaults(
  defineProps<{
    label?: string
    /** Kelas ukuran/bingkai tombol ikon, override agar tidak ada utilitas bentrok. */
    kelasTombol?: string
  }>(),
  { kelasTombol: 'h-9.5 w-9.5' },
)

const colorMode = useColorMode()

function ganti() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    aria-label="Ganti tema terang/gelap"
    class="flex items-center justify-center gap-2.5 rounded-[10px] border border-garis bg-surface text-teks transition-colors hover:text-hijau-teks"
    :class="label ? 'w-full px-2.5 py-2 text-small font-semibold' : kelasTombol"
    @click="ganti"
  >
    <Icon name="lucide:moon" size="17" class="shrink-0 dark:hidden" aria-hidden="true" />
    <Icon name="lucide:sun" size="17" class="hidden shrink-0 dark:block" aria-hidden="true" />
    <span v-if="label" class="flex-1 text-left">{{ label }}</span>
  </button>
</template>
