interface GeminiListResponse {
  models?: Array<{ name?: string | null }>;
}

export async function debugListModels() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('debugListModels: VITE_GEMINI_API_KEY belum disetel.');
    return;
    // 🔧 editable: ubah pesan peringatan ketika API key belum dikonfigurasi
  }

  const endpoint = new URL('https://generativelanguage.googleapis.com/v1beta/models');
  // 🔧 editable: ganti endpoint jika menggunakan versi API berbeda
  endpoint.searchParams.set('key', apiKey);

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.warn('debugListModels: gagal memuat daftar model.', response.status, response.statusText);
      return;
    }

    const payload = (await response.json()) as GeminiListResponse;
    const names = (payload.models ?? []).map((model) => model.name ?? 'unknown');
    // eslint-disable-next-line no-console
    console.log('Available Gemini models:', names);
  } catch (error) {
    console.warn('debugListModels: terjadi kesalahan saat memanggil endpoint model.', error);
  }
}
