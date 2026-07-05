import Image from "next/image";
import { User } from "lucide-react";

export default function AccountSection({
  username,
  email,
  bio,
  profileImgUrl,
}: {
  username: string | null;
  email: string;
  bio: string | null;
  profileImgUrl: string | null;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between py-6">
      <div className="md:w-1/3">
        <h2 className="text-lg font-semibold text-white">Account Details</h2>
        <p className="mt-1 text-sm text-white/50">
          Your core profile information.
        </p>
      </div>

      <div className="md:w-2/3 flex flex-col gap-5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
            {profileImgUrl ? (
              <Image
                src={profileImgUrl}
                alt={username ?? "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/70">
                <User className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="truncate text-base font-medium text-white">
              {username ? `@${username}` : "No username set"}
            </span>
            <span className="truncate text-sm text-white/50">{email}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Bio
          </label>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 min-h-[80px]">
            {bio ? bio : <span className="italic opacity-50">No bio provided.</span>}
          </div>
        </div>

        <p className="text-xs text-white/40">
          Username cannot be changed.
        </p>
      </div>
    </div>
  );
}
