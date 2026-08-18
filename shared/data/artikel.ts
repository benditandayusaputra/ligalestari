import type { Artikel, KategoriArtikel } from '#shared/types'

/** Gaya visual tiap kategori artikel (chip, titik, dan warna ilustrasi). */
export const KATEGORI: Record<
  KategoriArtikel,
  { label: string; chipBg: string; chipTeks: string; titik: string; thumbBg: string }
> = {
  sampah: { label: 'Sampah', chipBg: '#E4F0E7', chipTeks: '#0e6b46', titik: '#4cc38a', thumbBg: '#2E7D46' },
  pohon: { label: 'Pohon', chipBg: '#F2F7DC', chipTeks: '#52680E', titik: '#d9a13a', thumbBg: '#3C6B2E' },
}

// Pembantu singkat agar isi artikel di bawah tetap mudah dibaca.
const P = (teks: string) => ({ jenis: 'paragraf', teks }) as const
const H = (teks: string) => ({ jenis: 'judul', teks }) as const
const LI = (teks: string) => ({ jenis: 'poin', teks }) as const

export const DAFTAR_ARTIKEL: Artikel[] = [
  {
    slug: 'memilah-sampah-organik-anorganik',
    judul: 'Memilah Sampah Organik & Anorganik dengan Benar',
    kategori: 'sampah',
    menitBaca: 5,
    tanggal: '2026-02-09',
    thumb: { tag: 'foto · tempat sampah terpilah', alt: 'dua tempat sampah berlabel organik dan anorganik' },
    ringkasan:
      'Langkah dasar yang sering terlewat: memisahkan sampah sejak dari sumbernya supaya mudah diolah dan bernilai poin.',
    isi: [
      P('Memilah sampah adalah fondasi dari semua program daur ulang. Tanpa pemilahan yang benar di sumbernya, sampah organik dan anorganik bercampur dan jauh lebih sulit diolah.'),
      H('Kenali tiga kelompok utama'),
      LI('Organik — sisa makanan, daun, kulit buah. Bisa dijadikan kompos.'),
      LI('Anorganik — plastik, kertas, logam, kaca. Bisa didaur ulang atau disetor.'),
      LI('Residu — popok, puntung, styrofoam. Sulit didaur ulang, dibuang terakhir.'),
      P('Saat menyetor ke event LigaLestari, sampah yang sudah terpilah ditimbang lebih cepat dan langsung dihitung jadi Poin Hijau untuk kelasmu.'),
      H('Tips di kelas'),
      P('Sediakan minimal dua wadah berbeda warna, beri label jelas, dan tunjuk piket harian untuk mengecek isinya. Kebiasaan kecil ini menjaga kualitas setoran tetap tinggi.'),
    ],
    sumber: [
      'KLHK — Sistem Informasi Pengelolaan Sampah Nasional (SIPSN), 2023.',
      'Kementerian LHK — Panduan Pemilahan Sampah Rumah Tangga.',
    ],
  },
  {
    slug: 'trembesi-raksasa-penyerap-karbon',
    judul: 'Trembesi: Sang Raksasa Penyerap Karbon',
    kategori: 'pohon',
    menitBaca: 4,
    tanggal: '2026-02-16',
    thumb: { tag: 'foto · pohon trembesi rindang', alt: 'pohon trembesi besar dengan tajuk melebar' },
    ringkasan:
      'Satu pohon trembesi dewasa diperkirakan menyerap puluhan ribu kilogram CO₂ per tahun. Kenapa ia begitu istimewa?',
    isi: [
      P('Trembesi (Samanea saman) terkenal sebagai salah satu pohon peneduh dengan daya serap karbon tertinggi. Tajuknya yang lebar dan pertumbuhannya cepat membuatnya favorit untuk penghijauan.'),
      H('Mengapa serapannya tinggi'),
      P('Estimasi yang banyak dikutip menyebut satu trembesi dewasa mampu menyerap sekitar 28.488 kg CO₂ per tahun. Angka ini adalah estimasi maksimum pada kondisi ideal dan akan bervariasi menurut usia serta lingkungan.'),
      H('Catatan penanaman'),
      LI('Butuh ruang luas — tajuk dewasa bisa melebar belasan meter.'),
      LI('Cocok untuk lapangan atau tepi area sekolah, bukan dekat bangunan.'),
      P('Karena dampaknya besar, setiap trembesi yang ditanam di LigaLestari memberi kontribusi CO₂ yang signifikan pada total dampak kelasmu.'),
    ],
    sumber: [
      'Endes N. Dahlan, IPB — kajian serapan CO₂ pohon trembesi.',
      'Lihat halaman Metodologi Dampak LigaLestari untuk rincian perhitungan.',
    ],
  },
  {
    slug: 'botol-plastik-jadi-ecobrick',
    judul: 'Dari Botol Plastik ke Ecobrick',
    kategori: 'sampah',
    menitBaca: 6,
    tanggal: '2026-02-23',
    thumb: { tag: 'foto · ecobrick warna-warni', alt: 'botol plastik diisi padat menjadi ecobrick' },
    ringkasan:
      'Mengubah sampah plastik lunak jadi bata padat yang bisa dipakai membuat bangku dan taman sekolah.',
    isi: [
      P('Ecobrick adalah botol plastik yang diisi padat dengan sampah plastik bersih dan kering hingga menjadi bata yang kokoh. Ini cara menahan plastik agar tidak mencemari lingkungan.'),
      H('Cara membuat'),
      LI('Kumpulkan botol seragam dan plastik bersih-kering.'),
      LI('Potong kecil plastik, masukkan, padatkan dengan tongkat.'),
      LI('Timbang — botol 600 ml idealnya berisi ±200 gram plastik.'),
      P('Ecobrick yang padat bisa dirangkai jadi bangku, meja, atau pembatas taman. Selain mengurangi sampah, hasilnya bermanfaat langsung untuk sekolah.'),
    ],
    sumber: ['Global Ecobrick Alliance — panduan kepadatan ecobrick.'],
  },
  {
    slug: 'cara-menanam-pohon-optimal',
    judul: 'Cara Menanam Pohon agar Tumbuh Optimal',
    kategori: 'pohon',
    menitBaca: 5,
    tanggal: '2026-03-02',
    thumb: { tag: 'foto · penanaman bibit', alt: 'tangan menanam bibit pohon di lubang tanam' },
    ringkasan:
      'Menanam itu mudah, merawat agar hidup itu kuncinya. Panduan singkat dari lubang tanam sampai perawatan awal.',
    isi: [
      P('Keberhasilan penghijauan tidak diukur dari jumlah yang ditanam, tapi dari berapa yang bertahan hidup. Perawatan bulan-bulan pertama menentukan.'),
      H('Langkah dasar'),
      LI('Gali lubang dua kali lebar polybag bibit.'),
      LI('Lepas polybag hati-hati tanpa merusak akar.'),
      LI('Timbun, padatkan pelan, lalu siram sampai lembap.'),
      LI('Beri ajir/penyangga bila bibit masih lemah.'),
      P('Catat tanggal tanam dan lokasinya. Di LigaLestari, data ini muncul di Peta Persebaran Pohon sebagai bukti dampak kelasmu.'),
    ],
    sumber: ['Kementerian LHK — pedoman teknis penanaman pohon.'],
  },
  {
    slug: 'kompos-sisa-makanan-kantin',
    judul: 'Kompos dari Sisa Makanan Kantin',
    kategori: 'sampah',
    menitBaca: 7,
    tanggal: '2026-03-09',
    thumb: { tag: 'foto · komposter sekolah', alt: 'wadah komposter berisi sisa organik dan daun' },
    ringkasan: 'Sisa makanan kantin bukan masalah, tapi bahan baku. Ubah jadi kompos untuk taman sekolah.',
    isi: [
      P('Sampah organik mendominasi timbulan sampah sekolah. Dengan pengomposan sederhana, sisa makanan berubah jadi pupuk gratis sekaligus mengurangi beban TPA.'),
      H('Metode sederhana'),
      LI('Cacah sisa organik agar cepat terurai.'),
      LI('Selang-seling lapisan basah (sisa makanan) dan kering (daun).'),
      LI('Aduk berkala, jaga kelembapan seperti spons diperas.'),
      P('Dalam beberapa minggu kompos matang berbau tanah dan siap menyuburkan tanaman. Volume sampah yang dikelola juga dihitung sebagai kontribusi kelas.'),
    ],
    sumber: ['KLHK — panduan pengomposan skala komunitas.'],
  },
  {
    slug: 'mengenal-pohon-angsana',
    judul: 'Mengenal Pohon Angsana di Lingkungan Sekolah',
    kategori: 'pohon',
    menitBaca: 3,
    tanggal: '2026-03-16',
    thumb: { tag: 'foto · pohon angsana berbunga', alt: 'pohon angsana dengan bunga kuning' },
    ringkasan:
      'Peneduh jalan yang umum, tumbuh cepat, dan ramah dirawat — pilihan aman untuk penghijauan pemula.',
    isi: [
      P('Angsana (Pterocarpus indicus) sering dijumpai sebagai pohon peneduh jalan. Pertumbuhannya cepat dan perawatannya relatif mudah, cocok untuk area sekolah.'),
      H('Karakter singkat'),
      LI('Bunga kuning harum saat musimnya.'),
      LI('Tajuk rindang, memberi keteduhan cepat.'),
      P('Estimasi serapannya sekitar 11,1 kg CO₂ per pohon per tahun — lebih kecil dari trembesi, tapi mudah hidup dan tetap berkontribusi pada total dampak.'),
    ],
    sumber: ['Lihat tabel acuan di halaman Metodologi Dampak LigaLestari.'],
  },
]

export function getArtikel(slug: string): Artikel | undefined {
  return DAFTAR_ARTIKEL.find((a) => a.slug === slug)
}

/** Artikel lain satu kategori; dilengkapi kategori lain bila kurang dari `jumlah`. */
export function pilihTerkait(semua: Artikel[], slug: string, jumlah = 3): Artikel[] {
  const acuan = semua.find((a) => a.slug === slug)
  if (!acuan) return []
  const lain = semua.filter((a) => a.slug !== slug)
  const sekategori = lain.filter((a) => a.kategori === acuan.kategori)
  return [...sekategori, ...lain.filter((a) => a.kategori !== acuan.kategori)].slice(0, jumlah)
}

export function artikelTerkait(slug: string, jumlah = 3): Artikel[] {
  return pilihTerkait(DAFTAR_ARTIKEL, slug, jumlah)
}
