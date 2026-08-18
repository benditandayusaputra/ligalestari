<script setup lang="ts">
const TAUTAN = [
  { label: 'Beranda', ke: '/' },
  { label: 'Jadwal & Hasil', ke: '/jadwal' },
  { label: 'Aturan Liga', ke: '/aturan' },
  { label: 'Artikel & Edukasi', ke: '/artikel' },
  { label: 'Peta Pohon', ke: '/peta' },
  { label: 'Metodologi', ke: '/metodologi' },
]

const route = useRoute()
const buka = ref(false)
const { loggedIn, user, clear } = useUserSession()

const dasborKe = computed(() => (user.value?.peran === 'admin' ? '/admin' : '/dasbor'))

// Halaman turunan (mis. detail artikel) tetap menyalakan menu induknya.
const aktif = (ke: string) => (ke === '/' ? route.path === '/' : route.path.startsWith(ke))

watch(() => route.path, () => (buka.value = false))

async function keluar() {
  await clear().catch(() => {})
  await navigateTo('/')
}
</script>

<template>
  <nav
    aria-label="Navigasi utama"
    class="glass-tipis sticky top-0 z-40 border-b border-garis"
    @keydown.escape="buka = false"
  >
    <div class="mx-auto flex max-w-275 items-center justify-between px-4.5 py-2.75 lg:px-10 lg:py-3.25">
      <NuxtLink to="/" class="flex items-center gap-2.25 text-teks-kuat" aria-label="LigaLestari, beranda">
        <LestariEmblem class="h-9 w-9 text-hijau-teks" />
        <span class="font-display text-h3 font-bold tracking-[-0.02em]">LigaLestari</span>
      </NuxtLink>

      <!-- Menu desktop -->
      <div class="hidden items-center gap-6.5 lg:flex">
        <NuxtLink
          v-for="t in TAUTAN"
          :key="t.ke"
          :to="t.ke"
          :aria-current="aktif(t.ke) ? 'page' : undefined"
          class="border-b-2 py-2 text-small font-medium hover:text-hijau-teks"
          :class="aktif(t.ke) ? 'border-hijau text-hijau-teks' : 'border-transparent text-teks'"
        >
          {{ t.label }}
        </NuxtLink>
      </div>

      <div class="hidden items-center gap-2.5 lg:flex">
        <UkuranTeks />
        <ThemeToggle />
        <template v-if="loggedIn">
          <NuxtLink :to="dasborKe" class="rounded-[10px] px-3.5 py-2.25 text-small font-semibold text-hijau-teks hover:bg-mint">
            Dasbor
          </NuxtLink>
          <button
            type="button"
            class="rounded-xl bg-hijau px-4.5 py-2.5 text-small font-semibold text-white hover:bg-hijau-pekat"
            @click="keluar"
          >
            Keluar
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/masuk" class="rounded-[10px] px-3.5 py-2.25 text-small font-semibold text-hijau-teks hover:bg-mint">
            Masuk
          </NuxtLink>
          <NuxtLink to="/daftar" class="rounded-xl bg-hijau px-4.5 py-2.5 text-small font-semibold text-white hover:bg-hijau-pekat">
            Daftar
          </NuxtLink>
        </template>
      </div>

      <!-- Ukuran huruf + toggle tema + tombol menu (seluler) -->
      <div class="flex items-center gap-2 lg:hidden">
        <UkuranTeks kelas-tombol="h-11 w-11 rounded-[11px] border-garis-tegas" />
        <ThemeToggle kelas-tombol="h-11 w-11 rounded-[11px] border-garis-tegas" />
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-[11px] border border-garis-tegas bg-surface"
          :aria-label="buka ? 'Tutup menu' : 'Buka menu'"
          :aria-expanded="buka"
          aria-controls="menu-seluler"
          @click="buka = !buka"
        >
          <Icon :name="buka ? 'lucide:x' : 'lucide:menu'" size="22" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Panel menu seluler -->
    <Transition name="naik">
      <div v-show="buka" id="menu-seluler" class="flex flex-col border-t border-garis bg-krem px-4.5 pt-2 pb-4.5 lg:hidden">
        <NuxtLink
          v-for="t in TAUTAN"
          :key="t.ke"
          :to="t.ke"
          :aria-current="aktif(t.ke) ? 'page' : undefined"
          class="border-b border-garis px-1.5 py-3.25 text-body font-medium"
          :class="aktif(t.ke) ? 'text-hijau-teks' : 'text-teks'"
        >
          {{ t.label }}
        </NuxtLink>
        <div class="mt-3.5 flex gap-2.5">
          <template v-if="loggedIn">
            <NuxtLink :to="dasborKe" class="flex-1 rounded-xl border border-mint-garis bg-surface p-3 text-center text-small font-semibold text-hijau-teks">
              Dasbor
            </NuxtLink>
            <button type="button" class="flex-1 rounded-xl bg-hijau p-3 text-center text-small font-semibold text-white" @click="keluar">
              Keluar
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/masuk" class="flex-1 rounded-xl border border-mint-garis bg-surface p-3 text-center text-small font-semibold text-hijau-teks">
              Masuk
            </NuxtLink>
            <NuxtLink to="/daftar" class="flex-1 rounded-xl bg-hijau p-3 text-center text-small font-semibold text-white">
              Daftar
            </NuxtLink>
          </template>
        </div>
      </div>
    </Transition>
  </nav>
</template>
