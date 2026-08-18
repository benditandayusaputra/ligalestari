<script setup lang="ts">
import type { KategoriArtikel } from '#shared/types'

/**
 * Ilustrasi SVG flat untuk kartu & header artikel — satu adegan unik per
 * artikel (fallback per kategori), digambar tangan dengan palet brand di
 * atas warna thumb kategori. Inline SVG: tanpa request, tajam di semua
 * ukuran, dan ikut membesar bersama kartunya. Dekoratif — teks alternatif
 * disediakan pembungkusnya.
 */
const props = defineProps<{ slug: string; kategori: KategoriArtikel }>()

const ADEGAN: Record<string, string> = {
  'memilah-sampah-organik-anorganik': 'pilah',
  'trembesi-raksasa-penyerap-karbon': 'trembesi',
  'botol-plastik-jadi-ecobrick': 'ecobrick',
  'cara-menanam-pohon-optimal': 'tanam',
  'kompos-sisa-makanan-kantin': 'kompos',
  'mengenal-pohon-angsana': 'angsana',
}

const adegan = computed(() => ADEGAN[props.slug] ?? (props.kategori === 'pohon' ? 'tanam' : 'pilah'))
</script>

<template>
  <svg
    viewBox="0 0 400 200"
    preserveAspectRatio="xMidYMid slice"
    class="h-full w-full"
    aria-hidden="true"
  >
    <!-- Latar umum: matahari & bukit lembut -->
    <circle cx="330" cy="42" r="26" fill="#e9b44c" opacity="0.5" />
    <ellipse cx="90" cy="215" rx="180" ry="60" fill="#FFFFFF" opacity="0.08" />
    <ellipse cx="330" cy="225" rx="200" ry="65" fill="#FFFFFF" opacity="0.12" />

    <!-- Memilah sampah: dua tong terpilah + panah sortir -->
    <g v-if="adegan === 'pilah'">
      <path d="M150 78l18-14v9h24v10h-24v9z" fill="#e9b44c" opacity="0.9" />
      <path d="M250 122l-18 14v-9h-24v-10h24v-9z" fill="#DFF0E2" opacity="0.9" />
      <rect x="70" y="92" width="76" height="74" rx="10" fill="#DFF0E2" />
      <rect x="62" y="80" width="92" height="16" rx="8" fill="#e9b44c" />
      <path d="M108 116c-10 0-16 8-16 16 0 10 8 16 16 16 10 0 16-8 16-16h-8c0 5-3 8-8 8s-8-4-8-8 3-8 8-8v6l12-9-12-9z" fill="#0e6b46" />
      <rect x="254" y="92" width="76" height="74" rx="10" fill="#B9DCC4" />
      <rect x="246" y="80" width="92" height="16" rx="8" fill="#DFF0E2" />
      <path d="M285 152v-24c0-4 2-7 5-9-1-3-1-7 2-9 2-2 5-2 8-1 2-4 8-4 10 0 3-1 6-1 8 1 3 2 3 6 2 9 3 2 5 5 5 9v24z" fill="#0e6b46" opacity="0.85" />
    </g>

    <!-- Trembesi: kanopi payung raksasa + gelembung CO2 terserap -->
    <g v-else-if="adegan === 'trembesi'">
      <rect x="192" y="120" width="16" height="60" rx="6" fill="#DFF0E2" />
      <path d="M200 128c-24-2-42-16-46-34 14 4 24 2 34-4-4-10-2-22 6-30 8 8 10 20 6 30 10 6 20 8 34 4-4 18-22 32-34 34z" fill="#e9b44c" opacity="0.25" />
      <ellipse cx="200" cy="78" rx="118" ry="46" fill="#DFF0E2" />
      <ellipse cx="200" cy="72" rx="86" ry="34" fill="#e9b44c" opacity="0.65" />
      <circle cx="72" cy="140" r="9" fill="#FFFFFF" opacity="0.55" />
      <circle cx="96" cy="118" r="6" fill="#FFFFFF" opacity="0.45" />
      <circle cx="322" cy="132" r="8" fill="#FFFFFF" opacity="0.55" />
      <circle cx="304" cy="112" r="5" fill="#FFFFFF" opacity="0.45" />
      <text x="58" y="145" font-size="9" font-weight="700" fill="#0e6b46">CO₂</text>
    </g>

    <!-- Ecobrick: botol berisi potongan warna → tumpukan bata botol -->
    <g v-else-if="adegan === 'ecobrick'">
      <rect x="92" y="70" width="52" height="100" rx="16" fill="#DFF0E2" />
      <rect x="106" y="52" width="24" height="22" rx="6" fill="#DFF0E2" />
      <rect x="104" y="46" width="28" height="10" rx="5" fill="#e9b44c" />
      <circle cx="108" cy="100" r="7" fill="#e9b44c" />
      <circle cx="126" cy="116" r="6" fill="#7CBCF0" />
      <circle cx="112" cy="136" r="7" fill="#F2CE52" />
      <circle cx="128" cy="152" r="6" fill="#e9b44c" />
      <path d="M170 116h34m0 0l-10-10m10 10l-10 10" stroke="#DFF0E2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <rect x="228" y="132" width="92" height="26" rx="13" fill="#DFF0E2" />
      <rect x="244" y="102" width="92" height="26" rx="13" fill="#B9DCC4" />
      <rect x="228" y="72" width="92" height="26" rx="13" fill="#DFF0E2" opacity="0.8" />
    </g>

    <!-- Menanam: gundukan tanah, kecambah, teko siram -->
    <g v-else-if="adegan === 'tanam'">
      <ellipse cx="200" cy="172" rx="90" ry="24" fill="#0e6b46" opacity="0.5" />
      <rect x="196" y="118" width="8" height="42" rx="4" fill="#DFF0E2" />
      <path d="M200 124c-2-18-14-26-32-26 2 18 14 26 32 26z" fill="#e9b44c" />
      <path d="M200 112c2-16 12-23 28-23-2 16-12 23-28 23z" fill="#DFF0E2" />
      <path d="M282 70h28l-8 40h-24l-8-28z" fill="#DFF0E2" />
      <rect x="306" y="74" width="22" height="8" rx="4" fill="#DFF0E2" transform="rotate(24 306 74)" />
      <path d="M262 84l14 4" stroke="#DFF0E2" stroke-width="7" stroke-linecap="round" />
      <circle cx="246" cy="100" r="4" fill="#7CBCF0" />
      <circle cx="236" cy="112" r="3.5" fill="#7CBCF0" />
      <circle cx="228" cy="124" r="3" fill="#7CBCF0" />
    </g>

    <!-- Kompos: kotak komposter, uap, sisa organik -->
    <g v-else-if="adegan === 'kompos'">
      <rect x="130" y="96" width="140" height="72" rx="12" fill="#DFF0E2" />
      <rect x="122" y="86" width="156" height="16" rx="8" fill="#e9b44c" />
      <rect x="146" y="112" width="108" height="7" rx="3.5" fill="#0e6b46" opacity="0.35" />
      <rect x="146" y="128" width="108" height="7" rx="3.5" fill="#0e6b46" opacity="0.35" />
      <rect x="146" y="144" width="108" height="7" rx="3.5" fill="#0e6b46" opacity="0.35" />
      <path d="M170 72c-6-8 6-12 0-20M200 74c-6-8 6-12 0-20M230 72c-6-8 6-12 0-20" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.5" fill="none" />
      <path d="M300 150c0-14 8-22 22-22-2 14-10 22-22 22z" fill="#e9b44c" />
      <path d="M86 142c8 0 12 5 12 12s-4 12-12 12-12-5-12-12c0-3 1-6 3-8l-4-8 8-3z" fill="#F2CE52" opacity="0.9" />
    </g>

    <!-- Angsana: kanopi bulat berbunga kuning, kelopak gugur -->
    <g v-else>
      <rect x="192" y="118" width="16" height="62" rx="6" fill="#DFF0E2" />
      <path d="M200 126l-26-20h18l-14-16h44l-14 16h18z" fill="#DFF0E2" opacity="0.35" />
      <circle cx="200" cy="80" r="52" fill="#DFF0E2" />
      <circle cx="162" cy="96" r="26" fill="#e9b44c" opacity="0.55" />
      <circle cx="238" cy="94" r="24" fill="#e9b44c" opacity="0.55" />
      <circle cx="176" cy="66" r="6" fill="#F2CE52" />
      <circle cx="212" cy="52" r="5" fill="#F2CE52" />
      <circle cx="232" cy="76" r="6" fill="#F2CE52" />
      <circle cx="190" cy="92" r="5" fill="#F2CE52" />
      <circle cx="256" cy="132" r="4" fill="#F2CE52" opacity="0.8" />
      <circle cx="140" cy="146" r="3.5" fill="#F2CE52" opacity="0.7" />
      <circle cx="272" cy="158" r="3" fill="#F2CE52" opacity="0.6" />
    </g>
  </svg>
</template>
