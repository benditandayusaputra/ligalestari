import type { Artikel, BlokArtikel, KategoriArtikel } from '#shared/types'

/** Pemetaan baris tabel Postgres (snake_case) → bentuk domain aplikasi. */

export interface BarisArtikel {
  slug: string
  judul: string
  kategori: KategoriArtikel
  menit_baca: number
  ringkasan: string
  tanggal: string
  thumb_tag: string
  thumb_alt: string
  isi: BlokArtikel[]
  sumber: string[]
}

export function petaArtikel(baris: BarisArtikel): Artikel {
  return {
    slug: baris.slug,
    judul: baris.judul,
    kategori: baris.kategori,
    menitBaca: baris.menit_baca,
    ringkasan: baris.ringkasan,
    tanggal: baris.tanggal,
    thumb: { tag: baris.thumb_tag, alt: baris.thumb_alt },
    isi: baris.isi,
    sumber: baris.sumber,
  }
}

/**
 * Seluruh artikel dari database, terurut tanggal terbit. null bila
 * database belum dikonfigurasi/gagal, pemanggil memakai data demo.
 *
 * `tanggal` sengaja diformat di SQL: kolom `date` akan sampai sebagai
 * objek Date, sedangkan seluruh aplikasi (schema.org, formatTanggal)
 * mengharapkan string ISO "YYYY-MM-DD".
 */
export async function ambilArtikel(): Promise<Artikel[] | null> {
  const baris = await kueri(
    (sql) => sql`
      select slug, judul, kategori, menit_baca, ringkasan,
             to_char(tanggal, 'YYYY-MM-DD') as tanggal,
             thumb_tag, thumb_alt, isi, sumber
        from artikel
       order by tanggal`,
  )
  return baris?.length ? (baris as unknown as BarisArtikel[]).map(petaArtikel) : null
}
