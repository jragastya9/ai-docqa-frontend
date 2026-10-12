'use client';

import { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Loader2,
  Link2,
  QrCode,
  Download,
  ExternalLink,
  Calendar,
  Eye,
  MessageSquare,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { shareApi, ShareLink } from '@/lib/share-api';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentName: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  documentId,
  documentName,
}: ShareDialogProps) {
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const shareUrl = shareLink
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${shareLink.token}`
    : '';

  // Load existing share link or create new one when dialog opens
  useEffect(() => {
    if (!open) return;

    async function init() {
      setLoading(true);
      try {
        const links = await shareApi.list();
        const existing = links.find(
          (l) => l.documentId === documentId && l.isActive
        );

        if (existing) {
          setShareLink(existing);
        } else {
          const created = await shareApi.create({
            documentId,
            title: `Ask about ${documentName}`,
            expiresInDays: 30,
          });
          setShareLink(created);
        }
      } catch (err) {
        toast.error('Failed to load share link');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [open, documentId, documentName]);

  // Generate QR code when share URL changes
  useEffect(() => {
    if (!shareUrl) {
      setQrDataUrl('');
      return;
    }

    // Use QR Server API (no install needed)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
    setQrDataUrl(qrUrl);
  }, [shareUrl]);

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQR() {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${documentName}-qr.png`;
    link.click();
    toast.success('QR code downloaded');
  }

  async function toggleActive() {
    if (!shareLink) return;
    try {
      const updated = await shareApi.update(shareLink._id, {
        isActive: !shareLink.isActive,
      });
      setShareLink(updated);
      toast.success(updated.isActive ? 'Share link enabled' : 'Share link disabled');
    } catch {
      toast.error('Failed to update');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Share &ldquo;{documentName}&rdquo;
          </DialogTitle>
          <DialogDescription>
            Share this link with your customers. They can ask questions instantly
            — no login needed.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : shareLink ? (
          <div className="space-y-6">
            {/* Status badge */}
            <div className="flex items-center justify-between">
              <Badge variant={shareLink.isActive ? 'default' : 'secondary'}>
                {shareLink.isActive ? 'Active' : 'Disabled'}
              </Badge>
              <button
                onClick={toggleActive}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {shareLink.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>

            {/* Link input + copy */}
            <div className="space-y-2">
              <Label>Public link</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="text-xs" />
                <Button onClick={copyLink} size="icon" className="flex-shrink-0">
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => window.open(shareUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                icon={Eye}
                label="Views"
                value={shareLink.viewCount}
              />
              <StatCard
                icon={MessageSquare}
                label="Chats"
                value={shareLink.chatCount}
              />
              <StatCard
                icon={Calendar}
                label="Expires"
                value={
                  shareLink.expiresAt
                    ? new Date(shareLink.expiresAt).toLocaleDateString()
                    : 'Never'
                }
              />
            </div>

            {/* QR Code */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>QR Code</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadQR}
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
              <div className="bg-white rounded-lg p-4 flex items-center justify-center border border-border">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                ) : (
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Print this on your shop, share on WhatsApp, or post on Instagram
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Failed to create share link
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="text-center p-3 rounded-lg border border-border bg-muted/30">
      <Icon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}