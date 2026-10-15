import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Track usage, top questions, and cited documents.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
