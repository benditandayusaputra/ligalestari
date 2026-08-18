import type { TimKelas, TitikPeta } from '#shared/types'
import { KLASEMEN_PER_ID } from '#shared/data/klasemen'
import { TITIK_TANAM } from '#shared/data/peta'

/** Titik tanam (digabung data kelas pemiliknya) + pusat peta sekolah. */
export default defineEventHandler(async () => {
  const lokasi = await ambilLokasiSekolah()

  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('titik_tanam')
      .select('kelas_id, x, y, jumlah, jenis_pohon, co2, tanggal, foto, kelas:tim (id, nama, julukan, emblem, warna, poin, kg, pohon, co2, tren)')
      .order('id')
    if (!error && data?.length) {
      const titik: TitikPeta[] = data.map((t, indeks) => ({
        kelasId: t.kelas_id as string,
        x: Number(t.x),
        y: Number(t.y),
        jumlah: t.jumlah as number,
        jenisPohon: (t.jenis_pohon as string) ?? 'Campuran',
        co2: t.co2 as number,
        tanggal: t.tanggal as string,
        foto: (t.foto as string | null) ?? undefined,
        indeks,
        kelas: t.kelas as unknown as TimKelas,
      }))
      return { titik, lokasi }
    }
  }

  const titik: TitikPeta[] = TITIK_TANAM.map((t, indeks) => ({
    ...t,
    indeks,
    kelas: KLASEMEN_PER_ID[t.kelasId]!,
  }))
  return { titik, lokasi }
})
