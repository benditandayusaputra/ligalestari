import { jawabanAsisten } from '#shared/data/asisten'

const PERAN = `Kamu Asisten Hijau, pemandu siswa di aplikasi LigaLestari (liga lingkungan antar-kelas).
Jawab dalam bahasa Indonesia yang ramah dan singkat, maksimal 3 kalimat, tanpa markdown.
Aturan liga yang mengikat: poin lahir hanya dari bukti terverifikasi admin, setor sampah terpilah
dihitung per kg menurut kategori, tanam pohon 50 poin per pohon, klasemen berjalan satu musim.
Kalau pertanyaannya di luar sampah, penghijauan, atau LigaLestari, arahkan kembali dengan sopan.`

/**
 * Asisten Hijau. Menjawab lewat LLM (endpoint OpenAI-compatible, lihat AI_LLM_* di .env)
 * dengan jawaban basis pengetahuan lokal sebagai rujukan fakta, dan jatuh ke jawaban lokal
 * itu bila LLM tidak tersedia (tanpa kunci, kuota habis, atau demo luring) sehingga chat
 * tidak pernah mati.
 */
export default defineEventHandler(async (event) => {
  const { pertanyaan } = await readBody<{ pertanyaan?: string }>(event)
  if (!pertanyaan?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Pertanyaan kosong' })
  }

  const rujukan = jawabanAsisten(pertanyaan)
  const { aiLlmBaseUrl, aiLlmApiKey, aiLlmModel } = useRuntimeConfig(event)
  if (!aiLlmBaseUrl || !aiLlmApiKey || !aiLlmModel) return { jawaban: rujukan, sumber: 'lokal' }

  try {
    const balasan = await $fetch<{ choices?: { message?: { content?: string } }[] }>(
      `${aiLlmBaseUrl.replace(/\/+$/, '')}/chat/completions`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${aiLlmApiKey}` },
        body: {
          model: aiLlmModel,
          messages: [
            { role: 'system', content: PERAN },
            { role: 'user', content: `Pertanyaan siswa: ${pertanyaan}\n\nRujukan resmi LigaLestari: ${rujukan}` },
          ],
          // Jawaban dibatasi 3 kalimat; plafon rendah menahan latensi model tetap wajar.
          max_tokens: 250,
          temperature: 0.7,
          // Model Gemini 3.x berpikir dulu sebelum menjawab dan menghabiskan max_tokens
          // untuk itu (jawaban balik kosong/terpotong). Asisten ini butuh balasan pendek,
          // bukan penalaran, jadi mode berpikirnya dimatikan.
          reasoning_effort: 'none',
        },
        // Model ini terukur 8-27 detik per panggilan, jadi ambangnya dilonggarkan;
        // lewat itu jawaban lokal yang tampil agar chat tidak menggantung.
        timeout: 30000,
      },
    )
    // Gelembung chat merender teks polos, jadi penanda markdown dibuang bila LLM tetap memakainya.
    const teks = balasan.choices?.[0]?.message?.content?.replace(/[*_#`]/g, '').trim()
    return teks ? { jawaban: teks, sumber: 'llm' } : { jawaban: rujukan, sumber: 'lokal' }
  } catch (galat) {
    // Kegagalan LLM tidak pernah membuat chat mati, tetapi harus terbaca di log server
    // supaya jalur cadangan yang diam-diam aktif bisa ditelusuri.
    console.warn('[asisten] LLM gagal, memakai jawaban lokal:', galat)
    return { jawaban: rujukan, sumber: 'lokal' }
  }
})
