function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/8 ${className}`} />;
}

export default function InsightsLoading() {
  return (
    <div className="space-y-4 px-4 py-5 md:space-y-8 md:px-0 md:py-0" aria-busy="true">
      <div className="hidden md:block">
        <SkeletonBlock className="h-8 w-40 rounded-lg" />
        <SkeletonBlock className="mt-2 h-4 w-80 max-w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[22px] border border-white/10 bg-[#101a27] p-3.5 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <SkeletonBlock className="h-11 w-11 rounded-2xl" />
              <SkeletonBlock className="h-3 w-10 rounded-md" />
            </div>
            <SkeletonBlock className="h-7 w-20 rounded-lg" />
            <SkeletonBlock className="mt-2 h-4 w-24 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-white/10 bg-[#101a27] p-4 sm:p-6">
        <SkeletonBlock className="mb-4 h-6 w-40 rounded-lg" />
        <div className="flex h-[210px] items-end gap-2 sm:h-64">
          {["h-16", "h-24", "h-20", "h-32", "h-24", "h-44", "h-36"].map((heightClass, index) => (
            <SkeletonBlock key={index} className={`flex-1 rounded-xl ${heightClass}`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] 2xl:gap-6">
        {Array.from({ length: 2 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="rounded-[24px] border border-white/10 bg-[#101a27] p-4 sm:p-6">
            <SkeletonBlock className="mb-4 h-6 w-44 rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((__, index) => (
                <div key={index} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                  <div className="flex items-start gap-3">
                    <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <SkeletonBlock className="h-4 w-36 max-w-full rounded-lg" />
                      <SkeletonBlock className="h-3 w-24 rounded-lg" />
                      <SkeletonBlock className="h-2 w-full rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
