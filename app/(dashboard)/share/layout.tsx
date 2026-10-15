import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share links',
  description: 'Public Q&A links for your customers.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
