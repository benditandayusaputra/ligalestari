import type { BarisKomposisiProyeksi, HasilKalkulator, InputKalkulator, KategoriSampah } from '#shared/types'
import { RATE } from '#shared/data/admin'
import { DAFTAR_KATEGORI, KATEGORI_SAMPAH } from '#shared/data/kategori-sampah'
import { KLASEMEN, KOMPOSISI_LIGA, MUSIM } from '#shared/data/klasemen'

/**
 * Kalkulator proyeksi dampak satu musim.
 *
 * Seluruh angkanya diturunkan dari sumber yang sudah dipakai di tempat
 * lain, bukan konstanta baru: tarif per kategori dari kategori-sampah.ts,
 * rate poin pohon dari admin.ts, panjang musim dari klasemen.ts, dan rate
 * serapan CO2 dari tabel acuan metodologi. Dengan begitu hasil kalkulator
 * selalu sejalan dengan yang tampil di klasemen dan halaman Metodologi.
 */

/** Porsi tiap kategori terhadap total setoran liga (0..1). */
export const PROPORSI_KATEGORI: Record<KategoriSampah, number> = (() => {
  const total = DAFTAR_KATEGORI.reduce((a, k) => a + KOMPOSISI_LIGA[k], 0)
  return Object.fromEntries(
    DAFTAR_KATEGORI.map((k) => [k, KOMPOSISI_LIGA[k] / total]),
  ) as Record<KategoriSampah, number>
})()

/**
 * Tarif rata-rata tertimbang (poin/kg). Memakai komposisi setoran liga
 * yang berjalan, jadi proyeksinya realistis: bukan tarif tertinggi yang
 * mengasumsikan semua sampah adalah B3 ringan.
 */
export const TARIF_RATA = DAFTAR_KATEGORI.reduce(
  (a, k) => a + PROPORSI_KATEGORI[k] * KATEGORI_SAMPAH[k].tarif,
  0,
)

/** Rata-rata jumlah siswa per kelas pada musim berjalan, dibulatkan. */
const RERATA_SISWA = Math.round(
  KLASEMEN.reduce((a, t) => a + t.jumlahSiswa, 0) / KLASEMEN.length,
)

/** Nilai awal formulir: potret sekolah pada data musim berjalan. */
export const INPUT_BAWAAN: InputKalkulator = {
  kelas: KLASEMEN.length,
  siswaPerKelas: RERATA_SISWA,
  kgPerSiswaPerPekan: 0.8,
  pohonPerKelas: 40,
  jenisPohon: 'Angsana',
}

/** Batas isian, dipakai atribut input sekaligus penjepit nilai. */
export const BATAS = {
  kelas: { min: 1, max: 200 },
  siswaPerKelas: { min: 1, max: 60 },
  kgPerSiswaPerPekan: { min: 0.1, max: 20, langkah: 0.1 },
  pohonPerKelas: { min: 0, max: 500 },
} as const

/** Jepit nilai ke rentang yang sah; nilai bukan angka jatuh ke minimum. */
export function jepit(nilai: number, min: number, max: number): number {
  if (!Number.isFinite(nilai)) return min
  return Math.min(max, Math.max(min, nilai))
}

/**
 * Hitung proyeksi satu musim.
 * `serapan` adalah rate acuan jenis pohon terpilih (kg CO2/pohon/tahun).
 */
export function hitungProyeksi(input: InputKalkulator, serapan: number): HasilKalkulator {
  const pekan = MUSIM.totalPekan
  const kelas = jepit(input.kelas, BATAS.kelas.min, BATAS.kelas.max)
  const siswaPerKelas = jepit(input.siswaPerKelas, BATAS.siswaPerKelas.min, BATAS.siswaPerKelas.max)
  const kgPerSiswa = jepit(input.kgPerSiswaPerPekan, BATAS.kgPerSiswaPerPekan.min, BATAS.kgPerSiswaPerPekan.max)
  const pohonPerKelas = jepit(input.pohonPerKelas, BATAS.pohonPerKelas.min, BATAS.pohonPerKelas.max)

  const siswa = kelas * siswaPerKelas
  const sampahKg = Math.round(siswa * kgPerSiswa * pekan)
  const pohon = Math.round(kelas * pohonPerKelas)

  // Poin sampah dihitung per kategori lalu dijumlah, sama seperti mesin
  // liga menghitung setoran sungguhan satu per satu.
  const komposisi: BarisKomposisiProyeksi[] = DAFTAR_KATEGORI.map((k) => {
    const kg = Math.round(sampahKg * PROPORSI_KATEGORI[k])
    return {
      kategori: k,
      label: KATEGORI_SAMPAH[k].label,
      warna: KATEGORI_SAMPAH[k].warna,
      kg,
      persen: Math.round(PROPORSI_KATEGORI[k] * 100),
      poin: Math.round(kg * KATEGORI_SAMPAH[k].tarif),
    }
  })

  const poinSampah = komposisi.reduce((a, b) => a + b.poin, 0)
  const poinPohon = pohon * RATE.pohonPerBatang

  return {
    pekan,
    siswa,
    sampahKg,
    poinSampah,
    pohon,
    co2Kg: Math.round(pohon * serapan),
    poinPohon,
    totalPoin: poinSampah + poinPohon,
    tarifRata: Math.round(TARIF_RATA * 10) / 10,
    serapan,
    komposisi,
  }
}
