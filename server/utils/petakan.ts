import type { Artikel, BlokArtikel, KategoriArtikel } from '#shared/types'

/** Pemetaan baris tabel Supabase (snake_case) → bentuk domain aplikasi. */

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
