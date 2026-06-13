type FooterProps = {
  username?: string | null;
  titleColor?: string;
  showBranding?: boolean;
};

export default function Footer({
  username,
  titleColor,
  showBranding = true,
}: FooterProps) {
  if (!showBranding) return null;

  const label = username?.trim() ? `Join ${username} on LinkDeck` : "Join on LinkDeck";

  return (
    <div className="mt-12 flex justify-center pb-2">
      <div
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-center text-[15px] font-semibold shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
        style={{ color: titleColor ?? "#111111" }}
      >
        {label}
      </div>
    </div>
  );
}
