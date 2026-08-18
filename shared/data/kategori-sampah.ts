import type { InfoKategoriSampah, KategoriSampah } from '#shared/types'

/**
 * SATU SUMBER KEBENARAN tarif poin sampah terpilah.
 * Dipakai server (validasi & hitung poin) dan klien (form, tabel tarif,
 * fallback build statis) — mengubah tarif cukup di berkas ini.
 *
 * Prinsip tarif: makin sulit dipilah/dikumpulkan dan makin besar nilai
 * lingkungannya, makin tinggi poin per kg.
 */
export const KATEGORI_SAMPAH: Record<KategoriSampah, InfoKategoriSampah> = {
  organik: {
    label: 'Organik',
    tarif: 8,
    warna: '#2f9e63',
    deskripsi: 'Sisa makanan, daun, dan ranting yang bisa dikomposkan.',
    alasan: 'Paling mudah dipilah dan volumenya paling besar, jadi tarifnya paling rendah.',
  },
  kertas: {
    label: 'Kertas',
    tarif: 10,
    warna: '#b3841c',
    deskripsi: 'Kertas bekas, kardus, dan buku yang sudah tidak terpakai.',
    alasan: 'Mudah dikumpulkan di sekolah dan bernilai daur ulang stabil.',
  },
  plastik: {
    label: 'Plastik',
    tarif: 12,
    warna: '#2d8fe0',
    deskripsi: 'Botol, gelas kemasan, dan plastik keras yang sudah dibilas.',
    alasan: 'Butuh dibersihkan dan dipilah per jenis; mencegah plastik lepas ke lingkungan.',
  },
  kaca: {
    label: 'Kaca',
    tarif: 12,
    warna: '#12a3a3',
    deskripsi: 'Botol dan toples kaca utuh — bukan pecahan tajam.',
    alasan: 'Berat, perlu penanganan hati-hati, dan bisa didaur ulang tanpa batas.',
  },
  logam: {
    label: 'Logam',
    tarif: 15,
    warna: '#64748c',
    deskripsi: 'Kaleng minuman, tutup botol, dan potongan logam kecil.',
    alasan: 'Jarang terkumpul namun nilai daur ulangnya paling tinggi per kg.',
  },
  'b3-ringan': {
    label: 'B3 Ringan',
    tarif: 20,
    warna: '#c2543a',
    deskripsi: 'Baterai, lampu bekas, dan elektronik kecil rumah tangga.',
    alasan: 'Paling sulit dipilah dan paling berbahaya bila bocor ke lingkungan — tarif tertinggi.',
  },
}

/** Urutan baku kategori untuk form, tabel tarif, dan bar komposisi. */
export const DAFTAR_KATEGORI = Object.keys(KATEGORI_SAMPAH) as KategoriSampah[]

/** Rentang tarif untuk teks ringkas, mis. "8–20 poin/kg". */
export const RENTANG_TARIF = {
  min: Math.min(...DAFTAR_KATEGORI.map((k) => KATEGORI_SAMPAH[k].tarif)),
  max: Math.max(...DAFTAR_KATEGORI.map((k) => KATEGORI_SAMPAH[k].tarif)),
}

/** Type guard: nilai bebas → kategori sampah yang sah? */
export function adalahKategori(nilai: unknown): nilai is KategoriSampah {
  return typeof nilai === 'string' && nilai in KATEGORI_SAMPAH
}

/** Rumus poin liga: kg × tarif kategori, dibulatkan ke bilangan bulat. */
export function poinSetoran(kg: number, kategori: KategoriSampah): number {
  return Math.round(kg * KATEGORI_SAMPAH[kategori].tarif)
}

/**
 * Validator setoran — dipakai endpoint server DAN fallback klien agar
 * aturannya identik. Mengembalikan pesan kesalahan, atau null bila sah.
 */
export function validasiSetoran(input: { kelas?: unknown; kategori?: unknown; kg?: unknown }): string | null {
  if (typeof input.kelas !== 'string' || !input.kelas.trim()) return 'Kelas wajib dipilih'
  if (!adalahKategori(input.kategori)) return 'Kategori sampah tidak dikenal'
  const kg = Number(input.kg)
  if (!Number.isFinite(kg) || kg <= 0) return 'Berat (kg) harus lebih dari 0'
  if (kg > 500) return 'Berat setoran tidak wajar (maksimum 500 kg sekali catat)'
  return null
}
