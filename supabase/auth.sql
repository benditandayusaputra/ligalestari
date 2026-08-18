-- ============================================================
-- Migrasi autentikasi LigaLestari: Supabase Auth + tabel profil.
-- Jalankan SETELAH schema.sql. Aman diulang.
--
-- Login memakai username/NIS; email pengguna disintesis menjadi
-- "<pengguna>@ligalestari.local" pada auth.users. Data aplikasi milik
-- pengguna tersimpan di tabel profil (terhubung ke auth.users).
-- Seed user demo dibuat lewat Admin API (lihat supabase/seed-auth.mjs).
-- ============================================================

-- Tabel akun demo (sandi teks polos) digantikan Supabase Auth.
drop table if exists akun;

drop table if exists profil;
create table profil (
  id uuid primary key references auth.users (id) on delete cascade,
  pengguna text unique not null,
  nama text not null,
  peran text not null check (peran in ('siswa', 'admin')),
  kelas_id text references tim (id),
  siswa_id bigint references siswa (id)
);

alter table profil enable row level security;

-- Pengguna hanya bisa membaca profilnya sendiri; server (kunci rahasia)
-- yang mengelola pembuatan dan pencarian profil.
create policy "baca profil sendiri" on profil
  for select to authenticated using ((select auth.uid()) = id);
