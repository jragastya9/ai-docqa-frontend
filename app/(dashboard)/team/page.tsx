'use client';

import { useEffect, useState } from 'react';
import {
  UserPlus,
  Users,
  Mail,
  Loader2,
  MoreVertical,
  Trash2,
  Shield,
  Crown,
  Eye,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { teamApi, TeamMember, PendingInvite } from '@/lib/team-api';
import { cn } from '@/lib/utils';

const ROLE_ICONS: Record<string, any> = {
  owner: Crown,
  admin: Shield,
  member: Users,
  viewer: Eye,
};

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-primary/10 text-primary',
  admin: 'bg-purple-500/10 text-purple-500',
  member: 'bg-blue-500/10 text-blue-500',
  viewer: 'bg-muted text-muted-foreground',
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const myRole = members.find((m) => m.isYou)?.role || 'member';
  const canManage = ['owner', 'admin'].includes(myRole);
  const isOwner = myRole === 'owner';

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await teamApi.list();
      setMembers(data.members);
      setInvites(data.pendingInvites);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load team');
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await teamApi.invite(inviteEmail.trim(), inviteRole);
      toast.success('Invitation sent');
      setInviteEmail('');
      setInviteRole('member');
      setShowInvite(false);
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invite failed');
    } finally {
      setInviting(false);
    }
  }

  async function handleChangeRole(memberId: string, role: string) {
    try {
      await teamApi.updateRole(memberId, role);
      toast.success('Role updated');
      setOpenMenu(null);
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  }

  async function handleRemove(memberId: string, name: string) {
    if (!confirm(`Remove ${name} from the workspace?`)) return;
    try {
      await teamApi.remove(memberId);
      toast.success('Member removed');
      setOpenMenu(null);
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  }

  async function handleRevoke(inviteId: string) {
    if (!confirm('Revoke this invitation?')) return;
    try {
      await teamApi.revokeInvite(inviteId);
      toast.success('Invitation revoked');
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage who has access to your workspace
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setShowInvite(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite member
          </Button>
        )}
      </div>

      {/* Invite dialog */}
      {showInvite && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Invite a teammate</CardTitle>
            <button
              onClick={() => setShowInvite(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="teammate@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
                autoFocus
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
              <Button type="submit" disabled={inviting}>
                {inviting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Send invite
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => {
                const RoleIcon = ROLE_ICONS[member.role] || Users;
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition relative"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-semibold text-primary">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          {member.name}
                        </p>
                        {member.isYou && (
                          <Badge variant="secondary" className="text-[10px]">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                        ROLE_COLORS[member.role]
                      )}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {member.role}
                    </div>

                    {/* Actions menu — only if you can manage AND it's not you AND not the owner */}
                    {canManage &&
                      !member.isYou &&
                      member.role !== 'owner' && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === member.id ? null : member.id
                              )
                            }
                            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMenu === member.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenu(null)}
                              />
                              <div className="absolute right-0 top-10 z-20 w-44 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                                {isOwner && (
                                  <>
                                    <div className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">
                                      Change role
                                    </div>
                                    {['admin', 'member', 'viewer']
                                      .filter((r) => r !== member.role)
                                      .map((r) => (
                                        <button
                                          key={r}
                                          onClick={() =>
                                            handleChangeRole(member.id, r)
                                          }
                                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition text-left capitalize"
                                        >
                                          <span>
                                            Set as {r}
                                          </span>
                                        </button>
                                      ))}
                                    <div className="border-t border-border" />
                                  </>
                                )}
                                {isOwner && (
                                  <button
                                    onClick={() =>
                                      handleRemove(member.id, member.name)
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition text-left"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Remove from team
                                  </button>
                                )}
                                {!isOwner && (
                                  <div className="px-3 py-2 text-xs text-muted-foreground">
                                    Only the owner can change roles
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending invites */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending invitations ({invites.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invites.map((invite) => {
                const daysLeft = Math.ceil(
                  (new Date(invite.expiresAt).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={invite.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{invite.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Invited as {invite.role} · Expires in {daysLeft}d
                      </p>
                    </div>
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(invite.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
