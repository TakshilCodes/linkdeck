import GlassCard from "@/components/ui/GlassCard";

export default function DashboardDesignPage() {
  return (
    <>
      <div className="-mx-4 mb-6 border-b border-[#202833] bg-[#07101C] px-5 py-4 sm:-mx-6 lg:-mx-8">
        <p className="text-2xl font-semibold text-white">Design</p>
      </div>

      <GlassCard className="rounded-[28px] px-4 py-5 sm:px-5 sm:py-6">
        <p className="text-sm text-white/55">
          Theme and layout tools can go here. The phone preview stays visible on the right from the
          dashboard layout.
        </p>
      </GlassCard>
    </>
  );
}
