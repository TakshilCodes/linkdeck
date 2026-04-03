import { authOptions } from "@/lib/auth";
import { getDashboardPreviewPayload } from "@/lib/dashboard-preview";
import DashboardLivePreview from "@/components/dashboard/DashboardLivePreview";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/signup");
  }

  const preview = await getDashboardPreviewPayload(userId);
  if (!preview) {
    redirect("/signup");
  }

  return (
    <div className="min-h-screen bg-[#07101C]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">{children}</div>
          <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-[min(100%,404px)] xl:w-[min(100%,428px)]">
            <DashboardLivePreview
              username={preview.username}
              theme={preview.themeForClient}
              profile={preview.profile}
              icons={preview.icons}
              standaloneLinks={preview.standaloneLinks}
              collections={preview.collections}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
