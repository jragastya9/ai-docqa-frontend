'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Search,
  MoreVertical,
  Trash2,
  MessageSquare,
  Loader2,
  Plus,
  Share2,
  ExternalLink, // 👈 Added icon for View PDF
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ShareDialog } from '@/components/share/share-dialog';

interface DocumentItem {
  _id: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  chunkCount: number;
  status: string;
  createdAt: string;
  fileUrl?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [shareDoc, setShareDoc] = useState<{ id: string; name: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const { data } = await api.get('/api/documents');
      setDocuments(data.documents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.loading(`Embedding ${data.document.chunkCount} chunk(s)...`, {
        id: toastId,
      });

      await api.post(`/api/documents/${data.document.id}/embed`);

      toast.success('Document ready!', { id: toastId });
      await loadDocuments();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Upload failed', {
        id: toastId,
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;

    try {
      await api.delete(`/api/documents/${id}`);
      toast.success('Document deleted');
      loadDocuments();
    } catch {
      toast.error('Delete failed');
    }
  }

  const filtered = documents.filter((d) =>
    d.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">
            {documents.length} document{documents.length !== 1 ? 's' : ''} in
            your knowledge base
          </p>
        </div>

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload PDF
            </>
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {documents.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 && documents.length === 0 ? (
        <EmptyState onUpload={() => fileInputRef.current?.click()} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No documents match &ldquo;{search}&rdquo;
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{doc.fileName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {doc.pageCount} pages · {doc.chunkCount} chunks ·{' '}
                  {(doc.fileSize / 1024).toFixed(1)} KB
                </p>
              </div>

              <Badge
                variant={doc.status === 'completed' ? 'default' : 'secondary'}
                className="hidden sm:inline-flex"
              >
                {doc.status}
              </Badge>

              <span className="text-xs text-muted-foreground hidden md:block">
                {new Date(doc.createdAt).toLocaleDateString()}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent transition">
                  <MoreVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  
                  {/* 👇 NEW: View PDF option */}
                  {doc.fileUrl && (
                    <DropdownMenuItem
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Original PDF
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() =>
                      setShareDoc({ id: doc._id, name: doc.fileName })
                    }
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share publicly
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/chat')}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat with this
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => handleDelete(doc._id, doc.fileName)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      {shareDoc && (
        <ShareDialog
          open={!!shareDoc}
          onOpenChange={(open) => !open && setShareDoc(null)}
          documentId={shareDoc.id}
          documentName={shareDoc.name}
        />
      )}
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-semibold text-lg mb-1">No documents yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
        Upload your first PDF and let the AI learn it. Then ask questions and
        get answers with sources.
      </p>
      <Button onClick={onUpload}>
        <Plus className="w-4 h-4" />
        Upload your first PDF
      </Button>
    </div>
  );
}