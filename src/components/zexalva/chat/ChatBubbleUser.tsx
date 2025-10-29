import type { ChatMessage } from '@/services/aiClient';

interface ChatBubbleUserProps {
  message: ChatMessage;
  timestamp?: string;
}

export default function ChatBubbleUser({ message, timestamp }: ChatBubbleUserProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="max-w-[85%] rounded-2xl bg-black px-4 py-3 text-xs uppercase tracking-[0.3em] text-white shadow-sm">
        {message.content}
      </div>
      {timestamp ? (
        <span className="text-[10px] uppercase tracking-[0.3em] text-black/35">
          {timestamp}
        </span>
      ) : null}
    </div>
  );
}
