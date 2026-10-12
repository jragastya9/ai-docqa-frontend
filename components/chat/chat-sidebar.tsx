'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '@/lib/chat-api';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function ChatSidebar({
  conversations,
  activeId,
  loading,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: ChatSidebarProps) {
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  function startEdit(conv: Conversation) {
    setEditingId(conv._id);
    setEditTitle(conv.title);
    setOpenMenu(null);
  }

  function saveEdit(id: string) {
    if (editTitle.trim()) onRename(id, editTitle.trim());
    setEditingId(null);
    setEditTitle('');
  }

  function confirmDelete(id: string) {
    if (confirm('Delete this conversation? This cannot be undone.')) {
      onDelete(id);
    }
    setOpenMenu(null);
  }

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const groups = groupByDate(filtered);

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* New chat button */}
      <div className="p-4 border-b border-border">
        <button
          onClick={onCreate}
          className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          New chat
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 px-3">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">No conversations yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Start a chat to see it here
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No chats match &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {group.label}
                </p>
                <div className="space-y-0.5 mt-1">
                  {group.items.map((conv) => (
                    <div key={conv._id} className="relative group">
                      {editingId === conv._id ? (
                        <div className="px-2">
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => saveEdit(conv._id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(conv._id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="w-full h-9 px-3 rounded-md border border-primary bg-background text-sm focus:outline-none"
                          />
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => onSelect(conv._id)}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-md text-sm transition flex items-center gap-2',
                              activeId === conv._id
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground hover:bg-accent'
                            )}
                          >
                            <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
                            <span className="flex-1 truncate">{conv.title}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(
                                openMenu === conv._id ? null : conv._id
                              );
                            }}
                            className={cn(
                              'absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded flex items-center justify-center transition',
                              'opacity-0 group-hover:opacity-100',
                              openMenu === conv._id && 'opacity-100',
                              activeId === conv._id
                                ? 'hover:bg-primary-foreground/20 text-primary-foreground'
                                : 'hover:bg-muted text-muted-foreground'
                            )}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMenu === conv._id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenu(null)}
                              />
                              <div className="absolute right-2 top-10 z-20 w-40 bg-popover border border-border rounded-md shadow-lg overflow-hidden">
                                <button
                                  onClick={() => startEdit(conv)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition text-left"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Rename
                                </button>
                                <button
                                  onClick={() => confirmDelete(conv._id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition text-left"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function groupByDate(conversations: Conversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    'Previous 7 days': [],
    Older: [],
  };

  for (const conv of conversations) {
    const date = new Date(conv.lastMessageAt);
    if (date >= today) groups.Today.push(conv);
    else if (date >= yesterday) groups.Yesterday.push(conv);
    else if (date >= weekAgo) groups['Previous 7 days'].push(conv);
    else groups.Older.push(conv);
  }

  return Object.entries(groups)
    .filter(([_, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}