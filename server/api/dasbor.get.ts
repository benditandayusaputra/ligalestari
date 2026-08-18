import type { AnggotaTim, BadgeSiswa, NotifikasiItem, RiwayatTim } from '#shared/types'
import { ANGGOTA_TIM, BADGES, JUMLAH_ANGGOTA, NOTIFIKASI, RINCIAN_POIN, RIWAYAT_TIM, SAYA } from '#shared/data/dasbor'
import { KOMPOSISI_KELAS } from '#shared/data/klasemen'

/** Seluruh data dasbor siswa yang sedang masuk. */
export default defineEventHandler(async (event) => {
  // Kelas mengikuti sesi login; tanpa sesi memakai kelas demo.
  const sesi = await getUserSession(event)
  const kelasAktif = sesi.user?.kelasId ?? 'rpl'

  const hasil = await kueri(async (sql) => {
    const [tim, siswa, riwayat, badge, notifikasi] = await Promise.all([
      sql`select poin_sampah, poin_pohon, jumlah_siswa from tim where id = ${kelasAktif}`,
      sql`select nama, kelas_id, peran, poin, level, nama_level, kg, pohon,
                 persen_level, poin_ke_level_berikut
            from siswa
           where kelas_id = ${kelasAktif}
           order by poin desc`,
      sql`select teks, waktu, poin, warna from riwayat_tim
           where kelas_id = ${kelasAktif} order by urutan`,
      sql`select nama, syarat, dapat from badge order by urutan`,
      sql`select judul, isi, waktu, tag, warna, ikon, belum_dibaca from notifikasi order by urutan`,
    ])
    return tim.length && siswa.length ? { tim: tim[0]!, siswa, riwayat, badge, notifikasi } : null
  })

  if (hasil) {
    const { tim, siswa, riwayat, badge, notifikasi } = hasil
    // Profil = siswa milik sesi bila ada; selain itu anggota teratas.
    const profil = (sesi.user && siswa.find((s) => s.nama === sesi.user!.nama)) || siswa[0]!
    const totalPoin = tim.poin_sampah + tim.poin_pohon
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
        { label: 'Setoran sampah', poin: tim.poin_sampah as number, persen: Math.round((tim.poin_sampah / totalPoin) * 100), warna: '#2D8FE0' },
        { label: 'Tanam pohon', poin: tim.poin_pohon as number, persen: Math.round((tim.poin_pohon / totalPoin) * 100), warna: '#4cc38a' },
      ],
      anggota: siswa.map((s): AnggotaTim => ({ nama: s.nama, peran: s.peran ?? undefined, poin: s.poin })),
      jumlahAnggota: tim.jumlah_siswa as number,
      riwayat: riwayat.map((r): RiwayatTim => ({ teks: r.teks, waktu: r.waktu, poin: r.poin ?? undefined, warna: r.warna })),
      badges: badge.map((b): BadgeSiswa => ({ nama: b.nama, syarat: b.syarat, dapat: b.dapat })),
      notifikasi: notifikasi.map(
        (n): NotifikasiItem => ({ judul: n.judul, isi: n.isi, waktu: n.waktu, tag: n.tag, warna: n.warna, ikon: n.ikon, belumDibaca: n.belum_dibaca }),
      ),
      // Kg per kategori, memakai data demo sampai tabelnya tersedia.
      komposisi: KOMPOSISI_KELAS[kelasAktif] ?? null,
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
