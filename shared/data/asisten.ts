import type { PesanChat } from '#shared/types'

/**
 * Basis pengetahuan Asisten Hijau — dipakai widget mengambang,
 * halaman /dasbor/asisten, dan endpoint /api/asisten.
 * Berjalan tanpa backend/API key; tinggal tambah entri untuk memperluas.
 */

export const SAPAAN_ASISTEN = 'Hai! Aku Asisten Hijau. Ada yang mau ditanya soal sampah atau pohon?'

export const CHAT_PEMBUKA: PesanChat[] = [{ dari: 'bot', teks: SAPAAN_ASISTEN }]

/** Pertanyaan cepat (chips) di atas kolom input. */
export const SARAN_CHAT = [
  'Cara pilah sampah?',
  'Pohon apa yang bagus ditanam?',
  'Apa itu Poin Hijau?',
  'Cara dapat poin?',
]

/** Pasangan kata kunci → jawaban. Entri pertama yang cocok dipakai. */
const BASIS_PENGETAHUAN: { kunci: string[]; jawaban: string }[] = [
  {
    kunci: ['pilah', 'organik', 'anorganik', 'milah', 'residu'],
    jawaban:
      'Pilah jadi tiga: organik (sisa makanan, daun) untuk kompos, anorganik (plastik, kertas, logam) untuk disetor, dan residu (popok, styrofoam) dibuang terakhir. Sampah terpilah lebih cepat ditimbang dan langsung jadi Poin Hijau!',
  },
  {
    kunci: ['pohon apa', 'bagus ditanam', 'jenis pohon', 'trembesi', 'tanam apa'],
    jawaban:
      'Trembesi juaranya — serapan CO₂-nya paling tinggi di tabel acuan kami. Mahoni dan Beringin juga bagus; Angsana paling mudah hidup untuk pemula. Lihat rinciannya di halaman Metodologi ya!',
  },
  {
    kunci: ['apa itu poin', 'poin hijau itu', 'maksud poin'],
    jawaban:
      'Poin Hijau adalah skor tim kelasmu di liga. Semua aksi hijau — setor sampah dan tanam pohon — dihitung jadi poin, lalu kelas bersaing di klasemen sepanjang musim.',
  },
  {
    kunci: ['dapat poin', 'cara dapat', 'kumpul poin', 'nambah poin', 'raih poin'],
    jawaban:
      'Dua cara: setor sampah terpilah (10 poin per kg) dan tanam pohon yang diverifikasi admin (50 poin per pohon). Saat event spesial seperti Pekan Tanam Pohon, poinnya bisa dihitung 2×!',
  },
  {
    kunci: ['event', 'ikut lomba', 'ikut kegiatan'],
    jawaban:
      'Event dibuka admin sekolah — misalnya Setoran Sampah Harian atau Pekan Tanam Pohon. Datang saat event berjalan, setor atau tanam bersama kelasmu, dan poinnya otomatis masuk klasemen.',
  },
  {
    kunci: ['kompos'],
    jawaban:
      'Kompos dibuat dari sampah organik yang ditumpuk lembap dan diaduk berkala. Dalam 3–6 minggu jadi pupuk. Hemat sampah, dapat poin!',
  },
  {
    kunci: ['co2', 'co₂', 'karbon', 'serapan'],
    jawaban:
      'Tiap pohon dihitung estimasi serapan CO₂-nya per jenis — rumus dan tabel acuannya terbuka di halaman Metodologi, jadi dampak kelasmu bisa diperiksa siapa saja.',
  },
]

const JAWABAN_DEFAULT =
  'Pertanyaan bagus! Aku paling paham soal pilah sampah, jenis pohon, Poin Hijau, dan event LigaLestari. Coba tanya salah satunya, atau jelajahi halaman Artikel untuk panduan lengkap ya 🌱'

/** Jawaban lokal berbasis kata kunci (tanpa backend). */
export function jawabanAsisten(pertanyaan: string): string {
  const teks = pertanyaan.toLowerCase()
  return BASIS_PENGETAHUAN.find((entri) => entri.kunci.some((k) => teks.includes(k)))?.jawaban ?? JAWABAN_DEFAULT
}
