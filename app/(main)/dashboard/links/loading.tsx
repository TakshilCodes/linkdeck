function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />;
}

function LinkCardSkeleton() {
  return (
    <div className="rounded-[26px] border border-white/8 bg-[#111827] px-4 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <SkeletonBlock className="mt-1 h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBlock className="h-5 w-3/5" />
            <SkeletonBlock className="h-4 w-4/5" />
          </div>
        </div>
        <SkeletonBlock className="h-7 w-12 shrink-0" />
      </div>
      <div className="mt-4 flex items-center gap-4 border-t border-white/8 pt-4">
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="h-4 w-20" />
      </div>
    </div>
  );
}

function CollectionSkeleton() {
  return (
    <div className="rounded-[28px] border border-white/8 bg-[#151d2e] p-3 shadow-[0_10px_28px_rgba(0,0,0,0.16)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonBlock className="h-5 w-5 shrink-0" />
          <SkeletonBlock className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-4 w-14" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-10 w-10" />
          <SkeletonBlock className="h-10 w-10" />
        </div>
      </div>
      <div className="space-y-3 rounded-[22px]">
        <div className="rounded-[22px] border border-white/8 bg-[#0f1726] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <SkeletonBlock className="h-5 w-5" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-2/3" />
                <SkeletonBlock className="h-3 w-3/4" />
              </div>
            </div>
            <SkeletonBlock className="h-7 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLinksLoading() {
  return (
    <div aria-busy="true">
      <div className="-mx-4 mb-6 border-b border-[#202833] bg-[#07101C] px-5 py-4 sm:-mx-6 lg:-mx-8">
        <SkeletonBlock className="h-8 w-24 rounded-md" />
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 px-4 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl sm:px-5 sm:py-6">
        <div className="mx-auto w-full max-w-140 py-10">
          <div className="flex items-center gap-4">
            <SkeletonBlock className="h-16 w-16 shrink-0" />
            <div className="min-w-0 flex-1 space-y-3">
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="h-4 w-52 max-w-full" />
              <div className="flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-8 w-8" />
                ))}
              </div>
            </div>
          </div>

          <SkeletonBlock className="mt-5 h-12 w-full" />
          <SkeletonBlock className="mt-5 h-10 w-36" />
        </div>

        <div className="mx-auto w-full max-w-160 rounded-[30px] p-2">
          <div className="flex flex-col gap-4">
            <LinkCardSkeleton />
            <CollectionSkeleton />
            <LinkCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}