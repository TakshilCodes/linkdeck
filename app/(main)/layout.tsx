import Sidebar from "@/components/dashboard/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar/>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}