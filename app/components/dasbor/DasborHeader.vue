<script setup lang="ts">
/**
 * Kepala halaman dasbor. Varian: hijau (siswa), gelap (admin),
 * polos (putih). Prop `latar` menimpa latar dengan gradient khusus.
 */
const props = defineProps<{
  judul: string
  kicker?: string
  sub?: string
  variant?: 'hijau' | 'gelap' | 'polos'
  latar?: string
}>()

const gaya = computed(() => (props.latar ? { background: props.latar } : undefined))
const kelasLatar = computed(() => {
  if (props.latar) return ''
  if (props.variant === 'gelap') return 'bg-tinta'
  if (props.variant === 'polos') return 'border-b border-garis bg-surface'
  return 'bg-[linear-gradient(165deg,#095536,#0e6b46)]'
})
const polos = computed(() => props.variant === 'polos' && !props.latar)
</script>

<template>
  <header class="relative overflow-hidden px-5 pt-8 pb-5 lg:rounded-3xl" :class="kelasLatar" :style="gaya">
    <div v-if="!polos" class="absolute -top-12 -right-10 h-40 w-40 rounded-full bg-lime/10" aria-hidden="true" />

    <div class="relative z-2 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p v-if="kicker" class="text-[0.6875rem] font-bold tracking-widest uppercase" :class="polos ? 'text-hijau-teks' : 'text-lime'">
          {{ kicker }}
        </p>
        <h1 class="mt-0.5 text-[1.375rem] font-bold tracking-[-0.01em]" :class="polos ? 'text-teks-kuat' : 'text-white'">
          {{ judul }}
        </h1>
        <p v-if="sub" class="mt-0.5 text-xs font-medium" :class="polos ? 'text-teks-samar' : 'text-white/70'">
          {{ sub }}
        </p>
      </div>
      <!-- Aksi di kanan kepala, mis. tombol notifikasi -->
      <slot name="aksi" />
    </div>

    <slot />
  </header>
</template>
