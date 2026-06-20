import "../globals.css";
import Navbar from "@/components/navbar";

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
