import { KUNCI_UKURAN_TEKS, PILIHAN_UKURAN_TEKS } from '~/composables/ukuranTeks'

/**
 * Sinkronkan state ukuran huruf dengan pilihan tersimpan. Gaya font-size
 * sudah diterapkan lebih awal oleh skrip di <head> (anti-kedip); plugin ini
 * hanya menyamakan state Vue agar UI pengatur menandai pilihan aktif.
 */
export default defineNuxtPlugin(() => {
  const { ukuran } = useUkuranTeks()
  try {
    const tersimpan = Number(localStorage.getItem(KUNCI_UKURAN_TEKS))
    if (PILIHAN_UKURAN_TEKS.some((p) => p.nilai === tersimpan)) ukuran.value = tersimpan
  } catch {
    /* abaikan */
  }
})
