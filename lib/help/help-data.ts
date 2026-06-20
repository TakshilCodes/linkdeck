import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Brush,
  Compass,
  FolderKanban,
  LockKeyhole,
  Rocket,
  Settings,
} from "lucide-react";

export const helpCategories = [
  "Getting Started",
  "Links & Collections",
  "Themes & Customization",
  "Analytics",
  "Account & Security",
] as const;

export type HelpCategory = (typeof helpCategories)[number];
export type HelpCategoryFilter = HelpCategory | "All";

export type HelpArticle = {
  id: string;
  title: string;
  description: string;
  category: HelpCategory;
  content: string;
  keywords: string[];
};

export type HelpTopic = {
  title: HelpCategory;
  description: string;
  icon: LucideIcon;
};

export type QuickLinkItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const helpTopics: HelpTopic[] = [
  {
    title: "Getting Started",
    description: "Learn how to set up, publish, and share your LinkDeck.",
    icon: Rocket,
  },
  {
    title: "Links & Collections",
    description: "Add, organize, hide, and manage the links on your page.",
    icon: FolderKanban,
  },
  {
    title: "Themes & Customization",
    description: "Personalize your layout, colors, typography, and profile styling.",
    icon: Brush,
  },
  {
    title: "Analytics",
    description: "Understand views, clicks, CTR, and how your traffic is performing.",
    icon: BarChart3,
  },
  {
    title: "Account & Security",
    description: "Manage account settings, password access, and recovery flows.",
    icon: LockKeyhole,
  },
];

export const helpArticles: HelpArticle[] = [
  {
    id: "create-linkdeck",
    title: "How do I create my LinkDeck?",
    description: "Set up your account, verify your email, and complete onboarding.",
    category: "Getting Started",
    content:
      "Create an account with your email, enter your username, and verify the OTP sent to your inbox. After verification, complete onboarding by choosing a theme, selecting platforms, adding links, and filling in your profile details. Once that flow is complete, your LinkDeck is ready to publish and share.",
    keywords: ["signup", "onboarding", "otp", "username", "create account"],
  },
  {
    id: "add-link",
    title: "How do I add a link?",
    description: "Add a new website, social, or content link from your dashboard.",
    category: "Links & Collections",
    content:
      "Open the dashboard and go to the Links section. Use the Add button, paste a URL, and LinkDeck will create a new item for you. You can then rename it, adjust visibility, and place it exactly where you want on your public profile.",
    keywords: ["add link", "new link", "url", "dashboard links"],
  },
  {
    id: "edit-delete-link",
    title: "How do I edit or delete a link?",
    description: "Update link details or remove items you no longer want to show.",
    category: "Links & Collections",
    content:
      "In the Links dashboard, open the link card you want to change. You can edit the title or URL directly from the management controls. If you no longer need the item, use the delete option to remove it from your LinkDeck.",
    keywords: ["edit link", "delete link", "remove link", "manage link"],
  },
  {
    id: "collections-work",
    title: "How do collections work?",
    description: "Group related links together to keep your page organized.",
    category: "Links & Collections",
    content:
      "Collections let you bundle related links into one section, such as products, social channels, featured work, or resources. Visitors see a cleaner page, and you get more control over how content is grouped and discovered.",
    keywords: ["collections", "group links", "organize", "sections"],
  },
  {
    id: "reorder-links",
    title: "Can I reorder links?",
    description: "Control the order of links and collections on your profile.",
    category: "Links & Collections",
    content:
      "Yes. In your Links dashboard, drag and reorder both individual links and collections. The order you set there determines how items appear on your public LinkDeck page.",
    keywords: ["reorder", "drag", "sort", "link order"],
  },
  {
    id: "hide-link",
    title: "How do I hide a link?",
    description: "Temporarily hide links without deleting them permanently.",
    category: "Links & Collections",
    content:
      "Each link has a visibility control in the dashboard. Turn visibility off to hide it from your public page while keeping the item saved in your account. You can re-enable it any time.",
    keywords: ["hide link", "visibility", "unpublish link", "toggle"],
  },
  {
    id: "themes-work",
    title: "How do themes work?",
    description: "Apply a base theme and then customize it to match your brand.",
    category: "Themes & Customization",
    content:
      "Themes give you a starting visual style for your page. You can choose a preset theme and then customize colors, wallpaper, buttons, text styling, and header details from the Design area. Your selected theme controls the overall feel, while customization helps you make it your own.",
    keywords: ["themes", "design", "customization", "colors", "buttons"],
  },
  {
    id: "profile-views",
    title: "How do profile views work?",
    description: "Understand when a profile view is counted in Insights.",
    category: "Analytics",
    content:
      "A profile view is counted when someone opens your LinkDeck page. Views help you measure reach and traffic over time, and they are shown inside your Insights dashboard.",
    keywords: ["profile views", "analytics", "traffic", "insights"],
  },
  {
    id: "link-clicks",
    title: "How are link clicks tracked?",
    description: "See how LinkDeck measures engagement on your links.",
    category: "Analytics",
    content:
      "Link clicks are tracked when a visitor clicks one of the links on your public LinkDeck page. These events are recorded and shown in Insights so you can compare how different links perform.",
    keywords: ["clicks", "tracking", "engagement", "analytics"],
  },
  {
    id: "ctr",
    title: "What is CTR?",
    description: "Learn what click-through rate means in LinkDeck Insights.",
    category: "Analytics",
    content:
      "CTR means Click Through Rate. It is calculated as total clicks divided by total profile views, multiplied by 100. It helps you understand how effectively your LinkDeck turns visits into link engagement.",
    keywords: ["ctr", "click through rate", "formula", "analytics"],
  },
  {
    id: "insights-empty",
    title: "Why are my insights empty?",
    description: "Find out why analytics may not show any activity yet.",
    category: "Analytics",
    content:
      "Insights only appear after profile views or link clicks have happened on your public page. If your dashboard is empty, it usually means your LinkDeck has not received traffic yet or there have not been any recorded link interactions.",
    keywords: ["empty insights", "no analytics", "no views", "no clicks"],
  },
  {
    id: "change-username",
    title: "Can I change my username?",
    description: "Current username limitations and what to expect.",
    category: "Account & Security",
    content:
      "Usernames currently cannot be changed after account creation. If username editing becomes available in the future, it will be managed from account settings with clear migration guidance.",
    keywords: ["username", "change username", "account name"],
  },
  {
    id: "reset-password",
    title: "How do I reset my password?",
    description: "Use the OTP flow to securely regain access to your account.",
    category: "Account & Security",
    content:
      "Open Account Settings and start the password reset flow. LinkDeck uses an OTP-based verification step to confirm your identity before allowing you to create a new password. Once the OTP is verified, you can set a fresh password securely.",
    keywords: ["reset password", "otp", "account settings", "security"],
  },
  {
    id: "delete-account",
    title: "How do I delete my account?",
    description: "Remove your LinkDeck account from the danger zone section.",
    category: "Account & Security",
    content:
      "Go to Account Settings and open the Danger Zone section. From there, start the account deletion flow and confirm the action carefully. Before deleting your account, make sure you have saved anything important because the process is intended to be permanent.",
    keywords: ["delete account", "danger zone", "remove account"],
  },
];

export const quickLinks: QuickLinkItem[] = [
  {
    title: "Getting Started Guide",
    description: "Create your profile, publish your page, and share it confidently.",
    href: "/signup",
    icon: BookOpen,
  },
  {
    title: "Analytics Guide",
    description: "Learn how LinkDeck views, clicks, and CTR are calculated.",
    href: "/dashboard/insights",
    icon: BarChart3,
  },
  {
    title: "Account Settings",
    description: "Manage profile details, security access, and password recovery.",
    href: "/account",
    icon: Settings,
  },
  {
    title: "Explore Profiles",
    description: "See how public LinkDeck pages present content and social links.",
    href: "/",
    icon: Compass,
  },
];
