<script setup lang="ts">
definePageMeta({ layout: 'dasbor' })

const route = useRoute()
const id = route.params.id as string

const { data, error } = await useFetch(`/api/admin/kelas/${id}`, { key: `admin-kelas-${id}` })

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Kelas tidak ditemukan', fatal: true })
}

const { tim, jumlahSiswa, siswa: SISWA_KELAS } = data.value

useSeoMeta({ title: `Kelola ${tim.nama}` })

const kode = ref(data.value.kode || 'EKOL-0000')
const tersalin = ref(false)
const infoBackend = ref(false)

async function salinKode() {
  await navigator.clipboard.writeText(kode.value)
  tersalin.value = true
  setTimeout(() => (tersalin.value = false), 2000)
}

/** Buat ulang kode gabung (lokal saja pada mode demo). */
function buatUlangKode() {
  const huruf = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const acak = Array.from({ length: 4 }, () => huruf[Math.floor(Math.random() * huruf.length)]).join('')
  kode.value = `${kode.value.split('-')[0]}-${acak}`
}

/**
 * Pola kotak ala QR untuk pratinjau (deterministik dari kode kelas).
 * QR sungguhan dibuat server saat backend tersedia.
 */
const selQr = computed(() => {
  const N = 21
  const benih = [...kode.value].reduce((a, c) => a + c.charCodeAt(0), 0)
  const acak = (i: number) => {
    const x = Math.sin(i * 12.9898 + benih) * 43758.5453
    return x - Math.floor(x) > 0.5
  }
  const penanda = (r: number, c: number) =>
    r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)
  const sel: boolean[] = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (r < 7 && c < 7) sel.push(penanda(r, c))
      else if (r < 7 && c >= N - 7) sel.push(penanda(r, c - (N - 7)))
      else if (r >= N - 7 && c < 7) sel.push(penanda(r - (N - 7), c))
      else sel.push(acak(r * N + c + 1))
    }
  }
  return sel
})
</script>

<template>
  <div>
    <DasborHeader :judul="tim.nama" :sub="`Tim ${tim.julukan} · ${jumlahSiswa} siswa`" :latar="`linear-gradient(160deg, ${tim.warna}, #095536)`">
      <template #aksi>
        <NuxtLink
          to="/admin/kelas"
          class="flex h-9 w-9 items-center justify-center rounded-[11px] bg-white/16 hover:bg-white/25"
          aria-label="Kembali ke daftar kelas"
        >
          <Icon name="lucide:chevron-left" size="18" class="text-white" aria-hidden="true" />
        </NuxtLink>
      </template>
    </DasborHeader>

    <div class="px-4 lg:px-0">
      <!-- Kode gabung + pratinjau QR -->
      <section class="mt-3.5 rounded-[18px] border border-garis bg-surface p-4.5 text-center" aria-label="Kode gabung kelas">
        <p class="text-[0.6875rem] font-bold tracking-[0.08em] text-teks-samar uppercase">Kode Gabung Kelas</p>
        <p class="my-1.5 font-display text-[2.125rem] font-bold tracking-[0.06em] text-hijau-teks">{{ kode }}</p>
        <div
          class="mx-auto mb-3 grid aspect-square w-full max-w-43.5 gap-0 rounded-[14px] border border-[#E4E1D7] bg-white p-2.75"
          style="grid-template-columns: repeat(21, 1fr)"
          role="img"
          :aria-label="`Pratinjau kode QR untuk kode gabung ${kode}`"
        >
          <span v-for="(isi, i) in selQr" :key="i" :style="{ background: isi ? '#0E2A18' : 'transparent' }" />
        </div>
        <p class="mb-3.5 text-[0.65625rem] text-teks-samar">Siswa scan QR atau ketik kode untuk gabung.</p>
        <div class="flex gap-2.5">
          <button
            type="button"
            class="flex flex-1 items-center justify-center gap-1.75 rounded-xl bg-hijau p-3 text-[0.8125rem] font-bold text-white transition-colors hover:bg-hijau-pekat"
            @click="salinKode"
          >
            <Icon :name="tersalin ? 'lucide:check' : 'lucide:copy'" size="15" class="text-lime" aria-hidden="true" />
            {{ tersalin ? 'Tersalin!' : 'Salin' }}
          </button>
          <button
            type="button"
            class="flex flex-1 items-center justify-center gap-1.75 rounded-xl border border-garis bg-surface p-3 text-[0.8125rem] font-bold text-hijau-teks hover:bg-mint/40"
            @click="buatUlangKode"
          >
            <Icon name="lucide:refresh-cw" size="15" aria-hidden="true" />
            Buat Ulang
          </button>
        </div>
      </section>

      <!-- Daftar siswa -->
      <section aria-label="Daftar siswa">
        <div class="flex items-center justify-between px-0.5 pt-4.5 pb-2">
          <h2 class="font-display text-[0.9375rem] font-bold">Daftar Siswa</h2>
          <span class="text-[0.6875rem] font-semibold text-teks-samar">{{ jumlahSiswa }} siswa</span>
        </div>
        <ul class="overflow-hidden rounded-[18px] border border-garis bg-surface">
          <li v-for="s in SISWA_KELAS" :key="s.nis" class="flex items-center gap-3 border-t border-krem px-3.5 py-2.75 first:border-t-0">
            <span class="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full bg-mint font-display text-[0.8125rem] font-bold text-hijau-teks">
              {{ inisial(s.nama) }}
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-[0.8125rem] font-semibold">{{ s.nama }}</span>
              <span class="block text-[0.6875rem] font-semibold text-teks-samar">{{ s.nis }}</span>
            </span>
            <span class="font-display text-sm font-bold text-hijau-teks">{{ s.poin }}</span>
          </li>
        </ul>
        <p class="flex items-center gap-2 px-0.5 pt-2.5 text-[0.65625rem] text-teks-samar">
          <Icon name="lucide:lock" size="13" aria-hidden="true" />
          Data minimal — hanya nama &amp; NIS demi privasi siswa.
        </p>
      </section>

      <div class="mt-3.5 flex gap-2.5">
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-1.75 rounded-[13px] bg-hijau p-3.25 text-[0.78125rem] font-bold text-white transition-colors hover:bg-hijau-pekat"
          @click="infoBackend = !infoBackend"
        >
          <Icon name="lucide:plus" size="16" class="text-lime" aria-hidden="true" />
          Tambah Siswa
        </button>
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-1.75 rounded-[13px] border border-garis bg-surface p-3.25 text-[0.78125rem] font-bold text-hijau-teks hover:bg-mint/40"
          @click="infoBackend = !infoBackend"
        >
          <Icon name="lucide:upload" size="16" aria-hidden="true" />
          Impor CSV
        </button>
      </div>
      <p v-if="infoBackend" class="mt-2 rounded-xl border border-mint-garis bg-hijau-pucat px-3.5 py-2.5 text-center text-xs font-semibold text-hijau-teks" role="status">
        Pengelolaan data siswa aktif saat backend tersedia pada tahap berikutnya.
      </p>
    </div>
  </div>
</template>
