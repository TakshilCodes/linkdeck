function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />;
}

function ThemeCardSkeleton() {
  return (
    <div className="group text-left">
      <div className="overflow-hidden rounded-[26px] border border-white/10">
        <div className="aspect-9/16 w-full animate-pulse rounded-[26px] bg-white/8" />
      </div>
      <SkeletonBlock className="mx-auto mt-3 h-4 w-20 rounded-md" />
    </div>
  );
}

export default function DashboardDesignLoading() {
  return (
    <div className="flex h-full flex-col" aria-busy="true">
      <div className="-mx-4 mb-6 flex items-center justify-between border-b border-[#202833] bg-[#07101C] px-5 py-4 sm:-mx-6 lg:-mx-8">
        <SkeletonBlock className="h-8 w-28 rounded-md" />
        <SkeletonBlock className="h-9 w-20" />
      </div>

      <div className="flex flex-1 flex-col gap-8 md:flex-row">
        <div className="flex w-full shrink-0 flex-row gap-1 overflow-x-auto border-b border-white/10 pb-4 pr-0 md:w-32 md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-4 lg:w-40">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2 rounded-xl p-3 md:flex-row md:gap-3">
              <SkeletonBlock className="h-5 w-5 shrink-0" />
              <SkeletonBlock className="h-4 w-14 rounded-md" />
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 pb-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <ThemeCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}