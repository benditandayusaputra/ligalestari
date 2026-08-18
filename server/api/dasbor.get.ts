import type { AnggotaTim, BadgeSiswa, NotifikasiItem, RiwayatTim } from '#shared/types'
import { ANGGOTA_TIM, BADGES, JUMLAH_ANGGOTA, NOTIFIKASI, RINCIAN_POIN, RIWAYAT_TIM, SAYA } from '#shared/data/dasbor'
import { KOMPOSISI_KELAS } from '#shared/data/klasemen'

/** Seluruh data dasbor siswa yang sedang masuk. */
export default defineEventHandler(async (event) => {
  // Kelas mengikuti sesi login; tanpa sesi memakai kelas demo.
  const sesi = await getUserSession(event)
  const kelasAktif = sesi.user?.kelasId ?? 'rpl'

  const sb = pakaiSupabase()
  if (sb) {
    const [tim, siswa, riwayat, badge, notifikasi] = await Promise.all([
      sb.from('tim').select('poin_sampah, poin_pohon, jumlah_siswa').eq('id', kelasAktif).maybeSingle(),
      sb.from('siswa').select().eq('kelas_id', kelasAktif).order('poin', { ascending: false }),
      sb.from('riwayat_tim').select().eq('kelas_id', kelasAktif).order('urutan'),
      sb.from('badge').select().order('urutan'),
      sb.from('notifikasi').select().order('urutan'),
    ])

    // Profil = siswa milik sesi bila ada; selain itu anggota teratas.
    const profil =
      (sesi.user && siswa.data?.find((s) => s.nama === sesi.user!.nama)) || siswa.data?.[0]
    if (!tim.error && tim.data && !siswa.error && profil && !riwayat.error && !badge.error && !notifikasi.error) {
      const totalPoin = tim.data.poin_sampah + tim.data.poin_pohon
      return {
        saya: {
          nama: profil.nama as string,
          kelasId: profil.kelas_id as string,
          level: profil.level as number,
          namaLevel: profil.nama_level as string,
          poin: profil.poin as number,
          kg: profil.kg as number,
          pohon: profil.pohon as number,
          persenLevel: profil.persen_level as number,
          poinKeLevelBerikut: profil.poin_ke_level_berikut as number,
        },
        rincianPoin: [
          { label: 'Setoran sampah', poin: tim.data.poin_sampah as number, persen: Math.round((tim.data.poin_sampah / totalPoin) * 100), warna: '#2D8FE0' },
          { label: 'Tanam pohon', poin: tim.data.poin_pohon as number, persen: Math.round((tim.data.poin_pohon / totalPoin) * 100), warna: '#1FA34F' },
        ],
        anggota: siswa.data.map((s): AnggotaTim => ({ nama: s.nama, peran: s.peran ?? undefined, poin: s.poin })),
        jumlahAnggota: tim.data.jumlah_siswa as number,
        riwayat: (riwayat.data ?? []).map((r): RiwayatTim => ({ teks: r.teks, waktu: r.waktu, poin: r.poin ?? undefined, warna: r.warna })),
        badges: (badge.data ?? []).map((b): BadgeSiswa => ({ nama: b.nama, syarat: b.syarat, dapat: b.dapat })),
        notifikasi: (notifikasi.data ?? []).map(
          (n): NotifikasiItem => ({ judul: n.judul, isi: n.isi, waktu: n.waktu, tag: n.tag, warna: n.warna, ikon: n.ikon, belumDibaca: n.belum_dibaca }),
        ),
        // Kg per kategori — memakai data demo sampai tabelnya tersedia.
        komposisi: KOMPOSISI_KELAS[kelasAktif] ?? null,
      }
    }
  }

  return {
    saya: SAYA,
    rincianPoin: RINCIAN_POIN,
    anggota: ANGGOTA_TIM,
    jumlahAnggota: JUMLAH_ANGGOTA,
    riwayat: RIWAYAT_TIM,
    badges: BADGES,
    notifikasi: NOTIFIKASI,
    komposisi: KOMPOSISI_KELAS[kelasAktif] ?? null,
  }
})
