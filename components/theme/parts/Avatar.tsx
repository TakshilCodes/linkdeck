type AvatarProps = {
  profileImgUrl?: string | null;
  displayName: string;
};

export default function Avatar({ profileImgUrl, displayName }: AvatarProps) {
  if (profileImgUrl) {
    return (
      <div className="mb-4 flex h-23 w-23 items-center justify-center rounded-full bg-white/90 shadow-md">
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
    <div className="mb-4 flex h-23 w-23 items-center justify-center rounded-full bg-white/90 shadow-md">
      <span className="text-[24px] font-medium text-slate-800">{initials}</span>
    </div>
  );
}