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

import {
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Github,
  Globe,
  Twitch,
  Send,
  Mail,
} from "lucide-react";
import { FaDiscord, FaPinterest, FaSnapchatGhost } from "react-icons/fa";
import { FaXTwitter, FaPatreon } from "react-icons/fa6";
import { SiKick, SiThreads } from "react-icons/si";
import type { LucideProps } from "lucide-react";
import type { IconType as ReactIconType } from "react-icons";
import { IconType } from "@/app/generated/prisma/enums";

type IconComponent = React.ComponentType<LucideProps> | ReactIconType;

export type SocialInputMode = "username" | "url" | "email";

export type IconItem = {
  type: IconType;
  label: string;
  name: string;
  icon: IconComponent;
  inputMode: SocialInputMode;
  placeholder: string;
  example?: string;
  baseUrl?: string;
};

export const ICONS: IconItem[] = [
  {
    type: IconType.INSTAGRAM,
    label: "Instagram",
    name: "instagram",
    icon: Instagram,
    inputMode: "username",
    placeholder: "Enter Instagram username",
    example: "@instagramusername",
    baseUrl: "https://instagram.com/",
  },
  {
    type: IconType.X,
    label: "X",
    name: "x",
    icon: FaXTwitter,
    inputMode: "username",
    placeholder: "Enter X username",
    example: "@username",
    baseUrl: "https://x.com/",
  },
  {
    type: IconType.LINKEDIN,
    label: "LinkedIn",
    name: "linkedin",
    icon: Linkedin,
    inputMode: "username",
    placeholder: "Enter LinkedIn username",
    example: "takshilpandya",
    baseUrl: "https://linkedin.com/in/",
  },
  {
    type: IconType.FACEBOOK,
    label: "Facebook",
    name: "facebook",
    icon: Facebook,
    inputMode: "username",
    placeholder: "Enter Facebook username",
    example: "username",
    baseUrl: "https://facebook.com/",
  },
  {
    type: IconType.YOUTUBE,
    label: "YouTube",
    name: "youtube",
    icon: Youtube,
    inputMode: "username",
    placeholder: "Enter YouTube handle",
    example: "@channelname",
    baseUrl: "https://youtube.com/@",
  },
  {
    type: IconType.GITHUB,
    label: "GitHub",
    name: "github",
    icon: Github,
    inputMode: "username",
    placeholder: "Enter GitHub username",
    example: "takshilcodes",
    baseUrl: "https://github.com/",
  },
  {
    type: IconType.PERSONAL_WEBSITE,
    label: "Personal website",
    name: "website",
    icon: Globe,
    inputMode: "url",
    placeholder: "Enter full website URL",
    example: "https://yourwebsite.com",
  },
  {
    type: IconType.PATREON,
    label: "Patreon",
    name: "patreon",
    icon: FaPatreon,
    inputMode: "username",
    placeholder: "Enter Patreon username",
    example: "username",
    baseUrl: "https://patreon.com/",
  },
  {
    type: IconType.KICK,
    label: "Kick",
    name: "kick",
    icon: SiKick,
    inputMode: "username",
    placeholder: "Enter Kick username",
    example: "username",
    baseUrl: "https://kick.com/",
  },
  {
    type: IconType.DISCORD,
    label: "Discord",
    name: "discord",
    icon: FaDiscord,
    inputMode: "url",
    placeholder: "Enter Discord invite URL",
    example: "https://discord.gg/abc123",
  },
  {
    type: IconType.PINTEREST,
    label: "Pinterest",
    name: "pinterest",
    icon: FaPinterest,
    inputMode: "username",
    placeholder: "Enter Pinterest username",
    example: "username",
    baseUrl: "https://pinterest.com/",
  },
  {
    type: IconType.TWITCH,
    label: "Twitch",
    name: "twitch",
    icon: Twitch,
    inputMode: "username",
    placeholder: "Enter Twitch username",
    example: "username",
    baseUrl: "https://twitch.tv/",
  },
  {
    type: IconType.TELEGRAM,
    label: "Telegram",
    name: "telegram",
    icon: Send,
    inputMode: "username",
    placeholder: "Enter Telegram username",
    example: "@username",
    baseUrl: "https://t.me/",
  },
  {
    type: IconType.THREADS,
    label: "Threads",
    name: "threads",
    icon: SiThreads,
    inputMode: "username",
    placeholder: "Enter Threads username",
    example: "@username",
    baseUrl: "https://threads.net/@",
  },
  {
    type: IconType.SNAPCHAT,
    label: "Snapchat",
    name: "snapchat",
    icon: FaSnapchatGhost,
    inputMode: "username",
    placeholder: "Enter Snapchat username",
    example: "username",
    baseUrl: "https://snapchat.com/add/",
  },
];


export function getIconByType(type: IconType): IconItem | undefined {
  return ICONS.find((item) => item.type === type);
}

export function resolveSocialUrl(type: IconType, value: string) {
  const meta = getIconByType(type);
  if (!meta) return "#";

  if (meta.inputMode === "username") {
    const cleaned = value.replace(/^@/, "").trim();
    return `${meta.baseUrl}${cleaned}`;
  }

  if (meta.inputMode === "email") {
    return `mailto:${value.trim()}`;
  }

  return value.trim();
}

export function normalizeSocialValue(type: any, raw: string) {
  const meta = getIconByType(type);
  if (!meta) throw new Error("Invalid social platform");

  const value = raw.trim();

  if (!value) throw new Error("Value is required");

  if (meta.inputMode === "username") {
    return value.replace(/^@/, "").trim();
  }

  if (meta.inputMode === "email") {
    return value.toLowerCase().trim();
  }

  return value;
}