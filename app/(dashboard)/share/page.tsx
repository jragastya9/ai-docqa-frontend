'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Link2,
  Eye,
  MessageSquare,
  Trash2,
  ExternalLink,
  Loader2,
  Plus,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { shareApi, ShareLink } from '@/lib/share-api';

export default function SharePage() {
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await shareApi.list();
      setLinks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this share link? Customers using it will see an error.'))
      return;
    try {
      await shareApi.remove(id);
      setLinks((l) => l.filter((x) => x._id !== id));
      toast.success('Share link deleted');
    } catch {
      toast.error('Delete failed');
    }
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Share links</h1>
          <p className="text-muted-foreground mt-1">
            Public links your customers can use to chat with your documents
          </p>
        </div>
        <Link
          href="/documents"
          className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          Create new
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : links.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No share links yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Share a document publicly so your customers can ask questions
              about it — no login required.
            </p>
            <Link
              href="/documents"
              className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" />
              Create your first share
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <Card key={link._id} className="hover:border-primary/30 transition">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <h3 className="font-semibold truncate">{link.title}</h3>
                      <Badge
                        variant={link.isActive ? 'default' : 'secondary'}
                        className="text-xs flex-shrink-0"
                      >
                        {link.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      /share/{link.token}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {link.viewCount} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {link.chatCount} chats
                      </span>
                      {link.expiresAt && (
                        <span>
                          Expires{' '}
                          {new Date(link.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyLink(link.token)}
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`/share/${link.token}`, '_blank')
                      }
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(link._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}