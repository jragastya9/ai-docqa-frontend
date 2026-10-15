'use client';

import { useEffect, useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Loader2,
  MessageSquare,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  supportApi,
  type Ticket,
  type TicketDetail,
} from '@/lib/support-api';

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await supportApi.list();
      setTickets(data.tickets);
      setIsAdmin(data.isAdmin);
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  if (selected) {
    return (
      <TicketDetailView
        id={selected}
        isAdmin={isAdmin}
        onBack={() => {
          setSelected(null);
          load();
        }}
      />
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LifeBuoy className="w-7 h-7" />
            Support
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'All tickets across the platform' : 'Your support tickets'}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New ticket
        </Button>
      </div>

      {showCreate && (
        <CreateTicketForm
          onClose={() => setShowCreate(false)}
          onCreated={async () => {
            setShowCreate(false);
            await load();
          }}
        />
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <LifeBuoy className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-medium">No tickets yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Create a ticket and we&apos;ll help you out.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent/50 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{t.subject}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {t.description}
                  </p>
                  {isAdmin && t.userEmail && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.userEmail}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StatusPill status={t.status} />
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                  {t.replyCount ? (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="w-2.5 h-2.5" />
                      {t.replyCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === 'open'
      ? 'bg-blue-500/10 text-blue-600'
      : status === 'in_progress'
      ? 'bg-yellow-500/10 text-yellow-600'
      : status === 'resolved'
      ? 'bg-green-500/10 text-green-600'
      : 'bg-muted text-muted-foreground';
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${cls} capitalize`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function CreateTicketForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    subject: '',
    description: '',
    category: 'question',
    priority: 'normal',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await supportApi.create(form);
      toast.success('Ticket created');
      onCreated();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>New support ticket</CardTitle>
        <button onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) =>
                setForm((f) => ({ ...f, subject: e.target.value }))
              }
              required
              maxLength={200}
              placeholder="Brief description of the issue"
              className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full px-4 py-2.5 border rounded-lg bg-background"
              >
                <option value="question">Question</option>
                <option value="bug">Bug report</option>
                <option value="billing">Billing</option>
                <option value="feature_request">Feature request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value }))
                }
                className="w-full px-4 py-2.5 border rounded-lg bg-background"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              required
              rows={6}
              maxLength={5000}
              placeholder="Explain what happened, what you tried, and what you expected."
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {form.description.length} / 5000
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Create ticket
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function TicketDetailView({
  id,
  isAdmin,
  onBack,
}: {
  id: string;
  isAdmin: boolean;
  onBack: () => void;
}) {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      const data = await supportApi.get(id);
      setTicket(data.ticket);
    } catch {
      toast.error('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      await supportApi.reply(id, reply);
      setReply('');
      await load();
      toast.success('Reply added');
    } catch {
      toast.error('Failed to send');
    } finally {
      setSending(false);
    }
  }

  async function handleStatus(status: string) {
    try {
      await supportApi.update(id, { status });
      toast.success('Status updated');
      await load();
    } catch {
      toast.error('Failed');
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowLeft className="w-3 h-3" /> Back to tickets
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            #{ticket.id.slice(-8)} · {new Date(ticket.createdAt).toLocaleString()}
            {ticket.userEmail && ` · ${ticket.userEmail}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={ticket.status} />
          {isAdmin && (
            <select
              value={ticket.status}
              onChange={(e) => handleStatus(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-border bg-background"
            >
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>
      </div>

      {/* Original message */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-2">
            {ticket.category} · {ticket.priority} priority
          </p>
          <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-3">
        {ticket.replies.map((r) => (
          <div
            key={r.id}
            className={cn(
              'p-4 rounded-lg border',
              r.authorRole === 'admin'
                ? 'bg-primary/5 border-primary/30'
                : 'bg-muted/30 border-border'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">{r.authorName}</span>
              {r.authorRole === 'admin' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  Support
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(r.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{r.message}</p>
          </div>
        ))}
      </div>

      {/* Reply form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleReply} className="space-y-3">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={isAdmin ? 'Reply as support...' : 'Add a reply...'}
              rows={4}
              maxLength={5000}
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={sending || !reply.trim()}>
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Send reply
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
