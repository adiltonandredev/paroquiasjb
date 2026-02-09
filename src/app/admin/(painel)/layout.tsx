import AdminLayout from "@/components/admin/ui/admin-layout";

export default function PainelRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}