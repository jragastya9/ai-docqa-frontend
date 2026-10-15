import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documents',
  description: 'Upload and manage your PDF documents.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
