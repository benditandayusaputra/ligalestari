import type { TimKelas } from '#shared/types'
import { EVENT_AKTIF } from '#shared/data/dasbor'
import { DAMPAK, KLASEMEN, MUSIM } from '#shared/data/klasemen'

/** Data liga: musim berjalan, klasemen lengkap, ringkasan dampak, event aktif. */
export default defineEventHandler(async () => {
  const hasil = await kueri(async (sql) => {
    const [musim, tim] = await Promise.all([
      sql`select nama, pekan, total_pekan, berakhir, sisa_hari,
                 event_label, event_nama, event_sisa_hari
            from musim
           where id = 1`,
      sql`select id, nama, julukan, emblem, warna, poin, kg, pohon, co2, tren,
                 jumlah_siswa as "jumlahSiswa"
            from tim
           order by poin desc`,
    ])
    return musim.length && tim.length ? { musim: musim[0]!, tim: tim as unknown as TimKelas[] } : null
  })

  if (hasil) {
    const { musim, tim } = hasil
    return {
      musim: {
        nama: musim.nama as string,
        pekan: musim.pekan as number,
        totalPekan: musim.total_pekan as number,
        berakhir: musim.berakhir as string,
        sisaHari: musim.sisa_hari as number,
      },
      tim,
      dampak: {
        sampahKg: tim.reduce((a, t) => a + t.kg, 0),
        pohon: tim.reduce((a, t) => a + t.pohon, 0),
        co2Kg: tim.reduce((a, t) => a + t.co2, 0),
      },
      eventAktif: {
        label: musim.event_label as string,
        nama: musim.event_nama as string,
        sisaHari: musim.event_sisa_hari as number,
      },
    }
  }

  // Fallback: data demo lokal (database belum dikonfigurasi / tidak terjangkau).
  return { musim: MUSIM, tim: KLASEMEN, dampak: DAMPAK, eventAktif: EVENT_AKTIF }
})
