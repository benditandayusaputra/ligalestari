/** Format angka gaya Indonesia: 4820 → "4.820", 535.9 → "535,9". */
export function formatAngka(nilai: number): string {
  return nilai.toLocaleString('id-ID', { maximumFractionDigits: 1 })
}

/** Format tanggal ISO ke gaya Indonesia: "2026-02-09" → "9 Februari 2026". */
export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Format Indeks Lestari: selalu 1 desimal gaya Indonesia, mis. "144,3". */
export function formatIndeks(nilai: number): string {
  return nilai.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}
