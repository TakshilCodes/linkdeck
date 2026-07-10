'use client';

import AccountSection from "./sections/AccountSection";
import PublicProfileSection from "./sections/PublicProfileSection";
import SecuritySection from "./sections/SecuritySection";
import AccountInfoSection from "./sections/AccountInfoSection";
import DangerZoneSection from "./sections/DangerZoneSection";

export type AccountUserProps = {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  profileImgUrl: string | null;
  authProvider: string;
  createdAt: Date;
  hasPassword: boolean;
};

export default function AccountSettingsContainer({ user }: { user: AccountUserProps }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:px-8 md:py-10 xl:px-10">
      <div className="mb-6 hidden md:block lg:mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300/80">
          Settings
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Account Settings</h1>
        <p className="mt-2 text-sm text-white/50">
          Manage your personal information and security preferences.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] px-4 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:px-6 lg:px-8">
        <AccountSection
          username={user.username}
          email={user.email}
          displayName={user.displayName}
          bio={user.bio}
          profileImgUrl={user.profileImgUrl}
        />
        <div className="h-px bg-white/10" />
        <PublicProfileSection username={user.username} />
        <div className="h-px bg-white/10" />
        <SecuritySection hasPassword={user.hasPassword} authProvider={user.authProvider} />
        <div className="h-px bg-white/10" />
        <AccountInfoSection createdAt={user.createdAt} authProvider={user.authProvider} />
        <div className="h-px bg-white/10" />
        <DangerZoneSection username={user.username} />
      </div>
    </div>
  );
}