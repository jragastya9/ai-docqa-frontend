'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  FileText,
  MessageSquare,
  Users,
  Upload,
  Plus,
  CreditCard,
  BarChart3,
  Settings,
  Loader2,
  Search,
} from 'lucide-react';
import { searchApi, type SearchResult } from '@/lib/search-api';
import { useOS } from '@/lib/platform';
import { cn } from '@/lib/utils';

export function CommandPalette() {
  const router = useRouter();
  const os = useOS();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    documents: SearchResult[];
    conversations: SearchResult[];
    members: SearchResult[];
  }>({ documents: [], conversations: [], members: [] });

  // ⌘K on Mac, Ctrl+K on Windows/Linux
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const mod = os === 'mac' ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [os]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults({ documents: [], conversations: [], members: [] });
      return;
    }

    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await searchApi.global(query);
        setResults(res);
      } catch {
        setResults({ documents: [], conversations: [], members: [] });
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query, open]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery('');
      router.push(href);
    },
    [router]
  );

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              shouldFilter={false}
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <Search className="w-4 h-4 text-muted-foreground" />
                )}
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search documents, chats, team, or run a command..."
                  className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                  {query.trim().length < 2
                    ? 'Type to search...'
                    : loading
                    ? 'Searching...'
                    : 'No results found'}
                </Command.Empty>

                {query.trim().length < 2 && (
                  <Command.Group heading="Quick actions">
                    <PaletteItem
                      icon={Upload}
                      title="Upload a document"
                      subtitle="Add a new PDF"
                      onSelect={() => navigate('/documents')}
                    />
                    <PaletteItem
                      icon={Plus}
                      title="New chat"
                      subtitle="Start a conversation"
                      onSelect={() => navigate('/chat')}
                    />
                    <PaletteItem
                      icon={BarChart3}
                      title="View analytics"
                      subtitle="Usage & insights"
                      onSelect={() => navigate('/analytics')}
                    />
                    <PaletteItem
                      icon={CreditCard}
                      title="Manage billing"
                      subtitle="Plans & usage"
                      onSelect={() => navigate('/billing')}
                    />
                    <PaletteItem
                      icon={Settings}
                      title="Settings"
                      subtitle="Profile & preferences"
                      onSelect={() => navigate('/settings')}
                    />
                  </Command.Group>
                )}

                {results.documents.length > 0 && (
                  <Command.Group heading="Documents">
                    {results.documents.map((r) => (
                      <PaletteItem
                        key={r.id}
                        icon={FileText}
                        title={r.title}
                        subtitle={r.subtitle}
                        onSelect={() => navigate(r.href)}
                      />
                    ))}
                  </Command.Group>
                )}

                {results.conversations.length > 0 && (
                  <Command.Group heading="Conversations">
                    {results.conversations.map((r) => (
                      <PaletteItem
                        key={r.id}
                        icon={MessageSquare}
                        title={r.title}
                        subtitle={r.subtitle}
                        onSelect={() => navigate(r.href)}
                      />
                    ))}
                  </Command.Group>
                )}

                {results.members.length > 0 && (
                  <Command.Group heading="Team">
                    {results.members.map((r) => (
                      <PaletteItem
                        key={r.id}
                        icon={Users}
                        title={r.title}
                        subtitle={r.subtitle}
                        onSelect={() => navigate(r.href)}
                      />
                    ))}
                  </Command.Group>
                )}
              </Command.List>

              <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="font-mono px-1.5 py-0.5 rounded border border-border bg-muted">
                    ↑↓
                  </kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="font-mono px-1.5 py-0.5 rounded border border-border bg-muted">
                    ↵
                  </kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="font-mono px-1.5 py-0.5 rounded border border-border bg-muted">
                    Esc
                  </kbd>
                  Close
                </span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

function PaletteItem({
  icon: Icon,
  title,
  subtitle,
  onSelect,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer',
        'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground'
      )}
    >
      <Icon className="w-4 h-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
    </Command.Item>
  );
}
