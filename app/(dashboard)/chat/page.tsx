'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Send, Square, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  chatApi,
  streamChat,
  type ChatSource,
  type Conversation,
} from '@/lib/chat-api';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { UpgradePrompt } from '@/components/UpgradePrompt';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  streaming?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);

  // Sidebar data
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);

  const abortRef = useRef<(() => void) | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      abortRef.current?.();
    };
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const data = await chatApi.listConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  function handleStop() {
    abortRef.current?.();
    abortRef.current = null;
    setLoading(false);
    setMessages((m) =>
      m.map((msg, i) =>
        i === m.length - 1 && msg.streaming
          ? { ...msg, streaming: false }
          : msg
      )
    );
  }

  function handleNewChat() {
    handleStop();
    setMessages([]);
    setConversationId(null);
    setLimitError(null);
  }

  async function handleSelectConversation(cid: string) {
    handleStop();
    setLoading(true);
    try {
      const data = await chatApi.getConversation(cid);
      setConversationId(cid);
      setMessages(
        (data.messages || []).map((m: any) => ({
          role: m.role,
          content: m.content,
          sources: m.sources,
        }))
      );
      setLimitError(null);
    } catch {
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  }

  async function handleRename(id: string, title: string) {
    try {
      await chatApi.renameConversation(id, title);
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, title } : c))
      );
    } catch {
      toast.error('Rename failed');
    }
  }

  async function handleDelete(id: string) {
    try {
      await chatApi.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }
    } catch {
      toast.error('Delete failed');
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setLimitError(null);

    setMessages((m) => [
      ...m,
      { role: 'user', content: question },
      { role: 'assistant', content: '', streaming: true },
    ]);
    setLoading(true);

    const abort = streamChat(
      { question, conversationId: conversationId || undefined },
      {
        onMeta: ({ conversationId: cid }) => {
          if (!conversationId) {
            setConversationId(cid);
            // Refresh sidebar so the new conversation appears
            loadConversations();
          }
        },
        onSources: (sources) => {
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last?.role === 'assistant') {
              copy[copy.length - 1] = { ...last, sources };
            }
            return copy;
          });
        },
        onToken: (token) => {
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last?.role === 'assistant') {
              copy[copy.length - 1] = {
                ...last,
                content: last.content + token,
              };
            }
            return copy;
          });
        },
        onDone: () => {
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last?.role === 'assistant') {
              copy[copy.length - 1] = { ...last, streaming: false };
            }
            return copy;
          });
          setLoading(false);
          abortRef.current = null;
        },
        onError: (err) => {
          if (err.includes('402') || err.toLowerCase().includes('limit')) {
            setLimitError('You have reached your message limit for this month.');
          } else {
            toast.error(err);
          }

          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last?.role === 'assistant' && !last.content) {
              copy.pop();
            } else if (last?.role === 'assistant') {
              copy[copy.length - 1] = { ...last, streaming: false };
            }
            return copy;
          });
          setLoading(false);
          abortRef.current = null;
        },
      }
    );

    abortRef.current = abort;
  }

  return (
    <div className="flex h-screen">
      <aside className="hidden lg:flex w-72 flex-shrink-0">
        <ChatSidebar
          conversations={conversations}
          activeId={conversationId}
          loading={conversationsLoading}
          onSelect={handleSelectConversation}
          onCreate={handleNewChat}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-4 border-b">
          <h1 className="text-lg font-bold">Chat</h1>
        </header>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {limitError && (
            <UpgradePrompt
              title="Message limit reached"
              message={limitError}
            />
          )}

          {messages.length === 0 && !limitError && <EmptyState />}

          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="p-4 border-t flex gap-2 items-end"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={!!limitError}
          />

          {loading ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleStop}
              size="lg"
            >
              <Square className="w-4 h-4 mr-2 fill-current" />
              Stop
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              disabled={!input.trim() || !!limitError}
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">
          {message.content}
          {message.streaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse align-middle" />
          )}
        </p>

        {message.sources && message.sources.length > 0 && (
          <details className="mt-3 pt-3 border-t border-background/20">
            <summary className="text-xs font-semibold opacity-70 cursor-pointer select-none">
              {message.sources.length} source
              {message.sources.length > 1 ? 's' : ''}
            </summary>
            <div className="mt-2 space-y-2">
              {message.sources.map((s, idx) => (
                <div
                  key={s.chunkId ?? `src-${idx}`}
                  className="text-xs opacity-80 p-2 rounded bg-background/40"
                >
                  <div className="font-medium">
                    [{s.sourceNumber}] {s.documentName}
                  </div>
                  <div className="mt-1 opacity-70 line-clamp-3">
                    {s.text.slice(0, 200)}...
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare className="w-7 h-7 text-primary" />
      </div>
      <h2 className="text-xl font-semibold">Ask your documents anything</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        Your answers are grounded in the PDFs you have uploaded. Sources are
        cited inline.
      </p>
    </div>
  );
}
