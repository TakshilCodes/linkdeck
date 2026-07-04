"use client";

import { useState } from "react";
import WarningModal from "@/components/ui/WarningModal";

export default function DangerZoneSection() {
  const [warningOpen, setWarningOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6 py-6 md:flex-row md:items-start md:justify-between">
        <div className="md:w-1/3">
          <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
          <p className="mt-1 text-sm text-white/50">
            Irreversible actions related to your account.
          </p>
        </div>

        <div className="md:w-2/3">
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-medium text-white/90">Delete Account</h3>
              <p className="mt-1 text-sm text-white/50">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500/20"
              onClick={() => setWarningOpen(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <WarningModal
        open={warningOpen}
        title="Delete account is not available yet"
        description="Account deletion is not implemented in this build. No account data was changed."
        confirmLabel="Got it"
        hideCancel
        onClose={() => setWarningOpen(false)}
      />
    </>
  );
}
