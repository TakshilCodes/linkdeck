function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />;
}

function PhonePreviewSkeleton() {
  return (
    <div className="mx-auto mb-5 w-full max-w-[180px] rounded-[30px] border border-white/10 bg-black p-5 shadow-[0_18px_46px_rgba(0,0,0,0.34)] md:hidden">
      <SkeletonBlock className="mx-auto h-14 w-14" />
      <SkeletonBlock className="mx-auto mt-4 h-5 w-24 rounded-md" />
      <div className="mt-5 flex justify-center gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-6 w-6" />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-10 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="px-4 py-5 md:px-6 md:py-6" aria-busy="true">
      <PhonePreviewSkeleton />
      <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBlock className="h-7 w-32 rounded-md" />
            <SkeletonBlock className="h-4 w-56 max-w-full rounded-md" />
          </div>
          <SkeletonBlock className="h-10 w-24 shrink-0" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-[24px] border border-white/8 bg-[#0f1726] p-4">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-10 w-10" />
                <div className="min-w-0 flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-28 rounded-md" />
                  <SkeletonBlock className="h-3 w-36 max-w-full rounded-md" />
                </div>
              </div>
              <SkeletonBlock className="mt-5 h-24 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
