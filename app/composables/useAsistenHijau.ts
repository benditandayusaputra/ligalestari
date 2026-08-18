import type { PesanChat } from '#shared/types'
import { CHAT_PEMBUKA, jawabanAsisten } from '#shared/data/asisten'

/**
 * State dan logika tanya-jawab Asisten Hijau: dipakai widget mengambang
 * dan halaman /dasbor/asisten. Jawaban dari API server; bila tidak
 * tersedia (hosting statis) memakai basis pengetahuan lokal yang sama.
 * Pesan hanya hidup selama sesi halaman (tanpa penyimpanan).
 */
export function useAsistenHijau() {
  const pesan = ref<PesanChat[]>([...CHAT_PEMBUKA])
  const ketikan = ref('')
  const sedangMengetik = ref(false)

  async function kirim(teks?: string) {
    const tanya = (teks ?? ketikan.value).trim()
    if (!tanya || sedangMengetik.value) return
    pesan.value.push({ dari: 'siswa', teks: tanya })
    ketikan.value = ''
    sedangMengetik.value = true

    const jedaMengetik = new Promise((selesai) => setTimeout(selesai, 700))
    let jawaban: string
    try {
      ;({ jawaban } = await $fetch('/api/asisten', { method: 'POST', body: { pertanyaan: tanya } }))
    } catch {
      jawaban = jawabanAsisten(tanya)
    }
    await jedaMengetik

    pesan.value.push({ dari: 'bot', teks: jawaban })
    sedangMengetik.value = false
  }

  return { pesan, ketikan, sedangMengetik, kirim }
}
