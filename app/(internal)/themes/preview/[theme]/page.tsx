import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ThemeProfileRenderer from "@/components/theme/ThemeProfileRenderer";

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
      <ThemeProfileRenderer
        theme={themeData}
        profile={{
          username: "takshil.dev",
          displayName: "takshil.dev",
          profileImgUrl: "/preview/profile_picture.jpg",
          bio: null,
        }}
        icons={[
          { id: "1", type: "INSTAGRAM", url: "#" },
          { id: "2", type: "THREADS", url: "#" },
          { id: "3", type: "X", url: "#" },
        ]}
        standaloneLinks={[
          { id: "1", name: "ShopKart", url: "#" },
          { id: "2", name: "volt.in", url: "#" },
          { id: "3", name: "dub.sh", url: "#" },
        ]}
        collections={[]}
        showBranding={true}
      />
    </main>
  );
}