<script setup lang="ts">
import type { TimKelas } from '#shared/types'

const props = defineProps<{
  tim: TimKelas[]
  musim: { pekan: number }
}>()

const limaBesar = props.tim.slice(0, 5)

/** Deskripsi pergeseran peringkat untuk pembaca layar. */
const deskripsiTren = (tren: number) =>
  tren > 0 ? `Naik ${tren} peringkat dari pekan lalu` : tren < 0 ? `Turun ${-tren} peringkat dari pekan lalu` : 'Peringkat tetap'
</script>

<template>
  <section id="klasemen" class="px-5 py-12 lg:px-10 lg:py-18">
    <div class="mx-auto max-w-190">
      <div v-anim class="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <SectionHeading :kicker="`Papan Klasemen · Pekan ${musim.pekan}`" judul="Lima besar musim ini." />
        <NuxtLink
          to="/masuk"
          class="inline-flex items-center gap-1.5 py-1 text-small font-semibold text-hijau-teks hover:underline"
        >
          Masuk untuk klasemen lengkap
          <Icon name="lucide:log-in" size="15" aria-hidden="true" />
        </NuxtLink>
      </div>

      <ol v-anim="80" class="overflow-hidden rounded-[18px] border border-garis bg-surface" aria-label="Lima kelas teratas klasemen">
        <li
          v-for="(tim, i) in limaBesar"
          :key="tim.id"
          class="flex items-center gap-3.5 px-4.5 py-3.5"
          :class="[
            i === 0 && 'bg-sorot shadow-[inset_3px_0_0_0_#E6B422]',
            i === 3 ? 'border-t-2 border-garis-tegas' : i > 0 && 'border-t border-krem',
          ]"
        >
          <div
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold tabular-nums"
            :style="warnaMedali(i)"
          >
            {{ i + 1 }}
          </div>
          <div
            class="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold"
            :style="gayaEmblem(tim.warna)"
          >
            {{ tim.emblem }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-body font-semibold">{{ tim.nama }}</div>
            <div class="text-caption text-teks-samar">Tim {{ tim.julukan }}</div>
          </div>
          <span
            class="inline-flex w-11 items-center justify-end gap-0.5 text-caption font-semibold tabular-nums"
            :class="tim.tren > 0 ? 'text-hijau-teks' : tim.tren < 0 ? 'text-merah-teks' : 'text-teks-samar'"
            :aria-label="deskripsiTren(tim.tren)"
            role="img"
          >
            <Icon
              :name="tim.tren > 0 ? 'lucide:chevron-up' : tim.tren < 0 ? 'lucide:chevron-down' : 'lucide:minus'"
              size="14"
              aria-hidden="true"
            />
            <template v-if="tim.tren !== 0">{{ Math.abs(tim.tren) }}</template>
          </span>
          <div class="text-right">
            <div class="font-display text-lead font-bold text-hijau-teks tabular-nums"><CountUp :nilai="tim.poin" /></div>
            <div class="text-caption font-medium text-teks-samar">Poin Hijau</div>
          </div>
        </li>
      </ol>
      <p class="mt-3 text-center text-caption text-teks-samar">
        Garis tegas menandai batas zona juara · peringkat per kelas, diperbarui berkala (bukan real-time)
      </p>
    </div>
  </section>
</template>
