'use client';

import { useState } from 'react';
import { Bot, User, Copy, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export type ConversationStatus = 'ready' | 'submitted' | 'streaming' | 'error';

interface ConversationMessageProps {
  role: 'user' | 'assistant';
  content: string;
  status?: ConversationStatus;
}

export function ConversationMessage({
  role,
  content,
  status = 'ready',
}: ConversationMessageProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const isStreaming = status === 'streaming';
  const isSubmitted = status === 'submitted';

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Follow-up copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        'flex gap-3 group relative',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full size-8',
          isUser
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {isUser ? (
          <User className="size-4" />
        ) : (
          <Bot className="size-4" />
        )}
      </div>

      <div
        className={cn(
          'rounded-lg px-3.5 py-2.5 text-sm max-w-[85%] relative',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
        )}
      >
        {isSubmitted && !isUser && !content && (
          <div className="flex items-center gap-1 py-1.5 px-0.5">
            <span className="size-2 rounded-full bg-primary/50 animate-bounce [animation-delay:-0.3s] shrink-0" />
            <span className="size-2 rounded-full bg-primary/50 animate-bounce [animation-delay:-0.15s] shrink-0" />
            <span className="size-2 rounded-full bg-primary/50 animate-bounce shrink-0" />
          </div>
        )}

        {/* Text content */}
        {content && (
          <div className={cn('whitespace-pre-wrap leading-relaxed', !isUser && 'pr-5')}>
            {content}
          </div>
        )}

        {/* Streaming cursor */}
        {isStreaming && !isUser && (
          <span className="inline-block ml-1 mt-1">
            <span className="animate-pulse text-primary">▌</span>
          </span>
        )}

        {/* Copy button — only on completed assistant messages */}
        {!isUser && status === 'ready' && content && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Copy follow-up"
          >
            {copied ? (
              <Check className="size-3.5 text-primary" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
