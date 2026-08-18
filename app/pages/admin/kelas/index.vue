<script setup lang="ts">
definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Kelola Kelas & Siswa' })

const { data } = await useFetch('/api/admin/kelas', { key: 'admin-kelas' })
if (!data.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data kelas tidak tersedia' })
}

const daftarKelas = data.value.daftar
const totalSiswa = daftarKelas.reduce((a, k) => a + k.jumlahSiswa, 0)
</script>

<template>
  <div>
    <DasborHeader
      variant="gelap"
      kicker="Manajemen"
      judul="Kelola Kelas & Siswa"
      :sub="`${daftarKelas.length} kelas · ${totalSiswa} siswa terdaftar`"
    />

    <div class="px-4 lg:px-0">
      <NuxtLink
        to="/admin/kelas/baru"
        class="mt-3.5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-hijau p-3.5 text-sm font-bold text-white transition-colors hover:bg-hijau-pekat"
      >
        <Icon name="lucide:plus" size="18" class="text-lime" aria-hidden="true" />
        Buat Kelas
      </NuxtLink>

      <ul class="mt-3 flex flex-col gap-2.5" aria-label="Daftar kelas">
        <li v-for="t in daftarKelas" :key="t.id">
          <NuxtLink
            :to="`/admin/kelas/${t.id}`"
            class="flex items-center gap-3.25 rounded-2xl border border-garis bg-surface px-3.5 py-3.25 hover:bg-surface-2"
          >
            <TimEmblem :warna="t.warna" :teks="t.emblem" :ukuran="46" />
            <span class="min-w-0 flex-1">
              <span class="block text-[0.90625rem] font-bold">{{ t.nama }}</span>
              <span class="block text-[0.71875rem] font-semibold text-teks-samar">
                Tim {{ t.julukan }} · {{ t.jumlahSiswa }} siswa
              </span>
            </span>
            <span class="text-right">
              <span class="block font-display text-[0.9375rem] font-bold text-hijau-teks">{{ formatAngka(t.poin) }}</span>
              <span class="block text-[0.625rem] font-semibold text-teks-samar">Poin Hijau</span>
            </span>
            <Icon name="lucide:chevron-right" size="18" class="text-teks-samar" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
