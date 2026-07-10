'use client';

import { useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import WarningModal from "@/components/ui/WarningModal";

export default function DangerZoneSection({ username }: { username: string | null }) {
  const [warningOpen, setWarningOpen] = useState(false);

  return (
    <>
      <section className="py-6 sm:py-7" aria-labelledby="danger-zone-heading">
        <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-10">
          <div>
            <div className="mb-2 flex items-center gap-2 text-red-300">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">Caution</span>
            </div>
            <h2 id="danger-zone-heading" className="text-lg font-semibold text-white">Danger zone</h2>
            <p className="mt-1.5 max-w-xs text-sm leading-6 text-white/50">Irreversible actions related to your account.</p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-red-400/20 bg-red-500/[0.045] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Delete account</h3>
              <p className="mt-1 text-sm leading-6 text-white/55">Permanently remove your profile and associated data.</p>
            </div>
            <button
              type="button"
              onClick={() => setWarningOpen(true)}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-400/20 bg-red-500/10 px-3.5 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
            >
              Delete account
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <WarningModal
        open={warningOpen}
        title="Account deletion is not available yet"
        description={`Account deletion for ${username ? `@${username}` : "this account"} is not available in this version. No account data has been changed.`}
        confirmLabel="Got it"
        hideCancel
        onClose={() => setWarningOpen(false)}
      />
    </>
  );
}