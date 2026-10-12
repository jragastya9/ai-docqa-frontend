'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Loader2,
  Send,
  Sparkles,
  FileText,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { shareApi, PublicShare } from '@/lib/share-api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { sourceNumber: number; documentName: string; score: number }[];
}

export default function PublicSharePage() {
  const params = useParams();
  const token = params?.token as string;

  const [share, setShare] = useState<PublicShare | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [openSources, setOpenSources] = useState<number | null>(null);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const data = await shareApi.getPublic(token);
        setShare(data);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { error?: string } } };
        setError(e.response?.data?.error || 'This link is not available');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending || !token) return;

    const question = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setSending(true);

    try {
      const result = await shareApi.publicChat(token, question);
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            e.response?.data?.error ||
            'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  // ============ LOADING ============
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ============ ERROR ============
  if (error || !share) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Link not available</h1>
          <p className="text-muted-foreground">
            {error || 'This share link has expired or been disabled.'}
          </p>
        </div>
      </div>
    );
  }

  // ============ MAIN UI ============
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className="border-b border-border p-4 text-white shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${share.businessColor}, ${share.businessColor}dd)`,
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-lg truncate">{share.title}</h1>
            <p className="text-xs opacity-90 truncate">
              {share.businessName} · Powered by LocalBiz AI
            </p>
          </div>
        </div>
      </header>

      {/* Description */}
      {share.description && (
        <div className="border-b border-border bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 py-3 text-sm text-muted-foreground">
            {share.description}
          </div>
        </div>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Ask anything about our services
              </h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Get instant answers from our documents. Just type your question
                below.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                {[
                  'What services do you offer?',
                  'What are your prices?',
                  'What are your hours?',
                  'How do I book?',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="p-3 rounded-lg border border-border bg-card text-sm text-left hover:bg-accent transition"
                  >
                    &ldquo;{s}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={i}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.content}
                      </p>

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <button
                            onClick={() =>
                              setOpenSources(openSources === i ? null : i)
                            }
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            {openSources === i ? 'Hide' : 'Show'}{' '}
                            {msg.sources.length} source
                            {msg.sources.length > 1 ? 's' : ''}
                          </button>

                          {openSources === i && (
                            <div className="mt-2 space-y-1">
                              {msg.sources.map((src) => (
                                <div
                                  key={src.sourceNumber}
                                  className="text-xs text-muted-foreground"
                                >
                                  [Source {src.sourceNumber}] match{' '}
                                  {Math.round(src.score * 100)}%
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-border bg-card p-4">
        <form onSubmit={send} className="max-w-3xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={sending}
            maxLength={500}
            className="flex-1 h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
          <Button
            type="submit"
            disabled={sending || !input.trim()}
            className="h-11 px-6"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Send</span>
              </>
            )}
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
          <Lock className="w-2.5 h-2.5" />
          Powered by LocalBiz AI
        </p>
      </footer>
    </div>
  );
}