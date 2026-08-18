<script setup lang="ts">
/**
 * Angka yang berjalan naik saat pertama kali terlihat di layar.
 * Nilai penuh tetap dirender di HTML statis (baik untuk SEO), lalu animasi
 * dijalankan di sisi klien — kecuali pengguna memilih "kurangi gerakan".
 */
const props = withDefaults(defineProps<{ nilai: number; durasi?: number }>(), { durasi: 1400 })

const wadah = ref<HTMLElement>()
const tampil = ref(props.nilai)

function animasikan() {
  tampil.value = 0
  const awal = performance.now()
  const langkah = (kini: number) => {
    const p = Math.min(1, (kini - awal) / props.durasi)
    tampil.value = Math.round(props.nilai * (1 - (1 - p) ** 3)) // ease-out kubik
    if (p < 1) requestAnimationFrame(langkah)
  }
  requestAnimationFrame(langkah)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const pengamat = new IntersectionObserver(
    (entri) => {
      if (entri[0]?.isIntersecting) {
        animasikan()
        pengamat.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  if (wadah.value) pengamat.observe(wadah.value)
  onBeforeUnmount(() => pengamat.disconnect())
})
</script>

<template>
  <span ref="wadah">{{ formatAngka(tampil) }}</span>
</template>
