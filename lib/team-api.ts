import api from './api';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  isYou: boolean;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
}

export interface TeamData {
  members: TeamMember[];
  pendingInvites: PendingInvite[];
}

export interface InviteDetails {
  email: string;
  role: string;
  workspaceName: string;
}

export const teamApi = {
  async list(): Promise<TeamData> {
    const { data } = await api.get('/api/team');
    return data;
  },
  async invite(email: string, role: string) {
    const { data } = await api.post('/api/team/invite', { email, role });
    return data;
  },
  async updateRole(id: string, role: string) {
    const { data } = await api.patch(`/api/team/${id}/role`, { role });
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/api/team/${id}`);
    return data;
  },
  async revokeInvite(id: string) {
    const { data } = await api.delete(`/api/team/invite/${id}`);
    return data;
  },
  async getInviteByToken(token: string): Promise<{ invitation: InviteDetails }> {
    const { data } = await api.get(`/api/team/invite/${token}`);
    return data;
  },
  async acceptInvite(token: string, name: string, password: string) {
    const { data } = await api.post(`/api/team/invite/${token}/accept`, {
      name,
      password,
    });
    return data;
  },
};
