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
  bio: string | null;
  profileImgUrl: string | null;
  authProvider: string;
  createdAt: Date;
  hasPassword: boolean;
};

export default function AccountSettingsContainer({ user }: { user: AccountUserProps }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-5 md:px-8 md:py-12">
      <div className="mb-6 hidden md:block">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage your personal information and security preferences.
        </p>
      </div>

      <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] px-4 backdrop-blur-xl sm:px-10">
        <AccountSection
          username={user.username}
          email={user.email}
          bio={user.bio}
          profileImgUrl={user.profileImgUrl}
        />
        
        <PublicProfileSection username={user.username} />
        
        <SecuritySection
          hasPassword={user.hasPassword}
          authProvider={user.authProvider}
        />
        
        <AccountInfoSection
          createdAt={user.createdAt}
          authProvider={user.authProvider}
        />
        
        <DangerZoneSection />
      </div>
    </div>
  );
}
