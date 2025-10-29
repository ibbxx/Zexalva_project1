import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Loader2, Sparkles } from 'lucide-react';
import {
  generateStylistReply,
  type AssistantAction,
  type AssistantReply,
} from '@/services/aiClient';
import { products } from '@/lib/getProducts';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useAIContext } from '@/context/AIContext';
import ChatBubbleAI from '@/components/zexalva/chat/ChatBubbleAI';
import ChatBubbleUser from '@/components/zexalva/chat/ChatBubbleUser';
import ChatQuickActions from '@/components/zexalva/chat/ChatQuickActions';

const IMAGE_MEDIA_WORDS = [
  'gambar',
  'gambar gambar',
  'foto',
  'foto foto',
  'fotofoto',
  'image',
  'images',
  'picture',
  'pictures',
  'visual',
  'visuals',
  'preview',
  'sneak peek',
  'galeri',
  'gallery',
  'lookbook',
  'referensi visual',
];

const IMAGE_VERB_WORDS = [
  'lihat',
  'lihatkan',
  'perlihatkan',
  'tampilkan',
  'tampilin',
  'tampilin dong',
  'tampilin semua',
  'tunjukkan',
  'tunjukkan dong',
  'kasih lihat',
  'kasih liat',
  'liatin',
  'lihatin',
  'lihat dong',
  'lihatin dong',
  'munculkan',
  'muncul kan',
  'munculin',
  'munculkin',
  'keluarkan',
  'keluarin',
  'keluar kan',
  'keluarin dong',
  'hadirkan',
  'bawakan',
  'bawain',
  'perlihatin',
  'pamerin',
  'display',
  'show',
  'render',
  'preview',
  'bisa lihat',
  'boleh lihat',
  'kirim',
  'kasih tau',
];

const QUESTION_FOCUS_WORDS = [
  'apa',
  'apaan',
  'yang mana',
  'yg mana',
  'mana',
  'mana aja',
  'mana saja',
  'which',
  'where',
  'ada apa',
  'ada tidak',
  'ada ga',
  'adakah',
  'pilih mana',
  'pilihan',
  'rekomendasi',
  'rekomendasi dong',
  'saran',
  'saran dong',
  'tolong carikan',
  'bantu cari',
  'bantuin cari',
];

const LIST_TRIGGER_WORDS = [
  'daftar',
  'list',
  'listing',
  'catalog',
  'katalog',
  'berikut',
  'semua',
  'seluruh',
  'koleksi lengkap',
  'pilihan lengkap',
  'tampilkan semua',
  'kasih semua',
  'semuanya',
  'full list',
  'lengkap',
];

const COLOR_REFERENCE_WORDS = [
  'hitam',
  'putih',
  'abu',
  'abu abu',
  'abu-abu',
  'grey',
  'gray',
  'merah',
  'biru',
  'navy',
  'cream',
  'coklat',
  'brown',
  'olive',
  'hijau',
  'green',
  'kuning',
  'yellow',
  'ungu',
  'purple',
  'pink',
  'oranye',
  'orange',
  'maroon',
  'lime',
  'neon',
  'pastel',
  'gelap',
  'dark',
  'terang',
  'light',
];

const PRODUCT_REFERENCE_WORDS = [
  'produk',
  'produk produk',
  'produk zexalva',
  'item',
  'item item',
  'koleksi',
  'koleksinya',
  'collection',
  'drop',
  'drops',
  'lineup',
  'look',
  'looks',
  'outfit',
  'outfits',
  'style',
  'styling',
  'gaya',
  'fit',
  'fits',
  'referensi',
  'wardrobe',
  'pakaian',
  'baju',
  'busana',
  'set outfit',
  'mix and match',
  'apparel',
  'gear',
  'streetwear',
  'hoodie',
  'hoodies',
  'jaket',
  'jaket denim',
  'jaket kulit',
  'denim',
  'leather jacket',
  'sweater',
  'crewneck',
  'tee',
  'tees',
  'tshirt',
  't-shirt',
  'kaos',
  'kaus',
  'kemeja',
  'shirt',
  'shirts',
  'atasan',
  'outer',
  'outerwear',
  'celana',
  'celana pendek',
  'celana panjang',
  'pants',
  'cargo',
  'cargo pants',
  'jeans',
  'denim pants',
  'bawahan',
  'skirt',
  'shorts',
  'sweatpants',
  'track pants',
  'topi',
  'caps',
  'beanie',
  'aksesoris',
  'aksesori',
  'accessories',
  'accessory',
  'tas',
  'bag',
  'bags',
  'tote bag',
  'shoulder bag',
  'sling bag',
  'backpack',
  'sepatu',
  'shoes',
  'sneakers',
  'boots',
  'sandals',
  'sepatu boots',
  'hoodi',
  'hodie',
  'hoddy',
  'hooddy',
  'hoodi hitam',
  'hoodie hitam',
  'hoodie black',
  'koleksi terbaru',
  'semua produk',
  'semua koleksi',
  'seluruhnya',
  'semuanya',
  'all items',
  'everything',
];

const PRICING_CORE_WORDS = ['harga', 'harga berapa', 'price', 'cost', 'biaya', 'tarif', 'rate', 'tag'];
const PRICING_SUPPORT_WORDS = [
  'total',
  'subtotal',
  'jumlah',
  'bayar',
  'payment',
  'tagihan',
  'akumulasi',
  'totalin',
  'totalkan',
  'bill',
  'invoice',
  'budget',
  'budgeting',
  'anggaran',
  'limit',
];
const PRICING_DIRECT_WORDS = [
  'checkout',
  'check out',
  'check-out',
  'cekout',
  'cek out',
  'cek-out',
  'bayar',
  'bayar dong',
  'bayar sekarang',
  'bayar skrg',
  'bayar aja',
  'bayar yuk',
  'beli',
  'beli sekarang',
  'beli skrg',
  'beli dong',
  'pesan',
  'pesan sekarang',
  'pesen',
  'pesen sekarang',
  'lanjut checkout',
  'lanjut bayar',
  'lanjutkan pembayaran',
  'lanjutkan pesanan',
  'lanjutkan order',
  'proses checkout',
  'proses pembayaran',
  'proses pesanan',
  'selesaikan pesanan',
  'selesaikan order',
  'order sekarang',
  'order ini',
  'order dong',
  'order in',
  'orderkan',
  'keranjang',
  'keranjangnya',
  'keranjang belanja',
  'cart',
  'add to cart',
  'masukkan ke cart',
  'masukin cart',
  'masukkin cart',
  'masukkin keranjang',
  'masukkan keranjang',
  'masukin keranjang',
  'antar ke kasir',
  'bayar ke kasir',
  'lanjut bayar',
  'lanjut belanja',
];
// 🔧 editable: sesuaikan kata kunci bahasa untuk deteksi harga
const PRICING_NEGATIVE_PATTERNS = [
  /tanpa\s+harga/,
  /tidak\s+perlu\s+harga/,
  /gak\s+usah\s+harga/,
  /tanpa\s+total/,
  /tidak\s+perlu\s+total/,
  /gak\s+usah\s+total/,
];

const QUICK_REPLIES = ['lihat hoodie', 'promo hari ini', 'produk baru'];
// 🔧 editable: atur daftar quick reply sesuai kebutuhan campaign

const formatTimestamp = () =>
  new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

const currencyFormatter = new Intl.NumberFormat('id-ID');
// 🔧 editable: ubah locale formatter untuk tampilan harga rekomendasi
const formatCurrency = (value: number) => currencyFormatter.format(Math.round(value));

const normalizeForMatch = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenizeForMatch = (value: string) => normalizeForMatch(value).split(' ').filter(Boolean);

const levenshteinDistance = (a: string, b: string): number => {
  if (a === b) {
    return 0;
  }
  if (!a.length) {
    return b.length;
  }
  if (!b.length) {
    return a.length;
  }

  const matrix = Array.from({ length: a.length + 1 }, (_, i) => {
    const row = new Array(b.length + 1).fill(0);
    row[0] = i;
    return row;
  });

  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    const charA = a[i - 1];
    for (let j = 1; j <= b.length; j += 1) {
      const charB = b[j - 1];
      const cost = charA === charB ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

const hasFuzzyMatch = (
  normalizedSource: string,
  sourceTokens: string[],
  targets: string[],
  baseThreshold = 1
) => {
  return targets.some((target) => {
    const normalizedTarget = normalizeForMatch(target);
    if (!normalizedTarget) {
      return false;
    }

    if (normalizedSource.includes(normalizedTarget)) {
      return true;
    }

    const targetTokens = normalizedTarget.split(' ').filter(Boolean);
    if (!targetTokens.length) {
      return false;
    }

    const threshold = Math.max(baseThreshold, Math.ceil(normalizedTarget.length * 0.15));

    if (targetTokens.length === 1) {
      const [singleTarget] = targetTokens;
      return sourceTokens.some((token) => {
        if (token === singleTarget) {
          return true;
        }
        if (Math.abs(token.length - singleTarget.length) > threshold) {
          return false;
        }
        return levenshteinDistance(token, singleTarget) <= threshold;
      });
    }

    for (let i = 0; i <= sourceTokens.length - targetTokens.length; i += 1) {
      const windowTokens = sourceTokens.slice(i, i + targetTokens.length);
      const window = windowTokens.join(' ');
      if (window === normalizedTarget) {
        return true;
      }
      if (Math.abs(window.length - normalizedTarget.length) > threshold) {
        continue;
      }
      if (levenshteinDistance(window, normalizedTarget) <= threshold) {
        return true;
      }
    }

    return false;
  });
};

function shouldRequestImages(prompt: string): boolean {
  const normalized = normalizeForMatch(prompt);
  if (!normalized) {
    return false;
  }

  const tokens = tokenizeForMatch(prompt);
  const hasMediaWord = hasFuzzyMatch(normalized, tokens, IMAGE_MEDIA_WORDS);
  const hasVerb = hasFuzzyMatch(normalized, tokens, IMAGE_VERB_WORDS);
  const hasProduct = hasFuzzyMatch(normalized, tokens, PRODUCT_REFERENCE_WORDS, 2);
  const hasQuestionCue = hasFuzzyMatch(normalized, tokens, QUESTION_FOCUS_WORDS);
  const hasListCue = hasFuzzyMatch(normalized, tokens, LIST_TRIGGER_WORDS);
  const hasColorCue = hasFuzzyMatch(normalized, tokens, COLOR_REFERENCE_WORDS);

  if (hasMediaWord && (hasVerb || hasProduct)) {
    return true;
  }

  if (hasVerb && hasProduct) {
    return true;
  }

  if (hasProduct && (hasQuestionCue || hasListCue || hasColorCue)) {
    return true;
  }

  if (/(foto|gambar|image|preview).*?(produk|item|hoodie|jaket|kaos|t-?shirt|tshirt|outfit|look|koleksi)/.test(normalized)) {
    return true;
  }

  if (/(lihat|lihatkan|perlihatkan|tampilkan|tampilin|tunjukkan|kasih\s+(?:lihat|liat)|liatin|tampilin|keluarin).*?(koleksi|produk|item|outfit|look|style|semua)/.test(normalized)) {
    return true;
  }

  return false;
}

function shouldRequestPricing(prompt: string): boolean {
  const normalized = normalizeForMatch(prompt);
  if (!normalized) {
    return false;
  }

  const tokens = tokenizeForMatch(prompt);

  if (PRICING_NEGATIVE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return false;
  }

  if (hasFuzzyMatch(normalized, tokens, PRICING_DIRECT_WORDS, 2)) {
    return true;
  }

  const hasCorePricing = hasFuzzyMatch(normalized, tokens, PRICING_CORE_WORDS);
  if (hasCorePricing) {
    return true;
  }

  const hasSupportPricing = hasFuzzyMatch(normalized, tokens, PRICING_SUPPORT_WORDS);
  const referencesProduct = hasFuzzyMatch(normalized, tokens, PRODUCT_REFERENCE_WORDS, 2);
  if (hasSupportPricing && referencesProduct) {
    return true;
  }

  if (/total(?:kan|in)?/.test(normalized) || /totalkan|totalin/.test(normalized)) {
    return true;
  }

  if (/berapa\s+(total|semua|keseluruhan|akumulasi)/.test(normalized)) {
    return true;
  }

  return false;
}

const kelas = {
  pembungkus: 'fixed bottom-6 right-6 z-50',
  jendela: 'mb-4 w-80 sm:w-96 rounded-3xl border border-black/10 bg-white shadow-[0_25px_45px_-20px_rgba(0,0,0,0.18)]',
  kepala: 'flex items-center justify-between border-b border-black/10 px-5 py-4',
  judul: 'flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-black',
  tombolTutup: 'flex h-9 w-9 items-center justify-center border border-black/15 hover:border-black transition',
  isi: 'flex h-[440px] flex-col px-5 pb-5',
  daftarPesan: 'flex-1 space-y-4 overflow-y-auto py-4 pr-2',
  kelompokPesan: 'space-y-3',
  daftarQuickReply: 'flex flex-wrap gap-2',
  tombolQuickReply: 'rounded-full border border-black/20 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50',
  gridSaran: 'ml-0 grid max-w-[85%] gap-3',
  kartuSaran: 'flex w-full gap-3 rounded-2xl border border-black/15 bg-white p-3 text-left transition hover:-translate-y-1',
  gambarSaran: 'h-16 w-16 flex-shrink-0 object-cover',
  teksSaran: 'text-[11px] uppercase tracking-[0.3em] text-black/60',
  namaSaran: 'text-black',
  hargaSaran: 'text-black/40',
  alasanSaran: 'mt-1 leading-relaxed normal-case tracking-normal text-black/60',
  kartuHarga: 'ml-0 max-w-[85%] rounded-2xl border border-black/15 bg-white p-4 text-[11px] uppercase tracking-[0.3em] text-black/60',
  judulHarga: 'mb-2 text-black',
  daftarHarga: 'space-y-2',
  barisHarga: 'flex items-center justify-between gap-4',
  totalHarga: 'mt-3 flex items-center justify-between border-t border-black/10 pt-2 text-black',
  catatanHarga: 'mt-2 normal-case tracking-normal text-black/50',
  statusLoading: 'flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-black/40',
  kotakError: 'mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-red-500',
  formulir: 'space-y-2',
  inputTeks: 'h-20 w-full resize-none rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-black placeholder:text-black/35 focus:border-black focus:outline-none',
  tombolKirim: 'flex w-full items-center justify-center gap-2 rounded-2xl border border-black bg-black py-3 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60',
  tombolMengambang: 'flex items-center gap-2 rounded-full bg-black px-4 py-3 font-oswald text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:scale-105',
};

export default function AIAssistant() {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { messages, setMessages } = useAIContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timestampRef = useRef<string[]>([]);

  useEffect(() => {
    const next = timestampRef.current.slice(0, messages.length);
    while (next.length < messages.length) {
      next.push(formatTimestamp());
    }
    timestampRef.current = next;
  }, [messages]);

  const toggleAssistant = () => {
    setIsOpen((prev) => !prev);
    setError(null);
  };

  const resolveProductFromAction = (action: AssistantAction): Product | null => {
    if (!action.productHandle && !action.productId) {
      return null;
    }

    const found = products.find(
      (item) =>
        (action.productHandle && item.handle === action.productHandle) ||
        (action.productId && item.id === action.productId)
    );

    return found ?? null;
  };

  const handleAssistantAction = (action: AssistantAction) => {
    if (action.type === 'add_to_cart') {
      const product = resolveProductFromAction(action);
      if (!product) {
        setMessages((current) => [
          ...current,
          {
            role: 'assistant',
            content:
              'Maaf, aku belum menemukan produk yang dimaksud. Bisa sebutkan lagi nama atau warnanya?',
          },
        ]);
        return;
      }

      const defaultSize = product.sizes[0] ?? 'Default';
      const defaultColor = product.colors[0] ?? 'Default';

      addToCart(product, defaultSize, defaultColor, 1);
      setIsCartOpen(true);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: `Siap, ${product.name} sudah ada di keranjang kamu. Kalau mau lanjut tinggal tekan tombol checkout ya!`,
        },
      ]);
      return;
    }

    if (action.type === 'checkout') {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'Oke, aku arahkan kamu ke halaman checkout sekarang.',
        },
      ]);
      navigate('/checkout');
    }
  };

  const handlePromptResponse = useCallback(
    (reply: AssistantReply, shouldShowImages: boolean) => {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: reply.content,
          suggestions: shouldShowImages ? reply.suggestions : [],
          showImages: shouldShowImages,
          pricing: reply.pricing,
          actions: reply.actions,
        },
      ]);
    },
    [setMessages]
  );

  const sendPrompt = useCallback(
    async (rawPrompt: string) => {
      const prompt = rawPrompt.trim();
      if (!prompt || isLoading) {
        return;
      }

      const previousMessages = [...messages];
      const updatedMessages = [...previousMessages, { role: 'user' as const, content: prompt }];

      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);
      setError(null);

      try {
        const wantsImages = shouldRequestImages(prompt);
        const wantsPricing = shouldRequestPricing(prompt);
        const reply = await generateStylistReply(previousMessages, prompt, wantsImages, wantsPricing);
        const shouldShowImages = wantsImages && reply.suggestions.length > 0;
        handlePromptResponse(reply, shouldShowImages);
      } catch (err) {
        console.error('AI assistant error:', err);
        const fallback =
          'Maaf, aku belum bisa merespons sekarang. Pastikan server memiliki API key Gemini yang valid, lalu coba lagi.';
        // 🔧 editable: ganti pesan fallback ketika API gagal
        setMessages((current) => [
          ...current,
          { role: 'assistant', content: fallback, suggestions: [], showImages: false, pricing: undefined },
        ]);
        setError(err instanceof Error ? err.message : 'Gagal memuat jawaban AI.');
      } finally {
        setIsLoading(false);
      }
    },
    [handlePromptResponse, isLoading, messages, setError, setInput, setIsLoading, setMessages]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendPrompt(input);
  };

  return (
    <div className={kelas.pembungkus}>
      {isOpen && (
        <div className={kelas.jendela}>
          <div className={kelas.kepala}>
            <div className={kelas.judul}>
              <Sparkles className="h-4 w-4" />
              {/* // 🔧 editable: ubah nama branding chatbot */}
              <span>ZEXALVA Stylist</span>
            </div>
            <button
              type="button"
              onClick={toggleAssistant}
              aria-label="Tutup Stylist AI"
              className={kelas.tombolTutup}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className={kelas.isi}>
            <div className={kelas.daftarPesan}>
              {messages.map((message, index) => {
                const timestamp = timestampRef.current[index];
                const key = `${message.role}-${index}`;

                if (message.role === 'assistant') {
                  const hasSuggestions = Boolean(message.showImages && message.suggestions?.length);
                  const hasPricing = Boolean(message.pricing);
                  return (
                    <div key={key} className={kelas.kelompokPesan}>
                      <ChatBubbleAI message={message} timestamp={timestamp}>
                        <>
                          {hasSuggestions ? (
                            <div className={kelas.gridSaran}>
                              {message.suggestions?.map((suggestion, suggestionIdx) => (
                                <button
                                  key={`${suggestion.product.id}-${suggestionIdx}`}
                                  type="button"
                                  onClick={() => navigate(`/product/${suggestion.product.handle}`)}
                                  className={kelas.kartuSaran}
                                >
                                  <img
                                    src={suggestion.product.images[0]}
                                    alt={suggestion.product.name}
                                    className={kelas.gambarSaran}
                                  />
                                  <div className={kelas.teksSaran}>
                                    <p className={kelas.namaSaran}>{suggestion.product.name}</p>
                                    <p className={kelas.hargaSaran}>
                                      Rp {formatCurrency(suggestion.product.price)}
                                    </p>
                                    <p className={kelas.alasanSaran}>
                                      {suggestion.reason}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : null}
                          {hasPricing && message.pricing ? (
                            <div className={kelas.kartuHarga}>
                              <p className={kelas.judulHarga}>Ringkasan harga</p>

                              {message.pricing.items.length ? (
                                <div className={kelas.daftarHarga}>
                                  {message.pricing.items.map((item, pricingIdx) => (
                                    <div
                                      key={`${item.product.id}-${pricingIdx}`}
                                      className={kelas.barisHarga}
                                    >
                                      <span>
                                        {item.quantity}× {item.product.name}
                                      </span>
                                      <span className={kelas.namaSaran}>
                                        Rp {formatCurrency(item.subtotal)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : null}

                              {message.pricing.items.length ? (
                                <div className={kelas.totalHarga}>
                                  <span>Total</span>
                                  <span>Rp {formatCurrency(message.pricing.total)}</span>
                                </div>
                              ) : null}

                              {message.pricing.note ? (
                                <p className={kelas.catatanHarga}>
                                  {message.pricing.note}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </>
                      </ChatBubbleAI>
                      {message.actions?.length ? (
                        <ChatQuickActions
                          actions={message.actions}
                          onSelect={handleAssistantAction}
                        />
                      ) : null}
                    </div>
                  );
                }

                return (
                  <div key={key} className={kelas.kelompokPesan}>
                    <ChatBubbleUser message={message} timestamp={timestamp} />
                  </div>
                );
              })}
              {isLoading && (
                <div className={kelas.statusLoading}>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Stylist AI sedang berpikir...
                  {/* // 🔧 editable: ganti teks indikator loading AI */}
                </div>
              )}
            </div>

            {error && (
              <div className={kelas.kotakError}>
                {error}
                {/* // 🔧 editable: sesuaikan pesan error yang ditampilkan ke pengguna */}
              </div>
            )}

            <form onSubmit={handleSubmit} className={kelas.formulir}>
              <div className={kelas.daftarQuickReply}>
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => void sendPrompt(reply)}
                    className={kelas.tombolQuickReply}
                    disabled={isLoading}
                  >
                    {reply}
                  </button>
                ))}
              </div>
              {/* // 🔧 editable: ubah placeholder input obrolan */}
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Contoh: Tunjukkan jaket denim terbaru."
                className={kelas.inputTeks}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={kelas.tombolKirim}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengirim
                    {/* // 🔧 editable: ganti label tombol saat loading */}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Dapatkan rekomendasi
                    {/* // 🔧 editable: ubah label tombol submit default */}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* // 🔧 editable: ganti label tombol membuka asisten */}
      <button
        type="button"
        onClick={toggleAssistant}
        className={kelas.tombolMengambang}
      >
        <MessageCircle className="h-5 w-5" />
        Stylist AI
      </button>
    </div>
  );
}
