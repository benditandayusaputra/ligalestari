import type { BuktiTanam, EventLiga, SetoranSampah } from '#shared/types'
import { KLASEMEN } from '#shared/data/klasemen'

/**
 * Data demo untuk panel admin (OSIS / bank sampah / pembina).
 * Statis dulu, digantikan API + database pada tahap fullstack.
 */

/**
 * Rate poin musim berjalan untuk aksi NON-sampah.
 * Tarif sampah kini per kategori, lihat `#shared/data/kategori-sampah`.
 */
export const RATE = { pohonPerBatang: 50 }

export const KPI_HARI_INI = {
  sampahKg: 68.4,
  transaksi: 18,
  poinDibagikan: 2140,
}

/** Transaksi demo, poin selalu = kg × tarif kategori (lihat kategori-sampah). */
export const SETORAN_HARI_INI: SetoranSampah[] = [
  { waktu: '09.42', kelas: 'XII RPL 1', kategori: 'plastik', kg: 12.5, poin: 150 },
  { waktu: '09.18', kelas: 'XI TKJ 2', kategori: 'organik', kg: 8, poin: 64 },
  { waktu: '08.55', kelas: 'X MM 1', kategori: 'logam', kg: 5.2, poin: 78 },
  { waktu: '08.30', kelas: 'XII AKL 3', kategori: 'kertas', kg: 6.4, poin: 64 },
  { waktu: '08.05', kelas: 'XI DKV 1', kategori: 'kaca', kg: 4.5, poin: 54 },
  { waktu: '07.50', kelas: 'XI APHP 2', kategori: 'b3-ringan', kg: 1.6, poin: 32 },
]

export const DAFTAR_EVENT: EventLiga[] = [
  { nama: 'Setoran Sampah Harian', jenis: 'sampah', rate: 'tarif kategori · 8–20 poin / kg', status: 'Aktif', periode: 'Tiap hari sekolah' },
  { nama: 'Pekan Tanam Pohon', jenis: 'pohon', rate: '2× · 100 poin / pohon', status: 'Aktif', periode: '1–12 Jul 2026' },
  { nama: 'Bank Sampah Spesial', jenis: 'sampah', rate: '1,5× tarif kategori', status: 'Terjadwal', periode: '15 Jul 2026' },
  { nama: 'Tanam Pohon Hari Bumi', jenis: 'pohon', rate: '50 poin / pohon', status: 'Selesai', periode: '22 Apr 2026' },
]

export const BUKTI_TANAM: BuktiTanam[] = [
  { id: 1, kelasId: 'tkj', pohon: 6, jenisPohon: 'Trembesi', co2: 171, koordinat: '-6.91732, 107.61912', lokasi: 'Lapangan belakang sekolah', waktu: '20 mnt lalu' },
  { id: 2, kelasId: 'mm', pohon: 4, jenisPohon: 'Mangga', co2: 48, koordinat: '-6.91688, 107.62041', lokasi: 'Taman depan gerbang', waktu: '1 jam lalu' },
  { id: 3, kelasId: 'rpl', pohon: 8, jenisPohon: 'Mahoni', co2: 144, koordinat: '-6.91801, 107.61855', lokasi: 'Sisi timur kantin', waktu: '2 jam lalu' },
  { id: 4, kelasId: 'aphp', pohon: 3, jenisPohon: 'Ketapang', co2: 45, koordinat: '-6.91760, 107.62110', lokasi: 'Halaman parkir guru', waktu: '3 jam lalu' },
]

/* ---------- Laporan dampak ---------- */

export const LAPORAN_BULANAN = [
  { bulan: 'Feb', kg: 210 },
  { bulan: 'Mar', kg: 326 },
  { bulan: 'Apr', kg: 421 },
  { bulan: 'Mei', kg: 295 },
  { bulan: 'Jun', kg: 484 },
]

export const LAPORAN_SPESIES = [
  { nama: 'Trembesi', jumlah: 96, co2: 2736, persen: 34, warna: '#4cc38a' },
  { nama: 'Mahoni', jumlah: 84, co2: 1512, persen: 30, warna: '#0e6b46' },
  { nama: 'Mangga', jumlah: 71, co2: 852, persen: 25, warna: '#E6B422' },
  { nama: 'Ketapang', jumlah: 31, co2: 465, persen: 11, warna: '#C77F3E' },
]

/* ---------- Kelola kelas ---------- */

/**
 * Jumlah siswa terdaftar per kelas: diturunkan dari `jumlahSiswa` di
 * KLASEMEN (satu sumber kebenaran; dipakai juga oleh Indeks Lestari).
 */
export const SISWA_PER_KELAS: Record<string, number> = Object.fromEntries(
  KLASEMEN.map((t) => [t.id, t.jumlahSiswa]),
)

/** Kode gabung aktif per kelas (demo). */
export const KODE_GABUNG: Record<string, string> = {
  rpl: 'RPL1-7K2M', tkj: 'TKJ2-3H9P', mm: 'MM1-5J4Q', akl: 'AKL3-8R6T',
  dkv: 'DKV1-2W7B', tb: 'TB2-9C4N', otkp: 'OTKP-6D3F', aphp: 'APHP-4G8H',
}

/** Contoh daftar siswa sebuah kelas, data minimal demi privasi. */
export const SISWA_KELAS = [
  { nama: 'Aditya Pratama', nis: 'NIS 2231045', poin: 520 },
  { nama: 'Siti Nurhaliza', nis: 'NIS 2231046', poin: 430 },
  { nama: 'Bagas Saputra', nis: 'NIS 2231047', poin: 395 },
  { nama: 'Dewi Lestari', nis: 'NIS 2231048', poin: 360 },
  { nama: 'Rizki Ananda', nis: 'NIS 2231049', poin: 340 },
  { nama: 'Putri Maharani', nis: 'NIS 2231050', poin: 300 },
]

/** Pilihan warna tim saat membuat kelas baru. */
export const WARNA_TIM = ['#4cc38a', '#E6B422', '#2D8FE0', '#C0392B', '#7B4BD1', '#14A38B', '#E8731B', '#5A6B7B']
