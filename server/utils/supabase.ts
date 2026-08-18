import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let klien: SupabaseClient | null | undefined
let memakaiKunciRahasia = false

/**
 * Klien Supabase sisi server (singleton).
 * Memakai kunci rahasia bila tersedia (boleh menulis, melewati RLS);
 * bila tidak, memakai kunci publishable yang hanya bisa membaca.
 * Mengembalikan null bila kredensial belum diisi — pemanggil wajib
 * jatuh ke data demo lokal agar situs tetap berfungsi.
 */
export function pakaiSupabase(): SupabaseClient | null {
  if (klien !== undefined) return klien
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  memakaiKunciRahasia = Boolean(config.supabaseServiceKey)
  const kunci = config.supabaseServiceKey || config.public.supabaseKey
  klien = url && kunci ? createClient(url, kunci, { auth: { persistSession: false } }) : null
  return klien
}

/**
 * Benar bila klien memegang kunci rahasia. Dipakai untuk tabel yang
 * dikunci penuh dari kunci publik (mis. `akun`) — dengan kunci publik,
 * RLS mengembalikan hasil kosong tanpa error sehingga tidak bisa
 * dibedakan dari "data memang tidak ada".
 */
export function kunciRahasiaAktif(): boolean {
  pakaiSupabase()
  return memakaiKunciRahasia
}
