'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Database,
  Download,
  Activity,
  HardDrive,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminBackupPage() {
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/api/backup/stats'),
      api.get('/api/backup/health'),
    ])
      .then(([s, h]) => {
        setStats(s.data.database);
        setHealth(h.data);
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  async function handleExport() {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const base =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/backup/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `localbiz-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Backup downloaded');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to admin
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-3">
          Backup & Health
        </h1>
        <p className="text-muted-foreground mt-1">
          Database size, health, and full backups
        </p>
      </div>

      {/* Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            System health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm">
                  API: <strong className="text-green-500">healthy</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm">
                  MongoDB: <strong className="text-green-500">{health?.mongodb}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border text-sm">
                <div>
                  <p className="text-muted-foreground">Uptime</p>
                  <p className="font-medium">
                    {Math.floor((health?.uptimeSeconds || 0) / 3600)}h{' '}
                    {Math.floor(((health?.uptimeSeconds || 0) % 3600) / 60)}m
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Memory</p>
                  <p className="font-medium">
                    {health?.memory?.used} / {health?.memory?.total}{' '}
                    {health?.memory?.unit}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* DB Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database size
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Collections</p>
                <p className="text-xl font-bold">{stats?.collections}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Documents</p>
                <p className="text-xl font-bold">
                  {stats?.objects?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Data size</p>
                <p className="text-xl font-bold">{stats?.dataSizeMB} MB</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Storage</p>
                <p className="text-xl font-bold">
                  {stats?.storageSizeMB} MB
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            Full backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download a JSON backup of all tenants, users, documents, chats,
            and shares. Store it off-site (Google Drive, S3, external drive).
          </p>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download full backup
          </Button>
          <div className="p-4 rounded-lg bg-muted/30 border border-border text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Restore instructions</p>
            <p>
              To restore this backup:
              <br />
              1. Use MongoDB Compass
              <br />
              2. Open your cluster → database
              <br />
              3. For each collection, use <strong>Add Data → Import File</strong>
              <br />
              4. Select the matching array from this JSON
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
