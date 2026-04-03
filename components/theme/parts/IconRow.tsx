import {
  Instagram,
  MessageCircle,
  Twitter,
  Linkedin,
  Youtube,
  Github,
  Facebook,
  Twitch,
  Send,
} from "lucide-react";

type RendererIcon = {
  id: string;
  type: string;
  url: string;
  label?: string | null;
};

function getIcon(type: string, compact: boolean) {
  const sz = compact ? "h-[18px] w-[18px]" : "h-7 w-7";
  switch (type) {
    case "INSTAGRAM":
      return <Instagram className={sz} />;
    case "X":
      return <Twitter className={sz} />;
    case "LINKEDIN":
      return <Linkedin className={sz} />;
    case "YOUTUBE":
      return <Youtube className={sz} />;
    case "GITHUB":
      return <Github className={sz} />;
    case "FACEBOOK":
      return <Facebook className={sz} />;
    case "TWITCH":
      return <Twitch className={sz} />;
    case "TELEGRAM":
      return <Send className={sz} />;
    default:
      return <MessageCircle className={sz} />;
  }
}

export default function IconRow({
  icons,
  color,
  compact = false,
}: {
  icons: RendererIcon[];
  color: string;
  compact?: boolean;
}) {
  if (icons.length === 0) return null;

  return (
    <div
      className={`flex items-center ${compact ? "mt-2 gap-3.5" : "mt-3 gap-5"}`}
      style={{ color }}
    >
      {icons.map((icon) => (
        <a
          key={icon.id}
          href={icon.url}
          target="_blank"
          rel="noreferrer"
          aria-label={icon.label || icon.type}
          className="rounded-full p-1 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 active:scale-95"
        >
          {getIcon(icon.type, compact)}
        </a>
      ))}
    </div>
  );
}