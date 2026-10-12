'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Send, FileText, Sparkles, Menu as MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { chatApi, Conversation, Source } from '@/lib/chat-api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [openSources, setOpenSources] = useState<number | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function loadConversations() {
    try {
      const list = await chatApi.listConversations();
      setConversations(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConversations(false);
    }
  }

  async function selectConversation(id: string) {
    if (id === activeId) return;
    setActiveId(id);
    setLoadingMessages(true);
    setMessages([]);
    try {
      const { messages: loaded } = await chatApi.getConversation(id);
      setMessages(
        loaded.map((m) => ({
          role: m.role,
          content: m.content,
          sources: m.sources || [],
        }))
      );
    } catch {
      toast.error('Failed to load conversation');
    } finally {
      setLoadingMessages(false);
    }
  }

  function createNewChat() {
    setActiveId(null);
    setMessages([]);
    setInput('');
    setMobileSidebarOpen(false);
  }

  async function renameConversation(id: string, title: string) {
    try {
      const updated = await chatApi.renameConversation(id, title);
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      );
      toast.success('Renamed');
    } catch {
      toast.error('Rename failed');
    }
  }

  async function deleteConversation(id: string) {
    try {
      await chatApi.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
      }
      toast.success('Conversation deleted');
    } catch {
      toast.error('Delete failed');
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const result = await chatApi.sendMessage({
        question,
        conversationId: activeId || undefined,
        topK: 5,
      });

      if (!activeId) {
        setActiveId(result.conversationId);
      }
      await loadConversations();

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const msg = error.response?.data?.error || 'Something went wrong';
      setMessages((m) => [...m, { role: 'assistant', content: `Error: ${msg}` }]);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 flex-shrink-0">
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          loading={loadingConversations}
          onSelect={selectConversation}
          onCreate={createNewChat}
          onRename={renameConversation}
          onDelete={deleteConversation}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 z-50 md:hidden">
            <ChatSidebar
              conversations={conversations}
              activeId={activeId}
              loading={loadingConversations}
              onSelect={(id) => {
                selectConversation(id);
                setMobileSidebarOpen(false);
              }}
              onCreate={() => {
                createNewChat();
                setMobileSidebarOpen(false);
              }}
              onRename={renameConversation}
              onDelete={deleteConversation}
            />
          </aside>
        </>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden border-b border-border p-3 flex items-center gap-3 bg-card">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium truncate">
            {activeId
              ? conversations.find((c) => c._id === activeId)?.title
              : 'New chat'}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            {loadingMessages ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Ask a question about your documents
                </h2>
                <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                  Upload a PDF and I&apos;ll answer questions grounded in its
                  content — with exact source citations.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                  {[
                    'What is this document about?',
                    'Summarize the key points',
                    'What should I know before using this?',
                    'List all the important details',
                  ].map((s) => (
                    <div
                      key={s}
                      className="p-3 rounded-lg border border-border bg-card text-sm text-muted-foreground"
                    >
                      &ldquo;{s}&rdquo;
                    </div>
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
                              <div className="mt-3 space-y-2">
                                {msg.sources.map((src) => (
                                  <div
                                    key={src.chunkId}
                                    className="bg-muted p-3 rounded-lg text-xs"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium">
                                        [Source {src.sourceNumber}] {src.documentName}
                                      </span>
                                      <span className="text-muted-foreground">
                                        match {Math.round(src.score * 100)}%
                                      </span>
                                    </div>
                                    <p className="text-muted-foreground line-clamp-4">
                                      {src.text}
                                    </p>
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

                {loading && (
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
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card p-4">
          <form onSubmit={send} className="max-w-3xl mx-auto flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your documents..."
              disabled={loading}
              className="flex-1 h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-11 px-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Send</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}