type AvatarProps = {
  profileImgUrl?: string | null;
  displayName: string;
  /** Dashboard phone preview — smaller, closer to real device proportions */
  compact?: boolean;
};

export default function Avatar({
  profileImgUrl,
  displayName,
  compact = false,
}: AvatarProps) {
  const shell =
    "flex items-center justify-center rounded-full bg-white/90 shadow-md " +
    (compact ? "mb-2.5 h-[72px] w-[72px]" : "mb-4 h-23 w-23");

  if (profileImgUrl) {
    return (
      <div className={shell}>
        <img
          src={profileImgUrl}
          alt={displayName}
          className="h-full w-full rounded-full object-cover"
        />
      </div>
    );
  }

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={shell}>
      <span
        className={`font-medium text-slate-800 ${compact ? "text-[15px]" : "text-[24px]"}`}
      >
        {initials}
      </span>
    </div>
  );
}