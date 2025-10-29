import { GoogleGenAI } from '@google/genai';
import { products } from '@/lib/getProducts';
import type { Product } from '@/lib/types';

type ChatRole = 'user' | 'assistant';

export interface AssistantSuggestion {
  product: Product;
  reason: string;
}

export type AssistantActionType = 'add_to_cart' | 'checkout';

export interface AssistantAction {
  type: AssistantActionType;
  label: string;
  productHandle?: string;
  productId?: string;
}

export interface AssistantPricingItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface AssistantPricing {
  items: AssistantPricingItem[];
  total: number;
  currency: 'IDR';
  note?: string;
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
  suggestions?: AssistantSuggestion[];
  showImages?: boolean;
  pricing?: AssistantPricing;
  actions?: AssistantAction[];
}

export interface AssistantReply {
  content: string;
  suggestions: AssistantSuggestion[];
  pricing?: AssistantPricing;
  actions: AssistantAction[];
}

const PREFERRED_MODELS = ['gemini-2.0-flash-001', 'gemini-2.5-flash'];
// 🔧 editable: prioritaskan model Gemini lain jika diperlukan

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY belum disetel. Tambahkan ke .env.local');
    // 🔧 editable: sesuaikan pesan error ketika API key belum tersedia
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey,
      apiVersion: 'v1',
    });
  }

  return client;
}

const catalogueSummary = products
  .map((product) => {
    const variants = `Sizes: ${product.sizes.join(', ')} | Colors: ${product.colors.join(', ')}`;
    return `- ${product.name} (handle: ${product.handle}, Rp ${product.price.toLocaleString('id-ID')}): ${variants}`;
  })
  .join('\n');
// 🔧 editable: ubah format ringkasan katalog yang dikirim ke AI

export const STYLIST_SYSTEM_PROMPT = `you are zexalva's ai shopping assistant. your main job is to membantu pengguna menjelajah produk, memeriksa harga, dan memandu proses keranjang/checkout.

selalu gunakan bahasa indonesia santai, ramah, namun tetap informatif.

prioritaskan katalog zexalva berikut:
${catalogueSummary}

pedoman layanan:
- selalu beri alasan singkat dan tawarkan alternatif relevan dari katalog.
- gunakan harga katalog (Rupiah) saat menyebut harga atau total.
- jika pengguna menanyakan total, hitung harga × kuantitas dan jelaskan ringkas.
- jangan mengarahkan atau menutup chat secara otomatis.
- bila pengguna siap bertransaksi (misal "beli", "checkout", "lanjut bayar", "tambah ke keranjang"), tampilkan dua tombol aksi:
  1. 🛒 "tambah ke keranjang" → panggil handleAddToCart(productId)
  2. 💳 "checkout sekarang" → panggil router.push("/checkout")
- pastikan kamu mengenali produk yang dimaksud (nama/warna). jika ambigu, klarifikasi terlebih dahulu sebelum memberikan tombol.
- bila produk tidak ditemukan di katalog, sampaikan dengan sopan dan tawarkan opsi lain.

jaga balasan tetap singkat, membantu, dan berikan konteks saat diperlukan.
`;
// 🔧 editable: sesuaikan prompt sistem AI sesuai panduan brand & CTA

export function buildStylistPrompt(history: ChatMessage[], latestUserMessage: string): string {
  const trimmedHistory = history.slice(-8);
  const conversation = trimmedHistory
    .map((message) => {
      const speaker = message.role === 'assistant' ? 'Stylist' : 'Pengguna';
      return `${speaker}: ${message.content}`;
    })
    .join('\n');

  return `${STYLIST_SYSTEM_PROMPT}

Percakapan sejauh ini:
${conversation || '(belum ada percakapan)'}

Pengguna: ${latestUserMessage}
Stylist:`;
}

export async function generateText(prompt: string): Promise<string> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error('Prompt tidak boleh kosong');
  }

  const ai = getClient();
  let lastError: unknown;

  for (const model of PREFERRED_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: trimmedPrompt,
      });

      const text = response.text?.trim();
      if (text) {
        return text;
      }

      lastError = new Error(`Model ${model} tidak mengembalikan teks.`);
    } catch (error) {
      lastError = error;
    }
  }

  throw (lastError ?? new Error('Gagal menghasilkan jawaban dari Gemini.'));
}

interface StructuredReply {
  summary?: string;
  message?: string;
  recommendations?: Array<{
    handle?: string;
    id?: string;
    reason?: string;
  }>;
  actions?: Array<{
    type?: string;
    label?: string;
    productHandle?: string;
    productId?: string;
  }>;
  pricing?: {
    items?: Array<{
      handle?: string;
      id?: string;
      quantity?: number;
    }>;
    note?: string;
  };
}

function extractJsonCandidate(text: string): StructuredReply | null {
  const trimmed = text.trim();
  const candidates: string[] = [];

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch && fencedMatch[1]) {
    candidates.push(fencedMatch[1]);
  }
  candidates.push(trimmed);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as StructuredReply;
    } catch {
      // ignore parse errors and try next candidate
    }
  }

  return null;
}

function normalizeIdentifier(value?: string | null): string | null {
  if (!value) {
    return null;
  }
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mapRecommendations(recs: StructuredReply['recommendations']): AssistantSuggestion[] {
  if (!Array.isArray(recs)) {
    return [];
  }

  const suggestions: AssistantSuggestion[] = [];

  for (const rec of recs) {
    if (!rec) continue;

    const identifiers = [rec.handle, rec.id, rec.reason]
      .map((value) => normalizeIdentifier(value))
      .filter((value): value is string => Boolean(value));

    let product: Product | undefined;

    for (const identifier of identifiers) {
      product = products.find((item) => {
        const handleSlug = normalizeIdentifier(item.handle);
        const nameSlug = normalizeIdentifier(item.name);
        return handleSlug === identifier || nameSlug === identifier;
      });
      if (product) {
        break;
      }
    }

    if (!product) {
      continue;
    }

    suggestions.push({
      product,
      reason: rec.reason?.trim() || 'Rekomendasi dari Stylist AI.',
    });
  }

  return suggestions;
}

function mapActions(rawActions: StructuredReply['actions']): AssistantAction[] {
  if (!Array.isArray(rawActions)) {
    return [];
  }

  const validTypes: AssistantActionType[] = ['add_to_cart', 'checkout'];

  return rawActions
    .map((action) => {
      if (!action?.type) {
        return null;
      }

      const normalizedType = action.type.toLowerCase().trim() as AssistantActionType;
      if (!validTypes.includes(normalizedType)) {
        return null;
      }

      const label = action.label?.trim();

      return {
        type: normalizedType,
        label:
          label ||
          (normalizedType === 'add_to_cart' ? '🛒 Tambah ke keranjang' : '💳 Checkout sekarang'),
        productHandle: action.productHandle?.trim() || undefined,
        productId: action.productId?.trim() || undefined,
      } as AssistantAction;
    })
    .filter((action): action is AssistantAction => Boolean(action));
}

function mapPricing(pricingData: StructuredReply['pricing']): AssistantPricing | undefined {
  if (!pricingData) {
    return undefined;
  }

  const items = (pricingData.items ?? [])
    .map((item) => {
      if (!item) return null;
      const identifier = item.handle ?? item.id;
      if (!identifier) return null;

      const product = products.find(
        (entry) => entry.handle === identifier || entry.id === identifier
      );
      if (!product) return null;

      const quantity = Number.isFinite(item.quantity) && item.quantity && item.quantity > 0
        ? Math.floor(item.quantity)
        : 1;

      const subtotal = product.price * quantity;

      return {
        product,
        quantity,
        subtotal,
      } satisfies AssistantPricingItem;
    })
    .filter((value): value is AssistantPricingItem => Boolean(value));

  const note = pricingData.note?.trim();

  if (!items.length) {
    if (note) {
      return {
        items: [],
        total: 0,
        currency: 'IDR',
        note,
      } satisfies AssistantPricing;
    }
    return undefined;
  }

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  return {
    items,
    total,
    currency: 'IDR',
    note,
  } satisfies AssistantPricing;
}

export async function generateStylistReply(
  history: ChatMessage[],
  latestUserMessage: string,
  requestImages: boolean,
  requestPricing: boolean
): Promise<AssistantReply> {
  const conversationPrompt = buildStylistPrompt(history, latestUserMessage);
  const recommendationInstruction = requestImages
    ? '- Maksimal 3 rekomendasi relevan.\n- Gunakan field "handle" persis seperti pada katalog.\n- Sertakan alasan singkat pada setiap rekomendasi.'
    : '- Kosongkan array "recommendations" (gunakan []) karena pengguna tidak meminta gambar.\n- Jangan sertakan rekomendasi produk, cukup jawab pertanyaan utamanya.';

  const pricingInstruction = requestPricing
    ? '- Isi objek "pricing" dengan daftar produk yang dibahas (maksimal 5 item).\n  - Gunakan "handle" atau "id" dari katalog.\n  - Sertakan "quantity" (default 1) dan tambahkan catatan singkat bila perlu.'
    : '- Set objek "pricing" menjadi {"items": []} jika tidak perlu perhitungan harga.';

  const actionInstruction = `- Bila percakapan mengarah ke pembelian atau checkout, isi array "actions" sesuai format berikut.\n  - Untuk tombol keranjang: {"type": "add_to_cart", "label": "🛒 Tambah ke keranjang", "productHandle": "<handle>"}.\n  - Untuk tombol checkout: {"type": "checkout", "label": "💳 Checkout sekarang"}.\n  - Jika perlu klarifikasi produk terlebih dahulu, kosongkan actions dan minta penjelasan.`;

  const jsonInstruction = `\n\nBalas dalam format JSON valid tanpa teks tambahan di luar JSON. Gunakan struktur berikut:\n{\n  "summary": "ringkasan jawaban",\n  "recommendations": [\n    {\n      "handle": "handle produk dari katalog",\n      "reason": "alasan singkat"\n    }\n  ],\n  "pricing": {\n    "items": [\n      {\n        "handle": "handle produk",\n        "quantity": 1\n      }\n    ],\n    "note": "opsional catatan harga"\n  },\n  "actions": [\n    {\n      "type": "add_to_cart",\n      "label": "🛒 Tambah ke keranjang",\n      "productHandle": "handle produk"\n    }\n  ]\n}\n${recommendationInstruction}\n${pricingInstruction}\n${actionInstruction}`;

  const raw = await generateText(`${conversationPrompt}${jsonInstruction}`);

  const parsed = extractJsonCandidate(raw);
  if (!parsed) {
    return {
      content: raw.trim(),
      suggestions: [],
      actions: [],
    };
  }

  const summary = parsed.summary?.trim() || parsed.message?.trim();
  const pricing = mapPricing(parsed.pricing);
  const includePricing = requestPricing || Boolean(pricing?.items.length || pricing?.note);
  const actions = mapActions(parsed.actions);
  return {
    content: summary && summary.length > 0 ? summary : raw.trim(),
    suggestions: requestImages ? mapRecommendations(parsed.recommendations) : [],
    pricing: includePricing ? pricing : undefined,
    actions,
  };
}
