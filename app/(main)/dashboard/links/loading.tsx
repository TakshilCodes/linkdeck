function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.1] ${className}`} />;
}

function LinkCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#111827] px-4 py-3.5 shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <SkeletonBlock className="mt-1 h-5 w-5 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2.5">
            <SkeletonBlock className="h-5 w-3/5" />
            <SkeletonBlock className="h-4 w-4/5" />
          </div>
        </div>
        <SkeletonBlock className="h-7 w-12 shrink-0 rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2.5">
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="h-8 w-8" />
      </div>
    </div>
  );
}

function CollectionSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#151d2e] p-3 shadow-[0_10px_28px_rgba(0,0,0,0.16)]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonBlock className="h-5 w-5 shrink-0 rounded-full" />
          <SkeletonBlock className="h-9 w-9 shrink-0" />
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-4 w-14" />
          </div>
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="h-10 w-10" />
          <SkeletonBlock className="h-10 w-10" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl border border-white/8 bg-[#0f1726] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 gap-3">
              <SkeletonBlock className="mt-1 h-5 w-5 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-2/3" />
                <SkeletonBlock className="h-3 w-3/4" />
              </div>
            </div>
            <SkeletonBlock className="h-7 w-12 shrink-0 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLinksLoading() {
  return (
    <div aria-busy="true">
      <div className="-mx-4 mb-6 hidden border-b border-[#202833] bg-[#07101C] px-5 py-4 sm:-mx-6 md:block lg:-mx-8">
        <SkeletonBlock className="h-8 w-24 rounded-md" />
      </div>

      <div className="rounded-none border-0 bg-transparent px-3 py-0 sm:px-4 md:rounded-[28px] md:border md:border-white/10 md:bg-white/5 md:px-5 md:py-6 md:shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)] md:backdrop-blur-xl">
        <div className="mx-auto w-full max-w-4xl py-5 sm:py-6">
          <div className="rounded-2xl border border-white/10 bg-[#0d1725]/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.16)] sm:p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3.5">
                <SkeletonBlock className="h-14 w-14 shrink-0 rounded-full" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-5 w-32" />
                  <SkeletonBlock className="h-4 w-44" />
                  <div className="flex gap-1.5 pt-1">
                    {Array.from({ length: 4 }).map((_, index) => <SkeletonBlock key={index} className="h-7 w-7" />)}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="h-10 w-24" />
                <SkeletonBlock className="h-10 w-32" />
                <SkeletonBlock className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <div className="space-y-4 rounded-[30px] p-2">
            <LinkCardSkeleton />
            <CollectionSkeleton />
            <LinkCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}