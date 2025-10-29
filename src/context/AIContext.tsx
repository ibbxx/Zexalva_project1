import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { products } from '@/lib/getProducts';
import type { Product } from '@/lib/types';
import type { AssistantAction, ChatMessage } from '@/services/aiClient';

const STORAGE_KEY = 'zexalva_stylist_ai_history_v1';

const greeting: ChatMessage = {
  role: 'assistant',
  content:
    'Halo! Aku ZEXALVA Agent AI. Ceritakan gaya yang kamu cari atau item yang ingin dipadukan, dan aku bantu rekomendasikan produk ZEXALVA yang cocok.',
  showImages: false,
};

interface StoredPricing {
  items: Array<{ handle: string; quantity: number }>;
  note?: string;
}

interface StoredChatMessage {
  role: ChatMessage['role'];
  content: string;
  showImages?: boolean;
  suggestions?: Array<{ handle: string; reason: string }>;
  pricing?: StoredPricing;
  actions?: Array<{
    type: AssistantAction['type'];
    label: string;
    productHandle?: string;
    productId?: string;
  }>;
}

function revivePricing(pricing?: StoredPricing): ChatMessage['pricing'] | undefined {
  if (!pricing) {
    return undefined;
  }

  const items = (pricing.items ?? [])
    .map((item) => {
      const product = products.find((entry) => entry.handle === item.handle);
      if (!product) {
        return null;
      }

      const quantity = item.quantity && item.quantity > 0 ? Math.floor(item.quantity) : 1;
      const subtotal = product.price * quantity;

      return {
        product,
        quantity,
        subtotal,
      };
    })
    .filter((value): value is { product: Product; quantity: number; subtotal: number } => Boolean(value));

  const note = pricing.note?.trim();

  if (!items.length) {
    return note
      ? {
          items: [],
          total: 0,
          currency: 'IDR',
          note,
        }
      : undefined;
  }

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  return {
    items,
    total,
    currency: 'IDR',
    note,
  };
}

function reviveActions(raw?: StoredChatMessage['actions']): AssistantAction[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const validTypes: AssistantAction['type'][] = ['add_to_cart', 'checkout'];

  return raw
    .map((action) => {
      if (!action?.type || !validTypes.includes(action.type)) {
        return null;
      }
      const label = action.label?.trim();
      if (!label) {
        return null;
      }

      return {
        type: action.type,
        label,
        productHandle: action.productHandle?.trim() || undefined,
        productId: action.productId?.trim() || undefined,
      } as AssistantAction;
    })
    .filter((action): action is AssistantAction => Boolean(action));
}

function reviveMessages(raw: StoredChatMessage[]): ChatMessage[] {
  return raw
    .map<ChatMessage>((message) => {
      const suggestions =
        message.showImages && message.suggestions?.length
          ? message.suggestions
              .map((suggestion) => {
                const product = products.find((item) => item.handle === suggestion.handle);
                if (!product) {
                  return null;
                }
                return {
                  product,
                  reason: suggestion.reason,
                };
              })
              .filter((item): item is NonNullable<typeof item> => Boolean(item))
          : [];

      const pricing = revivePricing(message.pricing);

      return {
        role: message.role,
        content: message.content,
        showImages: Boolean(message.showImages && suggestions.length),
        suggestions,
        pricing,
        actions: reviveActions(message.actions),
      };
    })
    .filter((message) => Boolean(message.content));
}

function serialiseMessages(messages: ChatMessage[]): StoredChatMessage[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
    showImages: Boolean(message.showImages && message.suggestions?.length),
    suggestions:
      message.showImages && message.suggestions?.length
        ? message.suggestions.map((suggestion) => ({
            handle: suggestion.product.handle,
            reason: suggestion.reason,
          }))
        : [],
    pricing: message.pricing
      ? {
          items: message.pricing.items.map((item) => ({
            handle: item.product.handle,
            quantity: item.quantity,
          })),
          note: message.pricing.note,
        }
      : undefined,
    actions:
      message.actions?.map((action) => ({
        type: action.type,
        label: action.label,
        productHandle: action.productHandle,
        productId: action.productId,
      })) ?? [],
  }));
}

interface AIContextValue {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  appendMessage: (message: ChatMessage) => void;
  resetMessages: () => void;
}

const AIContext = createContext<AIContextValue | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      hydratedRef.current = true;
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredChatMessage[];
        if (Array.isArray(parsed)) {
          const revived = reviveMessages(parsed);
          if (revived.length) {
            setMessages(revived);
          }
        }
      }
    } catch (error) {
      console.warn('Gagal memuat riwayat Stylist AI:', error);
    } finally {
      hydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!hydratedRef.current) {
      return;
    }

    try {
      const payload = serialiseMessages(messages);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('Gagal menyimpan riwayat Stylist AI:', error);
    }
  }, [messages]);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  const resetMessages = useCallback(() => {
    setMessages([greeting]);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      setMessages,
      appendMessage,
      resetMessages,
    }),
    [messages, appendMessage, resetMessages]
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAIContext(): AIContextValue {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext harus digunakan di dalam AIProvider');
  }

  return context;
}
