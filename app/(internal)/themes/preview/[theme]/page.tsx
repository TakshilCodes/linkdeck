import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ThemePreviewCard from "@/components/theme/ThemePreviewCard";

type PageProps = {
  params: Promise<{
    theme: string;
  }>;
};

export default async function PreviewPage({ params }: PageProps) {
  const { theme } = await params;

  const themeData = await prisma.defaultTheme.findUnique({
    where: { slug: theme },
  });

  if (!themeData) notFound();

  return (
    <main className="min-h-screen w-full">
      <ThemePreviewCard theme={themeData} />
    </main>
  );
}