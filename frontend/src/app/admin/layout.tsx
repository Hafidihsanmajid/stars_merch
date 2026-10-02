import type { Metadata } from 'next';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';

export const metadata: Metadata = {
  title: 'Admin Portal | Stars Merch',
  description: 'Portal manajemen katalog dan inventaris pakaian resmi Stars Merch.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>;
}
