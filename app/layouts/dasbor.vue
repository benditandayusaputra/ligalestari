<script setup lang="ts">
/**
 * Kerangka area dasbor (setelah masuk): sidebar di layar lebar,
 * bilah tab bawah ala aplikasi di ponsel. Menu mengikuti peran,
 * ditentukan dari awalan rute (/admin → admin, selain itu siswa).
 */

const MENU_SISWA = [
  { label: 'Klasemen', ke: '/dasbor', ikon: 'lucide:chart-no-axes-column' },
  { label: 'Profil Tim', ke: '/dasbor/tim', ikon: 'lucide:users' },
  { label: 'Kontribusi Saya', ke: '/dasbor/saya', ikon: 'lucide:star' },
  { label: 'Notifikasi', ke: '/dasbor/notifikasi', ikon: 'lucide:bell' },
  { label: 'Asisten Hijau', ke: '/dasbor/asisten', ikon: 'lucide:message-circle' },
  { label: 'Peta Pohon', ke: '/peta', ikon: 'lucide:map-pin' },
]

const MENU_ADMIN = [
  { label: 'Ringkasan', ke: '/admin', ikon: 'lucide:layout-dashboard' },
  { label: 'Setor Sampah', ke: '/admin/setoran', ikon: 'lucide:trash-2' },
  { label: 'Kelola Event', ke: '/admin/event', ikon: 'lucide:calendar-days' },
  { label: 'Verifikasi Bukti', ke: '/admin/verifikasi', ikon: 'lucide:clipboard-check' },
  { label: 'Laporan Dampak', ke: '/admin/laporan', ikon: 'lucide:chart-line' },
  { label: 'Kelola Kelas', ke: '/admin/kelas', ikon: 'lucide:users-round' },
  { label: 'Lokasi Peta', ke: '/admin/lokasi', ikon: 'lucide:map-pin' },
]

const TAB_SISWA = [MENU_SISWA[0]!, MENU_SISWA[1]!, MENU_SISWA[2]!, MENU_SISWA[5]!, MENU_SISWA[4]!]
const TAB_ADMIN = MENU_ADMIN.slice(0, 4)

const route = useRoute()
const areaAdmin = computed(() => route.path.startsWith('/admin'))
const menu = computed(() => (areaAdmin.value ? MENU_ADMIN : MENU_SISWA))
const tab = computed(() => (areaAdmin.value ? TAB_ADMIN : TAB_SISWA))
const menuTambahan = computed(() => (areaAdmin.value ? MENU_ADMIN.slice(TAB_ADMIN.length) : []))

const aktif = (ke: string) =>
  ke === '/dasbor' || ke === '/admin' ? route.path === ke : route.path.startsWith(ke)

const { user, clear } = useUserSession()

const colorMode = useColorMode()

/** Lembar pengaturan tampilan (tema + ukuran huruf) di bilah tab ponsel. */
const bukaTampilan = ref(false)
const bukaMenu = ref(false)
watch(() => route.path, () => {
  bukaTampilan.value = false
  bukaMenu.value = false
})

async function keluar() {
  // Di hosting statis tidak ada sesi — abaikan kegagalan dan tetap keluar.
  await clear().catch(() => {})
  await navigateTo('/masuk')
}

// Area dasbor pasca-masuk — tak perlu diindeks mesin pencari.
useSeoMeta({ robots: 'noindex, follow' })
</script>

<template>
  <div class="flex min-h-dvh">
    <!-- Tautan lompat untuk pengguna pembaca layar / navigasi keyboard -->
    <a
      href="#konten"
      class="sr-only z-70 rounded-lg bg-hijau px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Lewati ke konten utama
    </a>

    <!-- Sidebar (layar lebar) -->
    <aside class="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-y-auto border-r border-garis bg-surface px-3 py-5 lg:flex">
      <NuxtLink to="/" class="flex items-center gap-2 px-2" aria-label="LigaLestari — beranda situs">
        <LestariEmblem class="h-7.5 w-7.5 text-hijau-teks" />
        <span class="font-display text-[0.9375rem] font-bold tracking-[-0.02em]">LigaLestari</span>
      </NuxtLink>

      <p class="px-2 pt-5 pb-1.5 text-[0.625rem] font-bold tracking-[0.08em] text-teks-samar uppercase">
        {{ areaAdmin ? 'Panel Admin' : 'Dasbor Siswa' }}
      </p>
      <p v-if="user" class="px-2 pb-2 text-xs font-semibold text-teks-redup">
        Masuk sebagai <span class="text-teks-kuat">{{ user.nama }}</span>
      </p>
      <nav class="flex flex-col gap-0.5" :aria-label="areaAdmin ? 'Menu admin' : 'Menu siswa'">
        <NuxtLink
          v-for="m in menu"
          :key="m.ke"
          :to="m.ke"
          :aria-current="aktif(m.ke) ? 'page' : undefined"
          class="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[0.8125rem]"
          :class="aktif(m.ke) ? 'bg-mint font-bold text-hijau-teks' : 'font-semibold text-teks hover:bg-krem'"
        >
          <Icon :name="m.ikon" size="17" aria-hidden="true" />
          {{ m.label }}
        </NuxtLink>
      </nav>

      <div class="mt-auto flex flex-col gap-0.5 border-t border-garis pt-3">
        <p class="px-2 pb-1.5 text-[0.625rem] font-bold tracking-[0.08em] text-teks-samar uppercase">Mode demo</p>
        <NuxtLink
          :to="areaAdmin ? '/dasbor' : '/admin'"
          class="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[0.8125rem] font-semibold text-teks hover:bg-krem"
        >
          <Icon name="lucide:arrow-left-right" size="17" aria-hidden="true" />
          {{ areaAdmin ? 'Lihat dasbor siswa' : 'Lihat panel admin' }}
        </NuxtLink>
        <NuxtLink to="/" class="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[0.8125rem] font-semibold text-teks hover:bg-krem">
          <Icon name="lucide:globe" size="17" aria-hidden="true" />
          Beranda situs
        </NuxtLink>
        <button
          type="button"
          class="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[0.8125rem] font-semibold text-teks hover:bg-krem"
          @click="keluar"
        >
          <Icon name="lucide:log-out" size="17" aria-hidden="true" />
          Keluar
        </button>
        <ThemeToggle label="Ganti tema" class="justify-start border-0 hover:bg-krem" />
        <UkuranTeks inline class="mt-1.5 px-2.5" />
      </div>
    </aside>

    <main id="konten" class="min-w-0 flex-1 pb-28 lg:pb-12">
      <div class="mx-auto w-full max-w-3xl lg:px-8 lg:pt-8">
        <slot />
      </div>
    </main>

    <!-- Bilah tab bawah (ponsel) -->
    <nav
      class="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t pb-[max(env(safe-area-inset-bottom),8px)] lg:hidden"
      :class="areaAdmin ? 'border-white/10 bg-tinta' : 'border-garis bg-surface'"
      aria-label="Navigasi dasbor"
    >
      <NuxtLink
        v-for="t in tab"
        :key="t.ke"
        :to="t.ke"
        :aria-current="aktif(t.ke) ? 'page' : undefined"
        class="flex flex-1 flex-col items-center justify-center gap-1 pt-2.5 pb-1 text-[0.625rem] font-semibold"
        :class="
          aktif(t.ke)
            ? areaAdmin ? 'text-lime' : 'text-hijau-teks'
            : areaAdmin ? 'text-[#7C8A7E]' : 'text-teks-samar'
        "
      >
        <Icon :name="t.ikon" size="22" aria-hidden="true" />
        {{ t.label.split(' ')[0] }}
      </NuxtLink>

      <button
        v-if="menuTambahan.length"
        type="button"
        aria-controls="menu-admin-seluler"
        :aria-expanded="bukaMenu"
        class="flex flex-1 flex-col items-center justify-center gap-1 pt-2.5 pb-1 text-[0.625rem] font-semibold"
        :class="bukaMenu || menuTambahan.some((m) => aktif(m.ke)) ? 'text-lime' : 'text-[#7C8A7E]'"
        @click="bukaMenu = !bukaMenu; bukaTampilan = false"
      >
        <Icon name="lucide:ellipsis" size="22" aria-hidden="true" />
        Menu
      </button>
      <!-- Pengaturan tampilan: tema + ukuran huruf (ponsel) -->
      <button
        type="button"
        aria-label="Pengaturan tampilan: tema dan ukuran huruf"
        :aria-expanded="bukaTampilan"
        class="flex flex-1 flex-col items-center justify-center gap-1 pt-2.5 pb-1 text-[0.625rem] font-semibold"
        :class="
          bukaTampilan
            ? areaAdmin ? 'text-lime' : 'text-hijau-teks'
            : areaAdmin ? 'text-[#7C8A7E]' : 'text-teks-samar'
        "
        @click="bukaTampilan = !bukaTampilan; bukaMenu = false"
      >
        <Icon name="lucide:sliders-horizontal" size="22" aria-hidden="true" />
        Tampilan
      </button>
    </nav>

    <div v-if="bukaMenu || bukaTampilan" class="fixed inset-0 z-55 lg:hidden" aria-hidden="true" @click="bukaMenu = false; bukaTampilan = false" />
    <section
      v-if="bukaMenu"
      id="menu-admin-seluler"
      aria-label="Menu admin lainnya"
      class="anim-pop fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+76px)] z-60 rounded-2xl border border-white/10 bg-tinta p-2.5 shadow-[0_18px_50px_rgba(20,32,22,0.3)] lg:hidden"
      @keydown.escape="bukaMenu = false"
    >
      <NuxtLink
        v-for="m in menuTambahan"
        :key="m.ke"
        :to="m.ke"
        :aria-current="aktif(m.ke) ? 'page' : undefined"
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold"
        :class="aktif(m.ke) ? 'bg-white/10 text-lime' : 'text-white hover:bg-white/10'"
        @click="bukaMenu = false"
      >
        <Icon :name="m.ikon" size="19" aria-hidden="true" />
        {{ m.label }}
      </NuxtLink>
    </section>

    <!-- Lembar pengaturan tampilan (ponsel) -->
    <section
      v-if="bukaTampilan"
      aria-label="Pengaturan tampilan"
      class="anim-pop fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+76px)] z-60 rounded-2xl border border-garis bg-surface p-4 shadow-[0_18px_50px_rgba(20,32,22,0.3)] lg:hidden"
      @keydown.escape="bukaTampilan = false"
    >
      <div class="mb-3.5" role="group" aria-label="Tema">
        <div class="mb-1.5 text-[0.6875rem] font-bold tracking-wider text-teks-samar uppercase">Tema</div>
        <div class="flex gap-1.5">
          <button
            type="button"
            :aria-pressed="colorMode.value === 'light'"
            class="flex h-9.5 flex-1 items-center justify-center gap-1.75 rounded-[9px] border text-[0.8125rem] font-bold transition-colors"
            :class="colorMode.value === 'light' ? 'border-hijau bg-mint text-hijau-teks' : 'border-garis bg-surface text-teks'"
            @click="colorMode.preference = 'light'"
          >
            <Icon name="lucide:sun" size="15" aria-hidden="true" /> Terang
          </button>
          <button
            type="button"
            :aria-pressed="colorMode.value === 'dark'"
            class="flex h-9.5 flex-1 items-center justify-center gap-1.75 rounded-[9px] border text-[0.8125rem] font-bold transition-colors"
            :class="colorMode.value === 'dark' ? 'border-hijau bg-mint text-hijau-teks' : 'border-garis bg-surface text-teks'"
            @click="colorMode.preference = 'dark'"
          >
            <Icon name="lucide:moon" size="15" aria-hidden="true" /> Gelap
          </button>
        </div>
      </div>
      <UkuranTeks inline />
    </section>
  </div>
</template>
