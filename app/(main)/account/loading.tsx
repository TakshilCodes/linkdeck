function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.08] ${className}`} />;
}

function SectionLabelSkeleton({ eyebrowWidth = "w-16" }: { eyebrowWidth?: string }) {
  return (
    <div>
      <SkeletonBlock className={`h-3 ${eyebrowWidth}`} />
      <SkeletonBlock className="mt-3 h-5 w-36" />
      <SkeletonBlock className="mt-2 h-4 w-52 max-w-full" />
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/10" />;
}

export default function AccountLoading() {
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:px-8 md:py-10 xl:px-10">
      <div className="mb-6 hidden md:block lg:mb-8">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="mt-3 h-8 w-56" />
        <SkeletonBlock className="mt-3 h-4 w-80 max-w-full" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] px-4 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:px-6 lg:px-8">
        <section className="py-6 sm:py-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-10">
            <SectionLabelSkeleton />
            <div className="rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <SkeletonBlock className="h-14 w-14 shrink-0 rounded-full" />
                  <div className="space-y-2">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="h-3.5 w-48 max-w-[45vw]" />
                    <SkeletonBlock className="h-3 w-16" />
                  </div>
                </div>
                <SkeletonBlock className="h-10 w-28 shrink-0" />
              </div>
              <div className="mt-5 border-t border-white/10 pt-5">
                <SkeletonBlock className="h-3 w-8" />
                <SkeletonBlock className="mt-3 h-4 w-4/5" />
                <SkeletonBlock className="mt-2 h-4 w-3/5" />
              </div>
            </div>
          </div>
        </section>

        <Divider />

        <section className="py-6 sm:py-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-10">
            <SectionLabelSkeleton eyebrowWidth="w-14" />
            <div className="rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-5">
              <SkeletonBlock className="h-3 w-44" />
              <div className="mt-3 flex items-center justify-between gap-4">
                <SkeletonBlock className="h-4 w-3/5" />
                <div className="flex gap-2">
                  <SkeletonBlock className="h-10 w-20" />
                  <SkeletonBlock className="h-10 w-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        <section className="py-6 sm:py-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-10">
            <SectionLabelSkeleton eyebrowWidth="w-14" />
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/15">
              <div className="flex border-b border-white/10 p-1.5">
                <SkeletonBlock className="h-10 flex-1" />
                <SkeletonBlock className="ml-1.5 h-10 flex-1" />
              </div>
              <div className="space-y-4 p-4 sm:p-5">
                <SkeletonBlock className="h-3 w-28" />
                <SkeletonBlock className="h-11 w-full" />
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-11 w-full" />
                <SkeletonBlock className="ml-auto h-11 w-40" />
              </div>
            </div>
          </div>
        </section>

        <Divider />

        <section className="py-6 sm:py-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-10">
            <SectionLabelSkeleton eyebrowWidth="w-14" />
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/15">
              <div className="flex items-center justify-between px-4 py-4 sm:px-5">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-4 w-28" />
              </div>
              <div className="border-t border-white/10 px-4 py-4 sm:px-5">
                <SkeletonBlock className="h-4 w-36" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}