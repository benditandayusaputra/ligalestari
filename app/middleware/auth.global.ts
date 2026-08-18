/**
 * Penjaga area dasbor: /dasbor butuh sesi masuk, /admin butuh peran admin.
 * Nonaktif pada build statis lomba (authWajib=false) karena tidak ada
 * server sesi, dan dilewati saat prerender.
 */
export default defineNuxtRouteMiddleware((ke) => {
  if (import.meta.prerender) return
  if (!useRuntimeConfig().public.authWajib) return

  const session = useUserSession()

  if ((ke.path === '/masuk' || ke.path === '/daftar') && session.loggedIn.value) {
    return navigateTo(session.user.value?.peran === 'admin' ? '/admin' : '/dasbor')
  }

  const dilindungi = ke.path.startsWith('/dasbor') || ke.path.startsWith('/admin')
  if (!dilindungi) return

  if (!session.loggedIn.value) return navigateTo('/masuk')
  if (ke.path.startsWith('/admin') && session.user.value?.peran !== 'admin') {
    return navigateTo('/dasbor')
  }
})
