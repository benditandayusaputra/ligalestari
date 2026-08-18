import type { AnggotaTim, BadgeSiswa, NotifikasiItem, RiwayatTim } from '#shared/types'

/**
 * Data demo untuk dasbor siswa. Semua nilai statis mengikuti prototype;
 * pada tahap fullstack, data ini digantikan API per pengguna.
 */

/** Profil siswa yang sedang masuk (mode demo). */
export const SAYA = {
  nama: 'Aditya Pratama',
  kelasId: 'rpl',
  level: 6,
  namaLevel: 'Eco Warrior',
  poin: 520,
  kg: 48,
  pohon: 9,
  /** Progres menuju level berikutnya. */
  persenLevel: 72,
  poinKeLevelBerikut: 180,
}

/** Event yang sedang berlangsung — tampil sebagai banner di klasemen. */
export const EVENT_AKTIF = {
  label: 'Event aktif · 2× Poin',
  nama: 'Pekan Tanam Pohon',
  sisaHari: 12,
}

/** Rincian sumber Poin Hijau tim (untuk halaman Profil Tim). */
export const RINCIAN_POIN = [
  { label: 'Setoran sampah', poin: 2620, persen: 54, warna: '#2D8FE0' },
  { label: 'Tanam pohon', poin: 2200, persen: 46, warna: '#4cc38a' },
]

export const ANGGOTA_TIM: AnggotaTim[] = [
  { nama: 'Aditya Pratama', peran: 'Kapten', poin: 520 },
  { nama: 'Siti Nurhaliza', peran: 'Wakil', poin: 430 },
  { nama: 'Bagas Saputra', poin: 395 },
  { nama: 'Dewi Lestari', poin: 360 },
  { nama: 'Rizki Ananda', poin: 340 },
  { nama: 'Putri Maharani', poin: 300 },
]

export const JUMLAH_ANGGOTA = 36

export const RIWAYAT_TIM: RiwayatTim[] = [
  { teks: 'Setor 12,5 kg plastik', poin: '+150', waktu: 'Hari ini · 09.42', warna: '#0e6b46' },
  { teks: '8 pohon Mahoni diverifikasi', poin: '+400', waktu: 'Kemarin', warna: '#4cc38a' },
  { teks: 'Naik ke peringkat #1', waktu: '2 hari lalu', warna: '#E6B422' },
  { teks: 'Setor 9,0 kg organik', poin: '+72', waktu: '3 hari lalu', warna: '#0e6b46' },
]

export const BADGES: BadgeSiswa[] = [
  { nama: 'Pemilah Pemula', syarat: 'Setor pertama', dapat: true },
  { nama: 'Rajin Setor', syarat: '10× setor', dapat: true },
  { nama: 'Penjaga Pohon', syarat: 'Tanam 5 pohon', dapat: true },
  { nama: '100 Kg Club', syarat: '100 kg sampah', dapat: true },
  { nama: 'Juara Pekan', syarat: '#1 sepekan', dapat: true },
  { nama: 'Hat-trick', syarat: '3× juara pekan', dapat: false },
  { nama: 'Sultan Kompos', syarat: '50 kg organik', dapat: false },
  { nama: 'Rimbawan', syarat: '25 pohon', dapat: false },
]

export const NOTIFIKASI: NotifikasiItem[] = [
  {
    judul: 'Kelasmu naik ke peringkat #1!',
    isi: 'Rajawali menyalip Garuda. Pertahankan posisi!',
    waktu: '5 mnt lalu',
    tag: 'Peringkat',
    warna: '#4cc38a',
    ikon: 'lucide:arrow-up',
    belumDibaca: true,
  },
  {
    judul: 'Event baru: Pekan Tanam Pohon',
    isi: 'Poin pohon dihitung 2× sampai 12 Juli.',
    waktu: '2 jam lalu',
    tag: 'Event',
    warna: '#0e6b46',
    ikon: 'lucide:calendar-days',
    belumDibaca: true,
  },
  {
    judul: 'Bukti tanam pohon disetujui',
    isi: '8 pohon Mahoni · +400 Poin Hijau masuk.',
    waktu: 'Kemarin',
    tag: 'Verifikasi',
    warna: '#2D8FE0',
    ikon: 'lucide:check',
    belumDibaca: false,
  },
  {
    judul: 'Garuda mendekat!',
    isi: 'Selisih tinggal 310 poin di posisi #2.',
    waktu: 'Kemarin',
    tag: 'Peringatan',
    warna: '#C0392B',
    ikon: 'lucide:triangle-alert',
    belumDibaca: false,
  },
  {
    judul: 'Musim berakhir 12 hari lagi',
    isi: 'Pekan 9 dari 16. Genjot setoran terakhir!',
    waktu: '2 hari lalu',
    tag: 'Tenggat',
    warna: '#E6B422',
    ikon: 'lucide:clock',
    belumDibaca: false,
  },
]
