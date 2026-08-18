// Bentuk data pengguna yang tersimpan di cookie sesi (nuxt-auth-utils).
declare module '#auth-utils' {
  interface User {
    pengguna: string
    nama: string
    peran: 'siswa' | 'admin'
    kelasId?: string
  }
}

export {}
