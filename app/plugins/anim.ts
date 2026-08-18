/**
 * Directive `v-anim`: animasi masuk halus saat elemen tergulir ke layar.
 * Dibuat sendiri (±40 baris) alih-alih memakai AOS: tanpa dependensi,
 * sekali jalan per elemen, dan sepenuhnya mati saat pengguna menyetel
 * "kurangi gerakan" (konten tidak pernah disembunyikan).
 *
 * Pemakaian: `v-anim` atau `v-anim="120"` (tunda ms, untuk efek berjenjang).
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('anim', { getSSRProps: () => ({}) })
    return
  }

  const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let pengamat: IntersectionObserver | null = null
  const dapatPengamat = () =>
    (pengamat ??= new IntersectionObserver(
      (entri) => {
        for (const e of entri) {
          if (e.isIntersecting) {
            e.target.classList.add('anim-masuk')
            pengamat!.unobserve(e.target)
          }
        }
      },
      // Tepi atas dibuka sangat lebar: elemen yang terlewati karena lompatan
      // gulir (tombol End, tautan jangkar) tetap dianggap sudah tampil.
      { threshold: 0, rootMargin: '10000px 0px -10% 0px' },
    ))

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('anim', {
    mounted(el, binding) {
      if (kurangiGerak) return
      el.classList.add('anim-awal')
      if (binding.value) el.style.setProperty('--anim-tunda', `${binding.value}ms`)
      dapatPengamat().observe(el)
    },
    unmounted(el) {
      pengamat?.unobserve(el)
    },
  })
})
