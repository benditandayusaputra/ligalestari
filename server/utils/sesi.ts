import type { H3Event } from 'h3'

/**
 * Pastikan pemanggil adalah admin yang sedang masuk.
 * Dilewati bila penjaga sesi dimatikan (build statis lomba).
 */
export async function wajibAdmin(event: H3Event): Promise<void> {
  const config = useRuntimeConfig(event)
  if (!config.public.authWajib) return

  const sesi = await getUserSession(event)
  if (sesi.user?.peran !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya admin yang boleh melakukan aksi ini' })
  }
}

/** Sintesis email Supabase Auth dari username/NIS. */
export function emailDari(pengguna: string): string {
  return `${pengguna.trim().toLowerCase()}@ligalestari.local`
}
