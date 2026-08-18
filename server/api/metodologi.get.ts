import type { JenisPohon } from '#shared/types'
import { JENIS_POHON, SUMBER_METODOLOGI } from '#shared/data/metodologi'

/** Tabel acuan serapan CO₂ per jenis pohon + daftar rujukan. */
export default defineEventHandler(async () => {
  const baris = await kueri(
    (sql) => sql`select nama, latin, serapan::float8 as serapan, sumber, warna
                   from jenis_pohon
                  order by serapan desc`,
  )
  if (baris?.length) {
    return { jenisPohon: baris as unknown as JenisPohon[], sumber: SUMBER_METODOLOGI }
  }
  return { jenisPohon: JENIS_POHON, sumber: SUMBER_METODOLOGI }
})
