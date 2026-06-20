function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return <div className={`animate-pulse rounded-2xl bg-white/8 ${className}`} />;
}

export default function InsightsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <SkeletonBlock className="h-8 w-40 rounded-lg" />
        <SkeletonBlock className="mt-2 h-4 w-80 max-w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <SkeletonBlock className="h-12 w-12 rounded-xl" />
              <SkeletonBlock className="h-3 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="h-8 w-24 rounded-lg" />
            <SkeletonBlock className="mt-2 h-4 w-28 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <SkeletonBlock className="mb-6 h-6 w-40 rounded-lg" />
        <div className="flex h-64 items-end gap-3">
          {["h-24", "h-32", "h-20", "h-40", "h-28", "h-48", "h-36", "h-24", "h-44", "h-30"].map(
            (heightClass, index) => (
              <SkeletonBlock
                key={index}
                className={`flex-1 rounded-xl ${heightClass === "h-30" ? "h-32" : heightClass}`}
              />
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <SkeletonBlock className="mb-6 h-6 w-44 rounded-lg" />
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <SkeletonBlock className="h-6 w-6 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <SkeletonBlock className="h-4 w-36 max-w-full rounded-lg" />
                      <SkeletonBlock className="h-3 w-24 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <SkeletonBlock className="h-4 w-12 rounded-lg" />
                    <SkeletonBlock className="h-3 w-14 rounded-lg" />
                  </div>
                </div>
                <SkeletonBlock className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <SkeletonBlock className="mb-6 h-6 w-36 rounded-lg" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <SkeletonBlock className="h-8 w-8 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-52 max-w-full rounded-lg" />
                  <SkeletonBlock className="h-3 w-28 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
