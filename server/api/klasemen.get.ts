import type { TimKelas } from '#shared/types'
import { EVENT_AKTIF } from '#shared/data/dasbor'
import { DAMPAK, KLASEMEN, MUSIM } from '#shared/data/klasemen'

/** Data liga: musim berjalan, klasemen lengkap, ringkasan dampak, event aktif. */
export default defineEventHandler(async () => {
  const sb = pakaiSupabase()
  if (sb) {
    const [musim, tim] = await Promise.all([
      sb.from('musim').select().eq('id', 1).maybeSingle(),
      sb
        .from('tim')
        .select('id, nama, julukan, emblem, warna, poin, kg, pohon, co2, tren, jumlahSiswa:jumlah_siswa')
        .order('poin', { ascending: false }),
    ])
    if (!musim.error && musim.data && !tim.error && tim.data.length) {
      const daftar = tim.data as TimKelas[]
      return {
        musim: {
          nama: musim.data.nama as string,
          pekan: musim.data.pekan as number,
          totalPekan: musim.data.total_pekan as number,
          berakhir: musim.data.berakhir as string,
          sisaHari: musim.data.sisa_hari as number,
        },
        tim: daftar,
        dampak: {
          sampahKg: daftar.reduce((a, t) => a + t.kg, 0),
          pohon: daftar.reduce((a, t) => a + t.pohon, 0),
          co2Kg: daftar.reduce((a, t) => a + t.co2, 0),
        },
        eventAktif: {
          label: musim.data.event_label as string,
          nama: musim.data.event_nama as string,
          sisaHari: musim.data.event_sisa_hari as number,
        },
      }
    }
  }
  // Fallback: data demo lokal (Supabase belum dikonfigurasi / tidak terjangkau).
  return { musim: MUSIM, tim: KLASEMEN, dampak: DAMPAK, eventAktif: EVENT_AKTIF }
})
