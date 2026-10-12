'use client';

import { Users, UserPlus, Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TeamPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspace members and roles
        </p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Construction className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Team management coming soon</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Invite your staff, assign roles (Owner, Admin, Member, Viewer), and
            collaborate on shared documents and chats.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Roles ready
            </div>
            <div className="flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              Invites coming
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}