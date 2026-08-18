<script setup lang="ts">
import { WARNA_TIM } from '#shared/data/admin'

definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Buat Kelas' })

const nama = ref('')
const warna = ref(WARNA_TIM[0]!)
const emblem = ref('R2')
const tahun = ref('2025/2026')

const kodeBaru = ref('')

/** Kirim ke API; di hosting statis kode dibuat lokal dengan pola sama. */
async function buatKelas() {
  if (!nama.value.trim()) return
  try {
    const hasil = await $fetch('/api/admin/kelas', {
      method: 'POST',
      body: { nama: nama.value, warna: warna.value, emblem: emblem.value, tahunAjaran: tahun.value },
    })
    kodeBaru.value = hasil.kode
  } catch {
    const huruf = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const acak = Array.from({ length: 4 }, () => huruf[Math.floor(Math.random() * huruf.length)]).join('')
    kodeBaru.value = `${(emblem.value || 'EKOL').toUpperCase().padEnd(2, 'X')}-${acak}`
  }
}
</script>

<template>
  <div>
    <DasborHeader variant="gelap" kicker="Kelas Baru" judul="Buat Kelas">
      <template #aksi>
        <NuxtLink
          to="/admin/kelas"
          class="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#2C382F] hover:bg-[#3A4A3F]"
          aria-label="Kembali ke daftar kelas"
        >
          <Icon name="lucide:chevron-left" size="18" class="text-white" aria-hidden="true" />
        </NuxtLink>
      </template>
    </DasborHeader>

    <div class="px-4 lg:px-0">
      <!-- Berhasil dibuat (demo) -->
      <section v-if="kodeBaru" class="mt-3.5 rounded-[18px] border border-garis bg-surface p-5 text-center" aria-live="polite">
        <div class="anim-pop mx-auto mb-3.5 flex h-16 w-16 items-center justify-center rounded-full bg-hijau-pucat">
          <span class="flex h-11 w-11 items-center justify-center rounded-full bg-hijau">
            <Icon name="lucide:check" size="22" class="text-lime" aria-hidden="true" />
          </span>
        </div>
        <h2 class="font-display text-xl font-bold">Kelas {{ nama }} dibuat!</h2>
        <p class="mt-1 text-[0.8125rem] text-teks-redup">Bagikan kode gabung berikut ke siswa:</p>
        <p class="my-2 font-display text-[1.875rem] font-bold tracking-[0.06em] text-hijau-teks">{{ kodeBaru }}</p>
        <p class="text-[0.6875rem] text-teks-samar">Mode demo: kelas tersimpan permanen saat backend aktif.</p>
        <NuxtLink to="/admin/kelas" class="mt-4 block w-full rounded-[13px] bg-hijau p-3.25 text-sm font-bold text-white transition-colors hover:bg-hijau-pekat">
          Kembali ke Daftar Kelas
        </NuxtLink>
      </section>

      <template v-else>
        <!-- Pratinjau emblem -->
        <div class="mt-3.5 flex items-center justify-center gap-3.5 rounded-[18px] border border-garis bg-surface p-4.5">
          <span
            class="flex h-16 w-16 items-center justify-center rounded-[18px] font-display text-2xl font-bold text-white shadow-[0_6px_16px_rgba(20,32,22,0.18)]"
            :style="{ background: warna }"
          >
            {{ (emblem || 'R2').toUpperCase() }}
          </span>
          <div>
            <div class="text-[0.6875rem] font-semibold text-teks-samar">Pratinjau emblem</div>
            <div class="font-display text-base font-bold">Warna &amp; kode tim</div>
          </div>
        </div>

        <form class="mt-3.5 rounded-[18px] border border-garis bg-surface p-4" @submit.prevent="buatKelas">
          <label for="kelas-nama" class="mb-1.75 block text-[0.6875rem] font-bold text-teks-redup uppercase">Nama kelas</label>
          <input
            id="kelas-nama"
            v-model="nama"
            type="text"
            placeholder="mis. XI RPL 2"
            class="mb-3.5 w-full rounded-xl border border-garis bg-surface-2 px-3.5 py-3 text-sm outline-none focus:border-hijau focus-visible:outline-none"
          />

          <p class="mb-2 text-[0.6875rem] font-bold text-teks-redup uppercase">Warna tim</p>
          <div class="mb-3.5 flex flex-wrap gap-2.5" role="group" aria-label="Pilih warna tim">
            <button
              v-for="w in WARNA_TIM"
              :key="w"
              type="button"
              class="h-8.5 w-8.5 rounded-[11px]"
              :style="{ background: w, boxShadow: w === warna ? '0 0 0 3px #16201A' : '0 0 0 1px #E4E1D7' }"
              :aria-label="`Warna ${w}`"
              :aria-pressed="w === warna"
              @click="warna = w"
            />
          </div>

          <div class="flex gap-2.5">
            <div class="flex-1">
              <label for="kelas-emblem" class="mb-1.75 block text-[0.6875rem] font-bold text-teks-redup uppercase">Emblem (2 huruf)</label>
              <input
                id="kelas-emblem"
                v-model="emblem"
                type="text"
                maxlength="3"
                placeholder="R2"
                class="w-full rounded-xl border border-garis bg-surface-2 px-3.5 py-3 font-display text-[0.9375rem] font-bold uppercase outline-none focus:border-hijau focus-visible:outline-none"
              />
            </div>
            <div class="flex-[1.3]">
              <label for="kelas-tahun" class="mb-1.75 block text-[0.6875rem] font-bold text-teks-redup uppercase">Tahun ajaran</label>
              <div class="relative">
                <select
                  id="kelas-tahun"
                  v-model="tahun"
                  class="w-full cursor-pointer appearance-none rounded-xl border border-garis bg-surface-2 px-3.5 py-3 text-sm font-semibold outline-none focus:border-hijau focus-visible:outline-none"
                >
                  <option>2025/2026</option>
                  <option>2026/2027</option>
                </select>
                <Icon name="lucide:chevron-down" size="15" class="pointer-events-none absolute top-3.5 right-3.25 text-teks-samar" aria-hidden="true" />
              </div>
            </div>
          </div>

          <button type="submit" class="mt-3.5 w-full rounded-[14px] bg-hijau p-3.75 text-sm font-bold text-white transition-colors hover:bg-hijau-pekat">
            Buat Kelas &amp; Hasilkan Kode
          </button>
        </form>
      </template>
    </div>
  </div>
</template>
