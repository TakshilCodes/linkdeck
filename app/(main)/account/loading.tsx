function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return <div className={`animate-pulse rounded-2xl bg-white/8 ${className}`} />;
}

function AccountSectionSkeleton() {
  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2">
        <SkeletonBlock className="h-5 w-40 rounded-lg" />
        <SkeletonBlock className="h-4 w-64 max-w-full rounded-lg" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-[72px] w-[72px] rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-40 rounded-lg" />
            <SkeletonBlock className="h-4 w-56 max-w-full rounded-lg" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>

        <SkeletonBlock className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8">
        <SkeletonBlock className="h-8 w-52 rounded-lg" />
        <SkeletonBlock className="mt-2 h-4 w-80 max-w-full rounded-lg" />
      </div>

      <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] px-6 backdrop-blur-xl sm:px-10">
        <AccountSectionSkeleton />

        <div className="space-y-6 py-8">
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-36 rounded-lg" />
            <SkeletonBlock className="h-4 w-60 max-w-full rounded-lg" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-40 rounded-lg" />
              <SkeletonBlock className="h-3 w-52 max-w-full rounded-lg" />
            </div>
            <SkeletonBlock className="h-10 w-28 rounded-full" />
          </div>
        </div>

        <div className="space-y-6 py-8">
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-28 rounded-lg" />
            <SkeletonBlock className="h-4 w-56 max-w-full rounded-lg" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonBlock className="h-12 w-full rounded-xl" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-6 py-8">
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-32 rounded-lg" />
            <SkeletonBlock className="h-4 w-44 rounded-lg" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonBlock className="h-16 w-full rounded-2xl" />
            <SkeletonBlock className="h-16 w-full rounded-2xl" />
          </div>
        </div>

        <div className="space-y-6 py-8">
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-28 rounded-lg" />
            <SkeletonBlock className="h-4 w-48 rounded-lg" />
          </div>
          <SkeletonBlock className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
