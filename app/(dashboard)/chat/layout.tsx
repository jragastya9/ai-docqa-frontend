import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Ask questions and get cited answers from your documents.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
