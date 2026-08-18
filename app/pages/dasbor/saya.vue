<script setup lang="ts">
definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Kontribusi Saya' })

const [{ data: liga }, { data: dasbor }] = await Promise.all([
  useFetch('/api/klasemen', { key: 'klasemen' }),
  useFetch('/api/dasbor', { key: 'dasbor' }),
])
if (!liga.value || !dasbor.value) {
  throw createError({ statusCode: 500, statusMessage: 'Data dasbor tidak tersedia' })
}

const { saya: SAYA, badges: BADGES } = dasbor.value
const tim = liga.value.tim.find((t) => t.id === SAYA.kelasId)!
const jumlahBadge = BADGES.filter((b) => b.dapat).length

const { clear } = useUserSession()
async function keluar() {
  await clear().catch(() => {})
  await navigateTo('/masuk')
}
</script>

<template>
  <div>
    <header class="relative overflow-hidden bg-[linear-gradient(160deg,#0e6b46,#095536)] px-5 pt-8 pb-7 text-center lg:rounded-3xl">
      <div class="absolute -top-12.5 -left-10 h-40 w-40 rounded-full bg-lime/10" aria-hidden="true" />
      <div class="relative z-2">
        <div class="mx-auto mb-3 flex h-19.5 w-19.5 items-center justify-center rounded-full bg-lime font-display text-[1.875rem] font-bold text-tinta">
          {{ inisial(SAYA.nama) }}
        </div>
        <h1 class="font-display text-[1.3125rem] font-bold text-white">{{ SAYA.nama }}</h1>
        <p class="text-[0.8125rem] font-medium text-white/80">{{ tim.nama }} · Tim {{ tim.julukan }}</p>
      </div>
    </header>

    <div class="px-4 lg:px-0">
      <!-- Kartu level (menimpa tepi header) -->
      <section class="relative z-3 -mt-4 rounded-[18px] border border-garis bg-surface p-4 shadow-[0_8px_22px_rgba(20,32,22,0.07)]" aria-label="Level kontribusi">
        <div class="mb-3 flex items-center gap-3">
          <span class="flex h-11.5 w-11.5 items-center justify-center rounded-[13px] bg-[linear-gradient(135deg,#e9b44c,#d9a13a)] font-display text-lg font-bold text-tinta">
            {{ SAYA.level }}
          </span>
          <div class="flex-1">
            <h2 class="font-display text-[0.9375rem] font-bold">Level {{ SAYA.level }} · {{ SAYA.namaLevel }}</h2>
            <p class="text-[0.6875rem] font-semibold text-teks-samar">
              {{ SAYA.poinKeLevelBerikut }} poin lagi ke Level {{ SAYA.level + 1 }}
            </p>
          </div>
        </div>
        <div
          class="h-2.5 overflow-hidden rounded-full bg-surface-3"
          role="progressbar"
          :aria-valuenow="SAYA.persenLevel"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Progres menuju level berikutnya"
        >
          <div class="h-full rounded-full bg-[linear-gradient(90deg,#0e6b46,#4cc38a)]" :style="{ width: `${SAYA.persenLevel}%` }" />
        </div>
      </section>

      <div class="mt-3.5 grid grid-cols-3 gap-2.5">
        <StatCard label="Poin pribadi" :nilai="SAYA.poin" tengah aksen="hijau" />
        <StatCard label="kg sampah" :nilai="SAYA.kg" tengah aksen="biru" />
        <StatCard label="pohon" :nilai="SAYA.pohon" tengah aksen="hijau" />
      </div>

      <!-- Koleksi badge -->
      <section aria-label="Koleksi badge">
        <div class="flex items-center justify-between px-0.5 pt-4.5 pb-2.5">
          <h2 class="font-display text-[0.9375rem] font-bold">Koleksi badge</h2>
          <span class="text-[0.6875rem] font-bold text-hijau-teks">{{ jumlahBadge }} / {{ BADGES.length }} terkumpul</span>
        </div>
        <ul class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <li v-for="b in BADGES" :key="b.nama" class="rounded-[14px] border border-garis bg-surface px-1.5 py-2.75 text-center">
            <div
              class="relative mx-auto mb-1.75 flex h-10.5 w-10.5 items-center justify-center rounded-full"
              :class="b.dapat ? 'bg-hijau' : 'bg-surface-3'"
            >
              <Icon name="lucide:medal" size="20" :class="b.dapat ? 'text-lime' : 'text-[#B8BDB3]'" aria-hidden="true" />
              <span
                v-if="!b.dapat"
                class="absolute -right-0.5 -bottom-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-teks-samar"
              >
                <Icon name="lucide:lock" size="9" class="text-white" aria-hidden="true" />
                <span class="sr-only">terkunci</span>
              </span>
            </div>
            <div class="text-[0.625rem] leading-[1.2] font-bold" :class="b.dapat ? 'text-teks-kuat' : 'text-teks-samar'">{{ b.nama }}</div>
            <div class="mt-0.5 text-[0.5625rem] text-teks-samar">{{ b.syarat }}</div>
          </li>
        </ul>
      </section>

      <button
        type="button"
        class="mt-5 flex w-full items-center justify-center gap-2 rounded-[13px] border border-garis bg-surface p-3 text-[0.8125rem] font-bold text-teks-redup hover:text-teks-kuat"
        @click="keluar"
      >
        <Icon name="lucide:log-out" size="16" aria-hidden="true" />
        Keluar
      </button>
    </div>
  </div>
</template>
