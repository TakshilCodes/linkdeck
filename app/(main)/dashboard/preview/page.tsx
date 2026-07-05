import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ThemeProfileRenderer from "@/components/theme/ThemeProfileRenderer";
import { authOptions } from "@/lib/auth";
import { getDashboardPreviewPayload } from "@/lib/dashboard-preview";
import { getProfileUrlClipboard, getProfileUrlDisplay } from "@/utils/public-profile-url";

export const dynamic = "force-dynamic";

export default async function DashboardPreviewPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/signup");
  }

  const preview = await getDashboardPreviewPayload(userId);

  if (!preview) {
    redirect("/signup");
  }

  const publicUrl = getProfileUrlClipboard(preview.username);
  const displayUrl = getProfileUrlDisplay(preview.username);

  return (
    <section className="p-0 md:px-0 md:py-0">
      <div className="mb-6 hidden items-center justify-between md:flex">
        <div>
          <h1 className="text-2xl font-semibold text-white">Preview</h1>
          <p className="mt-1 text-sm text-white/45">{displayUrl}</p>
        </div>

        {publicUrl && (
          <Link
            href={publicUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 text-sm font-semibold text-white transition hover:border-[#00B8DB]/35 hover:bg-white/12"
          >
            Open public page
            <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </div>

      {preview.themeForClient ? (
        <>
          <div className="md:hidden">
            <ThemeProfileRenderer
              layout="page"
              theme={preview.themeForClient}
              profile={preview.profile}
              icons={preview.icons}
              standaloneLinks={preview.standaloneLinks}
              collections={preview.collections}
              sections={preview.sections}
            />
          </div>

          <div className="mx-auto hidden w-full max-w-3xl justify-center rounded-[32px] border border-white/10 bg-[#0a121c] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] md:flex md:min-h-[calc(100vh-8rem)] md:items-center">
            <div className="w-full max-w-[390px] overflow-hidden rounded-[44px] shadow-[0_24px_70px_rgba(0,0,0,0.48)] ring-1 ring-white/12">
              <ThemeProfileRenderer
                layout="embed"
                theme={preview.themeForClient}
                profile={preview.profile}
                icons={preview.icons}
                standaloneLinks={preview.standaloneLinks}
                collections={preview.collections}
                sections={preview.sections}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="mx-auto flex min-h-[420px] w-full max-w-[390px] flex-col items-center justify-center rounded-[32px] border border-dashed border-white/15 bg-white/3 px-6 text-center">
          <p className="text-sm font-semibold text-white">No theme selected</p>
          <p className="mt-2 text-sm leading-relaxed text-white/45">
            Pick a theme from Design to preview your LinkDeck page here.
          </p>
        </div>
      )}
    </section>
  );
}
