import api from './api';

export interface SessionInfo {
  id: string;
  tokenId: string;
  browser: string;
  os: string;
  device: string;
  ipAddress: string;
  city: string;
  country: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export const securityApi = {
  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.post('/api/security/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  },

  async logoutAll() {
    const { data } = await api.post('/api/security/logout-all');
    return data;
  },

  async listSessions(): Promise<{
    sessions: SessionInfo[];
    currentTokenId: string;
  }> {
    const { data } = await api.get('/api/security/sessions');
    return data;
  },

  async revokeSession(id: string) {
    const { data } = await api.delete(`/api/security/sessions/${id}`);
    return data;
  },

  async get2FAStatus(): Promise<{
    enabled: boolean;
    enabledAt: string | null;
    backupCodeCount: number;
  }> {
    const { data } = await api.get('/api/security/2fa/status');
    return data;
  },

  async setup2FA(): Promise<{
    secret: string;
    qrCode: string;
    otpauthUrl: string;
  }> {
    const { data } = await api.post('/api/security/2fa/setup');
    return data;
  },

  async verify2FA(code: string): Promise<{
    message: string;
    backupCodes: string[];
  }> {
    const { data } = await api.post('/api/security/2fa/verify', { code });
    return data;
  },

  async disable2FA(code: string) {
    const { data } = await api.post('/api/security/2fa/disable', { code });
    return data;
  },

  async exportData() {
    const token = localStorage.getItem('token');
    const base =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/security/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localbiz-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  async deleteAccount(password: string, confirm: string) {
    const { data } = await api.delete('/api/security/account', {
      data: { password, confirm },
    });
    return data;
  },
};
