export const PLATFORM_OPTIONS = [
  { type: "INSTAGRAM", label: "Instagram", icon: "/social/instagram.png" },
  { type: "X", label: "X", icon: "/social/x.png" },
  { type: "LINKEDIN", label: "LinkedIn", icon: "/social/linkedin.png" },
  { type: "YOUTUBE", label: "YouTube", icon: "/social/youtube.png" },
  { type: "GITHUB", label: "GitHub", icon: "/social/github.png" },
  { type: "DISCORD", label: "Discord", icon: "/social/discord.png" },
  { type: "TELEGRAM", label: "Telegram", icon: "/social/telegram.png" },
  { type: "THREADS", label: "Threads", icon: "/social/threads.png" },
  { type: "TWITCH", label: "Twitch", icon: "/social/twitch.png" },
  { type: "SNAPCHAT", label: "Snapchat", icon: "/social/snapchat.png" },
  { type: "FACEBOOK", label: "Facebook", icon: "/social/facebook.png" },
  { type: "PINTEREST", label: "Pinterest", icon: "/social/pinterest.png" },
  { type: "PATREON", label: "Patreon", icon: "/social/patreon.png" },
  { type: "KICK", label: "Kick", icon: "/social/kick.png" },
  { type: "PERSONAL_WEBSITE", label: "Website", icon: "/social/website.png" },
] as const;

export type PlatformType = (typeof PLATFORM_OPTIONS)[number]["type"];