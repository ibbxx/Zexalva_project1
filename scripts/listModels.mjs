import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function loadEnvFile(fileName) {
  const envPath = path.join(projectRoot, fileName);
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue;
    const [key, ...rest] = line.split('=');
    if (!key) continue;
    const value = rest.join('=').trim();
    if (value && !(key in process.env)) {
      process.env[key.trim()] = value;
    }
  }
}

// Load local env files so the CLI can reuse the same credentials as Vite.
// 🔧 editable: tambahkan nama file env lain jika dibutuhkan
loadEnvFile('.env.local');
loadEnvFile('.env');

const apiKey = process.env.GEMINI_API_KEY ?? process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY atau VITE_GEMINI_API_KEY belum disetel.');
  console.error('   Tambahkan ke .env.local lalu jalankan ulang perintah ini.');
  process.exit(1);
  // 🔧 editable: sesuaikan pesan ketika API key tidak ditemukan
}

async function main() {
  const endpoint = new URL('https://generativelanguage.googleapis.com/v1beta/models');
  endpoint.searchParams.set('key', apiKey);
  // 🔧 editable: ganti endpoint atau parameter query sesuai kebutuhan API

  const response = await fetch(endpoint);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gagal memuat daftar model (${response.status}). Detail: ${errorBody}`);
  }

  const payload = await response.json();
  const models = payload.models ?? [];

  if (!models.length) {
    console.log('⚠️  Tidak ada model yang tersedia untuk API key ini.');
    return;
  }

  console.log(`✅ Ditemukan ${models.length} model:`);
  for (const model of models) {
    const supported = (model.supportedGenerationMethods ?? []).join(', ') || 'unknown';
    const description = model.description ? ` — ${model.description}` : '';
    console.log(`- ${model.name} (${supported})${description}`);
  }
}

main().catch((error) => {
  console.error('❌ Terjadi kesalahan saat mengambil daftar model.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
