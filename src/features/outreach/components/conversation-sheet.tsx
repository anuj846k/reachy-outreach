'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MessageSquare, Send, Bot, Square, RotateCcw } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ConversationMessage, type ConversationStatus } from './conversation-message';
import { getConversationThread } from '@/features/outreach/actions';

interface ConversationSheetProps {
  outreachId: string;
  prospectName: string | null;
  trigger?: React.ReactNode;
}

function MessageSkeleton({ role }: { role: 'user' | 'assistant' }) {
  const isUser = role === 'user';
  return (
    <div
      className={cn(
        'flex gap-3 items-start animate-pulse',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <div className="size-8 rounded-full bg-muted shrink-0" />
      <div
        className={cn(
          'rounded-lg px-3.5 py-2.5 w-[65%] space-y-2',
          isUser ? 'bg-primary/5' : 'bg-muted/50',
        )}
      >
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

function toUIMessages(
  dbMessages: { id: string; role: string; content: string; createdAt: Date }[],
): UIMessage[] {
  return dbMessages.map((msg) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    parts: [{ type: 'text' as const, text: msg.content }],
    createdAt: msg.createdAt,
  }));
}

export function ConversationSheet({
  outreachId,
  prospectName,
  trigger,
}: ConversationSheetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
  } = useChat({
    id: `outreach-${outreachId}`,
    experimental_throttle: 50,
    transport: new DefaultChatTransport({
      api: '/api/outreach/reply',
      prepareSendMessagesRequest: ({ messages: chatMessages }) => {
        const lastMessage = chatMessages[chatMessages.length - 1];
        const replyText =
          lastMessage?.parts
            ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
            .map((p) => p.text)
            .join('') ?? '';

        return {
          body: {
            outreachMessageId: outreachId,
            replyText,
          },
        };
      },
    }),
    onFinish: ({ isAbort, isError }) => {
      if (!isAbort && !isError) {
        loadMessages(true);
        router.refresh();
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to generate reply');
    },
  });

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    setTimeout(scrollToBottom, 50);
  }, [messages, scrollToBottom]);

  async function loadMessages(silent = false) {
    if (!silent) setMessagesLoading(true);
    try {
      const thread = await getConversationThread(outreachId);
      setMessages(toUIMessages(thread));
    } catch {
      toast.error('Failed to load conversation');
    } finally {
      if (!silent) setMessagesLoading(false);
    }
  }

  function handleSend() {
    if (!input.trim() || status !== 'ready') return;
    const text = input.trim();
    setInput('');
    sendMessage({ text });
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) {
      loadMessages();
    }
  }

  const isBusy = status === 'submitted' || status === 'streaming';

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon-sm" className="gap-1.5">
            <MessageSquare className="size-3.5" />
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="flex items-center gap-2 text-sm">
            <Bot className="size-4 text-primary" />
            Conversation with {prospectName || 'Prospect'}
          </SheetTitle>
        </SheetHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 p-4"
        >
          {messagesLoading ? (
            <div className="space-y-4">
              <MessageSkeleton role="user" />
              <MessageSkeleton role="assistant" />
              <MessageSkeleton role="user" />
            </div>
          ) : messages.length === 0 && status === 'ready' ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <MessageSquare className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Paste your prospect&apos;s reply to generate a follow-up
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isLastAssistant =
                  msg.role === 'assistant' &&
                  msg.id === messages[messages.length - 1]?.id;
                const messageStatus: ConversationStatus = isLastAssistant && isBusy ? (status as ConversationStatus) : 'ready';

                const text = msg.parts
                  .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                  .map((p) => p.text)
                  .join('');

                return (
                  <ConversationMessage
                    key={msg.id}
                    role={msg.role as 'user' | 'assistant'}
                    content={text}
                    status={messageStatus}
                  />
                );
              })}
            </>
          )}
        </div>

        {status === 'error' && error && (
          <div className="flex items-center justify-between border-t px-4 py-2 bg-destructive/5">
            <span className="text-xs text-destructive">
              Failed to generate reply.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => regenerate()}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="size-3" />
              Retry
            </Button>
          </div>
        )}

        <div className="border-t p-4">
          <div className="relative flex flex-col">
            <Textarea
              placeholder="Paste prospect reply here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={2}
              disabled={status !== 'ready' || messagesLoading}
              className="resize-none text-sm pr-12 pb-10 min-h-[80px]"
            />
            <div className="absolute right-2 bottom-2 z-10">
              {isBusy ? (
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => stop()}
                  type="button"
                >
                  <Square className="size-3.5 animate-pulse" />
                </Button>
              ) : (
                <Button
                  size="icon-sm"
                  onClick={handleSend}
                  disabled={!input.trim() || status !== 'ready' || messagesLoading}
                  type="button"
                >
                  <Send className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
