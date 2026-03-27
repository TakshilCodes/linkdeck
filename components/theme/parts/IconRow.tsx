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

function getIcon(type: string) {
  switch (type) {
    case "INSTAGRAM":
      return <Instagram className="h-7 w-7" />;
    case "X":
      return <Twitter className="h-7 w-7" />;
    case "LINKEDIN":
      return <Linkedin className="h-7 w-7" />;
    case "YOUTUBE":
      return <Youtube className="h-7 w-7" />;
    case "GITHUB":
      return <Github className="h-7 w-7" />;
    case "FACEBOOK":
      return <Facebook className="h-7 w-7" />;
    case "TWITCH":
      return <Twitch className="h-7 w-7" />;
    case "TELEGRAM":
      return <Send className="h-7 w-7" />;
    default:
      return <MessageCircle className="h-7 w-7" />;
  }
}

export default function IconRow({
  icons,
  color,
}: {
  icons: RendererIcon[];
  color: string;
}) {
  if (icons.length === 0) return null;

  return (
    <div className="mt-3 flex items-center gap-5" style={{ color }}>
      {icons.map((icon) => (
        <a
          key={icon.id}
          href={icon.url}
          target="_blank"
          rel="noreferrer"
          aria-label={icon.label || icon.type}
          className="rounded-full p-1 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 active:scale-95"
        >
          {getIcon(icon.type)}
        </a>
      ))}
    </div>
  );
}