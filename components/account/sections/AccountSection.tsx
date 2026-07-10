'use client';

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, PencilLine, Save, User } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/dashboard/profile";

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-black/20 px-3.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/15";

export default function AccountSection({
  username,
  email,
  displayName,
  bio,
  profileImgUrl,
}: {
  username: string | null;
  email: string;
  displayName: string | null;
  bio: string | null;
  profileImgUrl: string | null;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(displayName ?? "");
  const [bioValue, setBioValue] = useState(bio ?? "");
  const [isPending, startTransition] = useTransition();
  const shownName = displayName?.trim() || (username ? `@${username}` : "Your LinkDeck profile");

  const cancelEditing = () => {
    setNameValue(displayName ?? "");
    setBioValue(bio ?? "");
    setIsEditing(false);
  };

  const saveProfile = () => {
    startTransition(async () => {
      const result = await updateProfileAction({
        displayName: nameValue,
        bio: bioValue,
      });

      if (!result.success) {
        toast.error(result.message ?? "Could not update your profile.");
        return;
      }

      toast.success("Profile details saved.");
      setIsEditing(false);
      router.refresh();
    });
  };

  return (
    <section className="py-6 sm:py-7" aria-labelledby="account-details-heading">
      <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-10">
        <div>
          <div className="mb-2 flex items-center gap-2 text-cyan-300">
            <User className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">Profile</span>
          </div>
          <h2 id="account-details-heading" className="text-lg font-semibold text-white">Account details</h2>
          <p className="mt-1.5 max-w-xs text-sm leading-6 text-white/50">
            The details shown on your LinkDeck profile.
          </p>
        </div>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
                {profileImgUrl ? (
                  <Image src={profileImgUrl} alt={shownName} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/65">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-white">{shownName}</p>
                <p className="truncate text-sm text-white/50">{email}</p>
                {username && <p className="mt-0.5 text-xs text-cyan-300/80">@{username}</p>}
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3.5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
              >
                <PencilLine className="h-4 w-4" />
                Edit profile
              </button>
            )}
          </div>

          <div className="mt-5 border-t border-white/10 pt-5">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="account-display-name" className="mb-1.5 block text-xs font-medium text-white/65">Display name</label>
                  <input
                    id="account-display-name"
                    value={nameValue}
                    onChange={(event) => setNameValue(event.target.value)}
                    maxLength={30}
                    placeholder={username ?? "Your name"}
                    className={`${inputClassName} h-11`}
                  />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <label htmlFor="account-bio" className="text-xs font-medium text-white/65">Bio</label>
                    <span className="text-xs text-white/35">{bioValue.length}/160</span>
                  </div>
                  <textarea
                    id="account-bio"
                    value={bioValue}
                    onChange={(event) => setBioValue(event.target.value)}
                    maxLength={160}
                    rows={3}
                    placeholder="Tell visitors a little about yourself."
                    className={`${inputClassName} min-h-24 resize-y py-3`}
                  />
                </div>
                <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                  <button type="button" onClick={cancelEditing} disabled={isPending} className="h-10 rounded-lg px-3.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-60">
                    Cancel
                  </button>
                  <button type="button" onClick={saveProfile} disabled={isPending} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 text-sm font-semibold text-[#041019] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isPending ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div>
                  <p className="text-xs font-medium text-white/50">Bio</p>
                  <p className={`mt-1.5 text-sm leading-6 ${bio ? "text-white/80" : "italic text-white/40"}`}>
                    {bio || "No bio yet. Add a short introduction for visitors."}
                  </p>
                </div>
                <p className="inline-flex items-center gap-1.5 text-xs text-white/40">
                  <Check className="h-3.5 w-3.5 text-cyan-300" /> Username is permanent
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}