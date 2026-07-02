import Navbar from "@/components/navbar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative z-10 font-sans">
      <Navbar />
      {children}
    </div>
  );
}