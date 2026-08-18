/** Pilihan skala huruf situs, dalam % dari ukuran bawaan browser. */
export const PILIHAN_UKURAN_TEKS = [
  { nilai: 87.5, label: 'Kecil' },
  { nilai: 100, label: 'Normal' },
  { nilai: 115, label: 'Besar' },
  { nilai: 130, label: 'Sangat besar' },
] as const

export const KUNCI_UKURAN_TEKS = 'ligalestari-ukuran-teks'

/**
 * Pengatur ukuran huruf seluruh situs. Seluruh teks memakai satuan rem,
 * jadi cukup mengubah font-size elemen <html>; berlaku seketika tanpa
 * muat ulang. Pilihan tersimpan di localStorage dan diterapkan sebelum
 * cat pertama oleh skrip kecil di <head> (lihat nuxt.config).
 */
export function useUkuranTeks() {
  const ukuran = useState<number>('ukuran-teks', () => 100)

  function setel(nilai: number) {
    ukuran.value = nilai
    if (!import.meta.client) return
    document.documentElement.style.fontSize = nilai === 100 ? '' : `${nilai}%`
    try {
      if (nilai === 100) localStorage.removeItem(KUNCI_UKURAN_TEKS)
      else localStorage.setItem(KUNCI_UKURAN_TEKS, String(nilai))
    } catch {
      /* mode privat: pilihan tetap berlaku selama sesi */
    }
  }

  return { ukuran, setel }
}
