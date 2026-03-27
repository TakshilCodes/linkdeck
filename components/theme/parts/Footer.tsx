import { rgba } from "@/lib/themes/theme-utils";

type FooterProps = {
  username?: string | null;
  titleColor: string;
  showBranding?: boolean;
};

export default function Footer({
  username,
  titleColor,
  showBranding = true,
}: FooterProps) {
  if (!showBranding) return null;

  return (
    <div className="flex flex-col items-center">
      <a
        href="/"
        className="mb-8 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-black shadow-[0_10px_22px_rgba(0,0,0,0.20)] transition-all duration-200 ease-out hover:shadow-[0_16px_30px_rgba(0,0,0,0.20)] active:scale-[0.96] active:translate-y-px"
      >
        Join {username ?? "user"} on LinkDeck
      </a>
    </div>
  );
}