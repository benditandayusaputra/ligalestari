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

/** Label pergeseran peringkat: "▲ 2", "▼ 1", atau "—". */
export function labelTren(tren: number): string {
  return tren > 0 ? `▲ ${tren}` : tren < 0 ? `▼ ${Math.abs(tren)}` : '—'
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
