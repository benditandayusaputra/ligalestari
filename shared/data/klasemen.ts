import type { KomposisiSetoran, TimKelas } from '#shared/types'
import { DAFTAR_KATEGORI } from '#shared/data/kategori-sampah'

/** Progres musim liga berjalan. */
export const MUSIM = {
  nama: "Musim Genap '25/'26",
  pekan: 9,
  totalPekan: 16,
  berakhir: '12 Jul',
  sisaHari: 12,
}

/**
 * Klasemen contoh untuk demo — sudah terurut dari poin tertinggi.
 * Halaman publik memakai 5 teratas; dasbor memakai semuanya.
 * Saat backend tersedia, data ini digantikan API server.
 */
export const KLASEMEN: TimKelas[] = [
  { id: 'rpl', nama: 'XII RPL 1', julukan: 'Rajawali', emblem: 'R1', warna: '#4cc38a', poin: 4820, kg: 318, pohon: 64, co2: 1180, tren: 1, jumlahSiswa: 36 },
  { id: 'tkj', nama: 'XI TKJ 2', julukan: 'Garuda', emblem: 'G2', warna: '#E6B422', poin: 4510, kg: 296, pohon: 58, co2: 1040, tren: 2, jumlahSiswa: 38 },
  { id: 'mm', nama: 'X MM 1', julukan: 'Elang', emblem: 'E1', warna: '#2D8FE0', poin: 4185, kg: 271, pohon: 51, co2: 910, tren: 0, jumlahSiswa: 29 },
  { id: 'akl', nama: 'XII AKL 3', julukan: 'Banteng', emblem: 'A3', warna: '#C0392B', poin: 3760, kg: 244, pohon: 44, co2: 770, tren: -1, jumlahSiswa: 33 },
  { id: 'dkv', nama: 'XI DKV 1', julukan: 'Serigala', emblem: 'D1', warna: '#7B4BD1', poin: 3340, kg: 210, pohon: 39, co2: 690, tren: 1, jumlahSiswa: 24 },
  { id: 'tb', nama: 'X TB 2', julukan: 'Rusa', emblem: 'B2', warna: '#14A38B', poin: 2980, kg: 188, pohon: 33, co2: 560, tren: -2, jumlahSiswa: 26 },
  { id: 'otkp', nama: 'XII OTKP 1', julukan: 'Macan', emblem: 'M1', warna: '#E8731B', poin: 2610, kg: 162, pohon: 28, co2: 470, tren: 0, jumlahSiswa: 31 },
  { id: 'aphp', nama: 'XI APHP 2', julukan: 'Beruang', emblem: 'P2', warna: '#5A6B7B', poin: 2210, kg: 138, pohon: 22, co2: 360, tren: 1, jumlahSiswa: 27 },
]

export const KLASEMEN_PER_ID = Object.fromEntries(KLASEMEN.map((t) => [t.id, t]))

/**
 * Komposisi setoran per kelas: kg terkumpul per kategori sampah.
 * Jumlah tiap baris SAMA PERSIS dengan `kg` tim di KLASEMEN di atas,
 * sehingga klasemen dan bar komposisi selalu konsisten.
 */
export const KOMPOSISI_KELAS: Record<string, KomposisiSetoran> = {
  rpl: { organik: 118, kertas: 58, plastik: 72, kaca: 30, logam: 26, 'b3-ringan': 14 },
  tkj: { organik: 110, kertas: 55, plastik: 64, kaca: 28, logam: 25, 'b3-ringan': 14 },
  mm: { organik: 100, kertas: 50, plastik: 60, kaca: 26, logam: 23, 'b3-ringan': 12 },
  akl: { organik: 92, kertas: 46, plastik: 52, kaca: 24, logam: 20, 'b3-ringan': 10 },
  dkv: { organik: 80, kertas: 40, plastik: 45, kaca: 20, logam: 17, 'b3-ringan': 8 },
  tb: { organik: 72, kertas: 36, plastik: 40, kaca: 18, logam: 15, 'b3-ringan': 7 },
  otkp: { organik: 62, kertas: 30, plastik: 35, kaca: 16, logam: 13, 'b3-ringan': 6 },
  aphp: { organik: 52, kertas: 26, plastik: 30, kaca: 14, logam: 11, 'b3-ringan': 5 },
}

/** Komposisi seluruh liga — dijumlah dari komposisi per kelas. */
export const KOMPOSISI_LIGA: KomposisiSetoran = DAFTAR_KATEGORI.reduce((total, k) => {
  total[k] = Object.values(KOMPOSISI_KELAS).reduce((a, kelas) => a + kelas[k], 0)
  return total
}, {} as KomposisiSetoran)

/** Ringkasan dampak seluruh liga — dijumlah dari data tim di atas. */
export const DAMPAK = {
  sampahKg: KLASEMEN.reduce((a, t) => a + t.kg, 0),
  pohon: KLASEMEN.reduce((a, t) => a + t.pohon, 0),
  co2Kg: KLASEMEN.reduce((a, t) => a + t.co2, 0),
}
