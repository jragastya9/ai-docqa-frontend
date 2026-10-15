import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your profile, security, and preferences.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
