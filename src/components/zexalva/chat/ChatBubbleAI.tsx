import type { ReactNode } from 'react';
import type { ChatMessage } from '@/services/aiClient';

interface ChatBubbleAIProps {
  message: ChatMessage;
  timestamp?: string;
  children?: ReactNode;
}

export default function ChatBubbleAI({ message, timestamp, children }: ChatBubbleAIProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="max-w-[85%] rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs uppercase tracking-[0.3em] text-black shadow-sm">
        {message.content}
      </div>
      {children}
      {timestamp ? (
        <span className="text-[10px] uppercase tracking-[0.3em] text-black/35">
          {timestamp}
        </span>
      ) : null}
    </div>
  );
}
