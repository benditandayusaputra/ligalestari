/**
 * Tipe domain LigaLestari.
 * Ditaruh di `shared/` agar bisa dipakai ulang oleh server API
 * ketika aplikasi dikembangkan menjadi fullstack.
 */

/** Satu tim liga = satu kelas peserta. */
export interface TimKelas {
  id: string
  nama: string
  julukan: string
  /** Inisial pada lencana tim, mis. "R1". */
  emblem: string
  /** Warna identitas tim (hex). */
  warna: string
  /** Total Poin Hijau musim berjalan. */
  poin: number
  /** Total sampah terkelola (kg). */
  kg: number
  /** Jumlah pohon ditanam. */
  pohon: number
  /** Estimasi CO₂ diserap (kg/tahun). */
  co2: number
  /** Pergeseran peringkat dibanding pekan lalu (+naik, -turun). */
  tren: number
  /** Jumlah siswa kelas — pembagi Indeks Lestari (poin per kapita). */
  jumlahSiswa: number
}

/* ---------- Duel Pekan ---------- */

/** Status satu duel: sudah dimainkan, sedang berlangsung, atau belum. */
export type StatusDuel = 'selesai' | 'berjalan' | 'menyusul'

/** Satu duel head-to-head antara dua kelas pada satu pekan. */
export interface DuelPekan {
  pekan: number
  /** id tim sisi kiri/kandang. */
  kandang: string
  /** id tim sisi kanan/tandang. */
  tandang: string
  /** Poin aksi terverifikasi tim pada pekan itu (null bila belum main). */
  skorKandang: number | null
  skorTandang: number | null
  status: StatusDuel
}

/** Rekor duel sebuah tim: Menang-Seri-Kalah + poin duel (3/1/0). */
export interface RekorDuel {
  main: number
  menang: number
  seri: number
  kalah: number
  /** Akumulasi selisih skor — pemutus seri klasemen duel. */
  selisih: number
  poinDuel: number
}

export type KategoriArtikel = 'sampah' | 'pohon'

/** Blok isi artikel: sub-judul, paragraf, atau butir daftar. */
export interface BlokArtikel {
  jenis: 'judul' | 'paragraf' | 'poin'
  teks: string
}

export interface Artikel {
  slug: string
  judul: string
  kategori: KategoriArtikel
  menitBaca: number
  ringkasan: string
  /** Tanggal terbit (ISO) — dipakai untuk metadata SEO. */
  tanggal: string
  /** Ilustrasi placeholder: label singkat + teks alternatif. */
  thumb: { tag: string; alt: string }
  isi: BlokArtikel[]
  sumber: string[]
}

/** Satu titik penanaman pohon milik sebuah kelas pada denah sekolah. */
export interface TitikTanam {
  kelasId: string
  /** Posisi pada denah, dalam % dari kiri/atas. */
  x: number
  y: number
  jumlah: number
  /** Jenis pohon yang ditanam (merujuk tabel acuan metodologi). */
  jenisPohon: string
  /** Estimasi serapan agregat titik ini (kg CO₂/tahun). */
  co2: number
  tanggal: string
  /** Foto dokumentasi yang diunggah siswa saat menanam (path publik). */
  foto?: string
}

/** Pusat peta sekolah — bisa diubah admin lewat panel Lokasi Peta. */
export interface LokasiSekolah {
  lat: number
  lng: number
  /** Tingkat zoom awal peta (3–20). */
  zoom: number
}

/** Titik tanam yang sudah digabung dengan data kelas pemiliknya. */
export interface TitikPeta extends TitikTanam {
  /** Indeks titik pada data sumber — dipakai sebagai identitas pilihan. */
  indeks: number
  kelas: TimKelas
}

/** Baris tabel acuan serapan CO₂ per jenis pohon. */
export interface JenisPohon {
  nama: string
  latin: string
  /** kg CO₂ per pohon per tahun. */
  serapan: number
  sumber: string
  warna: string
}

/* ---------- Dasbor siswa ---------- */

export interface AnggotaTim {
  nama: string
  peran?: string
  poin: number
}

export interface RiwayatTim {
  teks: string
  waktu: string
  /** Poin yang tercatat, mis. "+125" (kosong bila bukan transaksi poin). */
  poin?: string
  warna: string
}

export interface BadgeSiswa {
  nama: string
  syarat: string
  dapat: boolean
}

export interface NotifikasiItem {
  judul: string
  isi: string
  waktu: string
  tag: string
  warna: string
  ikon: string
  belumDibaca: boolean
}

export interface PesanChat {
  dari: 'bot' | 'siswa'
  teks: string
}

/* ---------- Panel admin ---------- */

export interface EventLiga {
  nama: string
  jenis: 'sampah' | 'pohon'
  rate: string
  status: 'Aktif' | 'Terjadwal' | 'Selesai'
  periode: string
}

/**
 * Enam kategori sampah terpilah yang diakui liga.
 * Tarif poin/kg tiap kategori ada di `#shared/data/kategori-sampah`
 * (satu sumber kebenaran untuk server DAN klien).
 */
export type KategoriSampah = 'organik' | 'kertas' | 'plastik' | 'kaca' | 'logam' | 'b3-ringan'

/** Profil satu kategori sampah: label tampilan, tarif, dan alasannya. */
export interface InfoKategoriSampah {
  label: string
  /** Poin Hijau per kg. */
  tarif: number
  /** Warna semantik kategori (chip teks & bar komposisi). */
  warna: string
  /** Contoh isi kategori — satu kalimat. */
  deskripsi: string
  /** Alasan besaran tarif (kesulitan pemilahan & nilai lingkungan). */
  alasan: string
}

export interface SetoranSampah {
  waktu: string
  kelas: string
  kategori: KategoriSampah
  kg: number
  poin: number
}

/** Komposisi setoran: kg terkumpul per kategori. */
export type KomposisiSetoran = Record<KategoriSampah, number>

/** Bukti tanam pohon yang menunggu keputusan admin. */
export interface BuktiTanam {
  id: number
  kelasId: string
  pohon: number
  jenisPohon: string
  /** Estimasi serapan agregat (kg CO₂/tahun). */
  co2: number
  koordinat: string
  lokasi: string
  waktu: string
}
