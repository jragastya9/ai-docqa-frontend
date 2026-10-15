import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing & Plans',
  description: 'Manage your subscription, plan, and usage.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
