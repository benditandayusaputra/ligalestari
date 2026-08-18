import type { DuelPekan, RekorDuel, StatusDuel, TimKelas } from '#shared/types'
import { KLASEMEN, MUSIM } from '#shared/data/klasemen'

/**
 * Duel Pekan: kompetisi head-to-head antar-kelas di atas poin aksi.
 *
 * Format musim 16 pekan untuk 8 tim:
 *   Pekan 1–7   : putaran 1 round-robin (metode lingkaran)
 *   Pekan 8–14  : putaran 2 (pasangan sama, posisi kandang/tandang ditukar)
 *   Pekan 15    : Pekan Wildcard, 4 duel paling ketat putaran 1 diulang
 *   Pekan 16    : Pekan Final, pasangan 1v2, 3v4, 5v6, 7v8 klasemen pekan 15
 *
 * Skor duel = Poin Hijau (aksi terverifikasi) yang dikumpulkan tim pada
 * pekan itu. Menang +3 poin duel, seri +1, kalah 0. Poin duel TIDAK ikut
 * mengurutkan klasemen utama, ia jalur gelar terpisah "Juara Duel".
 * Seluruh data deterministik dari KLASEMEN demi konsistensi demo.
 */

export const PEKAN_TANDING = 14
export const PEKAN_WILDCARD = 15
export const PEKAN_FINAL = 16

/** Urutan tim untuk jadwal = urutan data KLASEMEN (deterministik). */
const IDS = KLASEMEN.map((t) => t.id)

/**
 * Jadwal satu putaran round-robin metode lingkaran: tim pertama diam,
 * sisanya berputar satu posisi tiap pekan → (n−1) pekan × (n/2) duel.
 */
export function jadwalPutaran(ids: string[]): [string, string][][] {
  const putar = ids.slice(1)
  const pekanPekan: [string, string][][] = []
  for (let p = 0; p < ids.length - 1; p++) {
    const susunan = [ids[0]!, ...putar]
    const duel: [string, string][] = []
    for (let i = 0; i < ids.length / 2; i++) {
      duel.push([susunan[i]!, susunan[ids.length - 1 - i]!])
    }
    pekanPekan.push(duel)
    putar.unshift(putar.pop()!)
  }
  return pekanPekan
}

/**
 * Poin aksi per pekan sebuah tim (pekan 1..MUSIM.pekan), deterministik:
 * bobot pseudo-acak dari id tim + nomor pekan, dinormalkan agar jumlahnya
 * SAMA PERSIS dengan total poin tim di klasemen (klasemen ↔ duel konsisten).
 */
function poinPekanTim(id: string, total: number): number[] {
  const bobot = Array.from({ length: MUSIM.pekan }, (_, i) => {
    let h = (i + 1) * 37
    for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 997
    return 0.72 + (h % 100) / 180 // variasi ±28% antar pekan
  })
  const totalBobot = bobot.reduce((a, b) => a + b, 0)
  const poin = bobot.map((b) => Math.round((total * b) / totalBobot / 5) * 5)
  // Sisa pembulatan dilimpahkan ke pekan berjalan agar jumlah tetap persis.
  const sisa = total - poin.reduce((a, b) => a + b, 0)
  poin[MUSIM.pekan - 1] = Math.max(0, poin[MUSIM.pekan - 1]! + sisa)
  return poin
}

/** Poin aksi per pekan seluruh tim, indeks 0 = pekan 1. */
export const POIN_PEKAN: Record<string, number[]> = Object.fromEntries(
  KLASEMEN.map((t) => [t.id, poinPekanTim(t.id, t.poin)]),
)

const statusPekan = (pekan: number): StatusDuel =>
  pekan < MUSIM.pekan ? 'selesai' : pekan === MUSIM.pekan ? 'berjalan' : 'menyusul'

function buatDuel(pekan: number, kandang: string, tandang: string): DuelPekan {
  const dimainkan = pekan <= MUSIM.pekan
  return {
    pekan,
    kandang,
    tandang,
    skorKandang: dimainkan ? (POIN_PEKAN[kandang]?.[pekan - 1] ?? null) : null,
    skorTandang: dimainkan ? (POIN_PEKAN[tandang]?.[pekan - 1] ?? null) : null,
    status: statusPekan(pekan),
  }
}

const putaran1 = jadwalPutaran(IDS)

/** Pekan 1–14: dua putaran penuh (putaran 2 menukar kandang/tandang). */
const pekanTanding: DuelPekan[][] = [
  ...putaran1.map((duel, p) => duel.map(([a, b]) => buatDuel(p + 1, a, b))),
  ...putaran1.map((duel, p) => duel.map(([a, b]) => buatDuel(p + 8, b, a))),
]

/**
 * Pekan 15 (Wildcard): 4 duel putaran 1 dengan selisih skor terkecil
 * diulang: deterministik karena seluruh putaran 1 sudah selesai. Duel
 * diambil rakus dari yang paling ketat; tiap tim maksimal tampil sekali
 * agar semua duel wildcard bisa dimainkan pada pekan yang sama.
 */
const duelWildcard: DuelPekan[] = []
{
  const sudahMain = new Set<string>()
  const kandidat = pekanTanding
    .slice(0, 7)
    .flat()
    .map((d) => ({ ...d, selisih: Math.abs((d.skorKandang ?? 0) - (d.skorTandang ?? 0)) }))
    .sort((a, b) => a.selisih - b.selisih || a.pekan - b.pekan)
  for (const d of kandidat) {
    if (duelWildcard.length === 4) break
    if (sudahMain.has(d.kandang) || sudahMain.has(d.tandang)) continue
    sudahMain.add(d.kandang)
    sudahMain.add(d.tandang)
    duelWildcard.push(buatDuel(PEKAN_WILDCARD, d.kandang, d.tandang))
  }
}

/**
 * Pekan 16 (Final): pasangan menurut posisi klasemen pekan 15; susunan di
 * bawah masih proyeksi dari klasemen saat ini (lihat CATATAN_PEKAN).
 */
const duelFinal: DuelPekan[] = [0, 2, 4, 6].map((i) =>
  buatDuel(PEKAN_FINAL, IDS[i]!, IDS[i + 1]!),
)

/** Jadwal lengkap musim, indeks 0 = pekan 1, berisi 4 duel per pekan. */
export const JADWAL_DUEL: DuelPekan[][] = [...pekanTanding, duelWildcard, duelFinal]

/** Label tahap sebuah pekan pada jadwal. */
export function labelPekan(pekan: number): string {
  if (pekan === PEKAN_WILDCARD) return 'Pekan Wildcard'
  if (pekan === PEKAN_FINAL) return 'Pekan Final'
  return pekan <= 7 ? 'Putaran 1' : 'Putaran 2'
}

/** Penjelasan pekan khusus, tampil di bawah daftar duelnya. */
export const CATATAN_PEKAN: Record<number, string> = {
  [PEKAN_WILDCARD]:
    'Empat duel paling ketat putaran 1 (selisih skor terkecil) diulang sebagai laga wildcard. ' +
    'Hasilnya menyusul setelah 14 pekan tanding rampung.',
  [PEKAN_FINAL]:
    'Pasangan final mengikuti posisi klasemen pekan 15: peringkat 1 vs 2, 3 vs 4, dan seterusnya. ' +
    'Susunan di atas masih proyeksi dari klasemen saat ini dan dapat berubah.',
}

const rekorKosong = (): RekorDuel => ({ main: 0, menang: 0, seri: 0, kalah: 0, selisih: 0, poinDuel: 0 })

/** Rekor duel per tim, hanya dari duel berstatus selesai (pekan 1–8). */
export const REKOR_DUEL: Record<string, RekorDuel> = Object.fromEntries(IDS.map((id) => [id, rekorKosong()]))

for (const duel of JADWAL_DUEL.flat()) {
  if (duel.status !== 'selesai' || duel.skorKandang == null || duel.skorTandang == null) continue
  const kandang = REKOR_DUEL[duel.kandang]!
  const tandang = REKOR_DUEL[duel.tandang]!
  const selisih = duel.skorKandang - duel.skorTandang
  kandang.main += 1
  tandang.main += 1
  kandang.selisih += selisih
  tandang.selisih -= selisih
  if (selisih > 0) {
    kandang.menang += 1
    kandang.poinDuel += 3
    tandang.kalah += 1
  } else if (selisih < 0) {
    tandang.menang += 1
    tandang.poinDuel += 3
    kandang.kalah += 1
  } else {
    kandang.seri += 1
    tandang.seri += 1
    kandang.poinDuel += 1
    tandang.poinDuel += 1
  }
}

/** Satu baris klasemen duel: tim + rekornya. */
export interface BarisKlasemenDuel {
  tim: TimKelas
  rekor: RekorDuel
}

/**
 * Klasemen Duel: jalur gelar "Juara Duel", diurutkan poin duel, lalu
 * selisih skor, lalu Poin Hijau. Terpisah dari klasemen utama.
 */
export const KLASEMEN_DUEL: BarisKlasemenDuel[] = KLASEMEN.map((tim) => ({
  tim,
  rekor: REKOR_DUEL[tim.id]!,
})).sort(
  (a, b) =>
    b.rekor.poinDuel - a.rekor.poinDuel ||
    b.rekor.selisih - a.rekor.selisih ||
    b.tim.poin - a.tim.poin,
)
