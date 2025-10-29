import type { AssistantAction } from '@/services/aiClient';

interface ChatQuickActionsProps {
  actions: AssistantAction[];
  onSelect: (action: AssistantAction) => void;
}

export default function ChatQuickActions({ actions, onSelect }: ChatQuickActionsProps) {
  if (!actions.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <button
          key={`${action.type}-${index}`}
          type="button"
          onClick={() => onSelect(action)}
          className="flex items-center gap-2 rounded-full border border-black/20 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
