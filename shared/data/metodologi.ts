import type { JenisPohon } from '#shared/types'

/**
 * Tabel acuan serapan CO₂ (kg/pohon/tahun) yang dipakai mesin perhitungan.
 * Sumber utama: Endes N. Dahlan (2007), IPB.
 */
export const JENIS_POHON: JenisPohon[] = [
  { nama: 'Trembesi', latin: 'Samanea saman', serapan: 28488, sumber: 'Dahlan, IPB', warna: '#4cc38a' },
  { nama: 'Beringin', latin: 'Ficus benjamina', serapan: 535.9, sumber: 'Dahlan, IPB', warna: '#0e6b46' },
  { nama: 'Mahoni', latin: 'Swietenia mahagoni', serapan: 295.7, sumber: 'Dahlan, IPB', warna: '#5C7A12' },
  { nama: 'Angsana', latin: 'Pterocarpus indicus', serapan: 11.1, sumber: 'Dahlan, IPB', warna: '#d9a13a' },
  { nama: 'Bungur', latin: 'Lagerstroemia speciosa', serapan: 10.4, sumber: 'Dahlan, IPB', warna: '#7B4BD1' },
]

export const SUMBER_METODOLOGI = [
  'Endes N. Dahlan (2007), IPB — kajian jumlah pohon penyerap karbon dioksida di kawasan perkotaan.',
  'KLHK — Sistem Informasi Pengelolaan Sampah Nasional (SIPSN), 2023.',
  'Nilai bersifat acuan; dapat berbeda menurut sumber, usia pohon, dan metode pengukuran.',
]
