import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Manage workspace members and roles.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
