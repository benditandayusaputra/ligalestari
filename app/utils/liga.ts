const TINTA = '#16201A'

/** Luminansi relatif WCAG dari warna heks #RRGGBB. */
function luminansi(heks: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(heks.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

const kontras = (l1: number, l2: number) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

/**
 * Pilih warna teks paling kontras (putih atau tinta gelap) di atas warna
 * latar heks. Dipakai bersama `gayaEmblem` untuk lencana berwarna.
 */
export function tintaDiAtas(warnaLatar: string): string {
  const L = luminansi(warnaLatar)
  return kontras(1, L) >= kontras(L, luminansi(TINTA)) ? '#FFFFFF' : TINTA
}

/**
 * Gaya lencana tim yang dijamin memenuhi kontras WCAG AA (4,5:1) untuk
 * warna kelas APA PUN yang dipilih admin: warna latar digeser gelap/terang
 * seminimal mungkin sampai tinta terbaiknya lolos, lalu tintanya dipilih.
 * (Warna tengah seperti merah bata gagal dengan putih MAUPUN gelap.)
 */
export function gayaEmblem(warna: string): { background: string; color: string } {
  let latar = warna
  for (let langkah = 0; langkah < 16; langkah++) {
    const L = luminansi(latar)
    if (kontras(1, L) >= 4.5 || kontras(L, luminansi(TINTA)) >= 4.5) break
    // Geser ke arah tinta yang paling dekat lolos: putih → gelapkan, tinta → terangkan.
    const keArahGelap = kontras(1, L) >= kontras(L, luminansi(TINTA))
    const kanal = [1, 3, 5].map((i) => parseInt(latar.slice(i, i + 2), 16))
    latar =
      '#' +
      kanal
        .map((k) => {
          const baru = keArahGelap ? Math.floor(k * 0.94) : Math.min(255, Math.ceil(k * 1.06 + 3))
          return baru.toString(16).padStart(2, '0')
        })
        .join('')
  }
  return { background: latar, color: tintaDiAtas(latar) }
}

/** Warna lencana peringkat: emas, perak, perunggu, lalu netral. */
export function warnaMedali(posisi: number): { background: string; color: string } {
  const medali = ['#E6B422', '#AAB2BB', '#C77F3E']
  return posisi < 3
    ? { background: medali[posisi]!, color: tintaDiAtas(medali[posisi]!) }
    : { background: '#EFEDE4', color: '#6B746C' }
}

/** Label pergeseran peringkat: "▲ 2", "▼ 1", atau "=". */
export function labelTren(tren: number): string {
  return tren > 0 ? `▲ ${tren}` : tren < 0 ? `▼ ${Math.abs(tren)}` : '='
}

/** Inisial nama untuk avatar, mis. "Aditya Pratama" → "AP". */
export function inisial(nama: string): string {
  return nama
    .split(' ')
    .slice(0, 2)
    .map((kata) => kata[0] ?? '')
    .join('')
    .toUpperCase()
}

/* ---------- Warna merek sebagai teks ---------- */

// Latar kasus terburuk tiap tema: yang paling gelap di tema terang, dan
// yang paling terang di tema gelap. Lolos di sini berarti lolos di
// seluruh permukaan tema tersebut.
const LATAR_TERANG = '#E3ECDF'
const LATAR_GELAP = '#24332A'

const keRgb = (heks: string): number[] => [1, 3, 5].map((i) => parseInt(heks.slice(i, i + 2), 16))

const keHeks = (rgb: number[]): string =>
  `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`

/** Campur dua warna sRGB; `porsi` adalah bagian warna kedua (0..1). */
function campur(a: string, b: string, porsi: number): string {
  const x = keRgb(a)
  const y = keRgb(b)
  return keHeks(x.map((c, i) => c + (y[i]! - c) * porsi))
}

const rasio = (a: string, b: string) => kontras(luminansi(a), luminansi(b))

/** Geser warna ke `tujuan` seminimal mungkin sampai lolos AA di atas `latar`. */
function geserSampaiLolos(warna: string, latar: string, tujuan: string): string {
  for (let p = 0; p <= 1; p += 0.02) {
    const kandidat = campur(warna, tujuan, p)
    if (rasio(kandidat, latar) >= 4.5) return kandidat
  }
  return tujuan
}

/**
 * Pasangan warna teks aman untuk warna merek bebas (kategori sampah, tag
 * notifikasi, sumber poin tim). Warna aslinya dirancang sebagai isian bar
 * dan titik, jadi hampir semuanya gagal kontras bila dipakai apa adanya
 * sebagai teks; di sini tiap warna digeser ke gelap (tema terang) atau ke
 * terang (tema gelap) seminimal mungkin sampai lolos 4,5:1.
 *
 * Keduanya dipasang sekaligus sebagai custom property lalu dipilih kelas
 * `.teks-merek` menurut tema aktif, sehingga tidak perlu JavaScript saat
 * runtime dan hasil prerender tetap benar di kedua tema.
 *
 * `tint` adalah porsi warna merek yang ikut mewarnai latarnya, mis. chip
 * kategori memakai latar 13% warna yang sama.
 */
export function teksMerek(warna: string, tint = 0): Record<string, string> {
  return {
    '--merek-terang': geserSampaiLolos(warna, campur(LATAR_TERANG, warna, tint), '#000000'),
    '--merek-gelap': geserSampaiLolos(warna, campur(LATAR_GELAP, warna, tint), '#FFFFFF'),
  }
}
