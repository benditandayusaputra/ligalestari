import type { KlaimPembeda, PlatformPembeda, TonggakDampak } from '#shared/types'

/**
 * Bahan halaman "Mengapa Berbeda" — posisi LigaLestari terhadap lanskap
 * aplikasi lingkungan yang sudah ada.
 *
 * Riset lanskap dilakukan atas sembilan platform pembanding: lima layanan
 * bank sampah/daur ulang Indonesia (Smash.id, Rekosistem, Octopus, Duitin,
 * Mallsampah), satu sistem pelaporan pemerintah (Sidia — KLHK), satu
 * kampanye penghijauan (LindungiHutan), dan dua aplikasi lingkungan global
 * (Litterati, JouleBug). Status tiap sel mengacu pada fitur yang tersedia
 * untuk publik pada saat riset; URL sumber per platform dicantumkan di
 * daftar pustaka proposal.
 */

/** Enam kriteria pembanding. Urutannya mengikat urutan `sel` tiap platform. */
export const KRITERIA_PEMBEDA = [
  'Liga antar-kelas bermusim',
  'Poin lintas event',
  'Verifikasi bukti foto + GPS',
  'CO₂ per aksi siswa',
  'Jembatan Adiwiyata',
  'Konteks sekolah Indonesia',
]

/** Pintasan penulis matriks agar barisnya tetap terbaca sebagai tabel. */
const ada = (catatan?: string) => ({ status: 'ada' as const, catatan })
const parsial = (catatan?: string) => ({ status: 'parsial' as const, catatan })
const tidak = (catatan?: string) => ({ status: 'tidak' as const, catatan })

export const LANSKAP: PlatformPembeda[] = [
  {
    nama: 'Smash.id',
    fokus: 'Manajemen bank sampah',
    sel: [tidak(), tidak(), tidak('transaksional'), tidak(), tidak(), tidak()],
  },
  {
    nama: 'Rekosistem',
    fokus: 'Waste hub & penjemputan',
    sel: [tidak(), tidak(), tidak(), tidak(), tidak(), tidak()],
  },
  {
    nama: 'Octopus',
    fokus: 'Marketplace pemulung',
    sel: [tidak(), tidak(), tidak(), tidak(), tidak(), tidak()],
  },
  {
    nama: 'Duitin',
    fokus: 'Pickup daur ulang',
    sel: [tidak(), tidak(), tidak(), tidak(), tidak(), tidak()],
  },
  {
    nama: 'Mallsampah',
    fokus: 'Jual-beli sampah',
    sel: [tidak(), tidak(), tidak(), tidak(), tidak(), tidak()],
  },
  {
    nama: 'Sidia (KLHK)',
    fokus: 'Pelaporan administratif',
    sel: [tidak(), tidak(), tidak('berbasis dokumen'), tidak(), parsial('top-down'), ada('sebatas birokrasi')],
  },
  {
    nama: 'LindungiHutan',
    fokus: 'Kampanye donasi pohon',
    sel: [tidak(), tidak(), tidak('ditanam mitra petani'), parsial('bukan aksi penggunanya'), tidak(), tidak()],
  },
  {
    nama: 'Litterati',
    fokus: 'Feed foto sampah global',
    sel: [tidak('tanpa musim'), tidak(), parsial('geotag tanpa moderasi'), tidak(), tidak(), tidak()],
  },
  {
    nama: 'JouleBug',
    fokus: 'Tantangan kebiasaan hijau',
    sel: [tidak('tanpa klasemen persisten'), parsial('self-reported'), tidak(), tidak(), tidak(), tidak()],
  },
  {
    nama: 'LigaLestari',
    fokus: 'Liga lingkungan antar-kelas',
    kami: true,
    sel: [ada(), ada(), ada(), ada(), ada(), ada()],
  },
]

/** Jumlah kriteria yang dipenuhi penuh oleh sebuah platform. */
export function jumlahAda(platform: PlatformPembeda): number {
  return platform.sel.filter((s) => s.status === 'ada').length
}

/** Pesaing dengan centang penuh terbanyak — dipakai kalimat kesimpulan. */
export const TERBANYAK_PESAING = Math.max(
  ...LANSKAP.filter((p) => !p.kami).map(jumlahAda),
)

/**
 * Enam klaim keunikan, masing-masing dengan bukti yang bisa dibuka
 * pembaca sendiri di situs ini — bukan klaim yang berhenti di teks.
 */
export const KLAIM: KlaimPembeda[] = [
  {
    klaim: 'Liga antar-kelas bermusim',
    penjelasan:
      'Klasemen persisten dengan musim, pekan, dan tren peringkat — struktur kompetisi utuh, bukan papan poin yang direset.',
    bukti: 'Klasemen musim berjalan beserta tren pekan-ke-pekan',
    ke: '/#klasemen',
  },
  {
    klaim: 'Poin lintas event',
    penjelasan:
      'Dua aksi fisik yang berbeda — setor sampah terpilah dan tanam pohon — bertemu di satu papan skor dengan rumus yang sama-sama terbuka.',
    bukti: 'Formula Poin Hijau di halaman Aturan Liga',
    ke: '/aturan',
  },
  {
    klaim: 'Poin hanya lahir dari bukti',
    penjelasan:
      'Setoran ditimbang admin; bukti tanam wajib menyertakan foto dan koordinat. Kebalikan dari model self-reported dan feed tanpa moderasi.',
    bukti: 'Alur verifikasi bukti dan status penolakannya',
    ke: '/aturan#verifikasi',
  },
  {
    klaim: 'CO₂ melekat pada aksi siswa',
    penjelasan:
      'Serapan karbon dihitung per jenis pohon dengan angka acuan ilmiah bersitasi, atas pohon yang ditanam siswa sendiri — bukan didelegasikan ke pihak ketiga.',
    bukti: 'Tabel acuan serapan CO₂ dan sumbernya',
    ke: '/metodologi',
  },
  {
    klaim: 'Jembatan bottom-up ke Adiwiyata',
    penjelasan:
      'Data yang lahir dari aktivitas harian siswa langsung terangkum jadi bahan laporan sekolah — arah yang berlawanan dengan pelaporan top-down.',
    bukti: 'Laporan Dampak di panel admin (perlu masuk sebagai admin)',
  },
  {
    klaim: 'Identitas kolektif kelas',
    penjelasan:
      'Yang dirayakan adalah kelas, bukan individu. Kartu pencapaian terbit atas nama tim sehingga kebanggaannya dibagi sekelas.',
    bukti: 'Pratinjau kartu pencapaian pemuncak klasemen',
    ke: '/#fitur',
  },
]

/**
 * Rencana pengembangan: arsitektur "kelas = tim, sekolah = liga" naik
 * tingkat tanpa mengubah mekanik intinya.
 */
export const TONGGAK: TonggakDampak[] = [
  {
    label: 'Musim 1',
    judul: 'Liga satu sekolah',
    teks: 'Satu sekolah menjalankan musim penuh dan menghasilkan laporan dampak Adiwiyata pertamanya.',
  },
  {
    label: 'Musim 2',
    judul: 'Multi-sekolah',
    teks: 'Beberapa sekolah berjalan berdampingan di atas database produksi, menggantikan data demo.',
  },
  {
    label: 'Musim 3',
    judul: 'Liga Kota',
    teks: 'Kompetisi antar-sekolah satu kota, dengan bank sampah mitra menyerap setoran yang terkumpul.',
  },
  {
    label: 'Lanjutan',
    judul: 'Dasbor dinas',
    teks: 'Titik tanam berkoordinat dan timbangan setoran menjadi baris data dashboard Dinas LH/Pendidikan.',
  },
  {
    label: 'Jangka panjang',
    judul: 'Liga Lestari Nasional',
    teks: 'Protokol poin dan verifikasi dibuka agar sekolah mana pun bisa menjalankan musimnya sendiri.',
  },
]
