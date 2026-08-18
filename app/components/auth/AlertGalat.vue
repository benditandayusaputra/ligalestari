<script setup lang="ts">
defineProps<{ pesan: string }>()
</script>

<template>
  <div
    role="alert"
    class="flex items-start gap-2.25 rounded-xl border border-[#F2CBC5] bg-[#FCEEEC] px-3.25 py-2.75"
  >
    <Icon name="lucide:circle-alert" size="17" class="mt-px shrink-0 text-[#C0392B]" aria-hidden="true" />
    <span class="text-[0.78125rem] leading-[1.4] font-semibold text-[#A02A1E]">{{ pesan }}</span>
  </div>
</template>
