import type { TimKelas, TitikPeta } from '#shared/types'
import { KLASEMEN_PER_ID } from '#shared/data/klasemen'
import { TITIK_TANAM } from '#shared/data/peta'

/** Titik tanam (digabung data kelas pemiliknya) + pusat peta sekolah. */
export default defineEventHandler(async () => {
  const lokasi = await ambilLokasiSekolah()

  // Data kelas dirakit jadi objek JSON di sisi database agar nama kolom
  // yang bertabrakan (nama, co2) tidak perlu di-alias satu per satu.
  const baris = await kueri(
    (sql) => sql`
      select t.kelas_id, t.x::float8 as x, t.y::float8 as y, t.jumlah,
             t.jenis_pohon, t.co2, t.tanggal, t.foto,
             jsonb_build_object(
               'id', k.id, 'nama', k.nama, 'julukan', k.julukan, 'emblem', k.emblem,
               'warna', k.warna, 'poin', k.poin, 'kg', k.kg, 'pohon', k.pohon,
               'co2', k.co2, 'tren', k.tren, 'jumlahSiswa', k.jumlah_siswa
             ) as kelas
        from titik_tanam t
        join tim k on k.id = t.kelas_id
       order by t.id`,
  )

  if (baris?.length) {
    const titik: TitikPeta[] = baris.map((t, indeks) => ({
      kelasId: t.kelas_id as string,
      x: t.x as number,
      y: t.y as number,
      jumlah: t.jumlah as number,
      jenisPohon: (t.jenis_pohon as string) ?? 'Campuran',
      co2: t.co2 as number,
      tanggal: t.tanggal as string,
      foto: (t.foto as string | null) ?? undefined,
      indeks,
      kelas: t.kelas as TimKelas,
    }))
    return { titik, lokasi }
  }

  const titik: TitikPeta[] = TITIK_TANAM.map((t, indeks) => ({
    ...t,
    indeks,
    kelas: KLASEMEN_PER_ID[t.kelasId]!,
  }))
  return { titik, lokasi }
})
