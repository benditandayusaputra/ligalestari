import { BUKTI_TANAM, RATE } from '#shared/data/admin'

/** Bukti tanam beserta calon poin dan status keputusannya. */
export default defineEventHandler(async () => {
  const baris = await kueri(
    (sql) => sql`select id::int as id, kelas_id, pohon, jenis_pohon, co2,
                        koordinat, lokasi, waktu, keputusan
                   from bukti_tanam
                  order by id`,
  )

  if (baris?.length) {
    return {
      daftar: baris.map((b) => ({
        id: b.id as number,
        kelasId: b.kelas_id as string,
        pohon: b.pohon as number,
        jenisPohon: b.jenis_pohon as string,
        co2: b.co2 as number,
        koordinat: b.koordinat as string,
        lokasi: b.lokasi as string,
        waktu: b.waktu as string,
        calonPoin: (b.pohon as number) * RATE.pohonPerBatang,
        keputusan: (b.keputusan ?? null) as 'disetujui' | 'ditolak' | null,
      })),
    }
  }

  return {
    daftar: BUKTI_TANAM.map((b) => ({
      ...b,
      calonPoin: b.pohon * RATE.pohonPerBatang,
      keputusan: demo.keputusanBukti[b.id] ?? null,
    })),
  }
})
