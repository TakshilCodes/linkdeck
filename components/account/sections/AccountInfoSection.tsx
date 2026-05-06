export default function AccountInfoSection({
  createdAt,
  authProvider,
}: {
  createdAt: Date;
  authProvider: string;
}) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(createdAt));

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "GOOGLE":
        return "Google";
      case "GITHUB":
        return "GitHub";
      case "EMAIL":
      case "CREDENTIALS":
        return "Email & Password";
      default:
        return provider;
    }
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between py-6">
      <div className="md:w-1/3">
        <h2 className="text-lg font-semibold text-white">Account Info</h2>
        <p className="mt-1 text-sm text-white/50">
          Technical details about your account.
        </p>
      </div>

      <div className="md:w-2/3">
        <div className="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/10">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium text-white/70">Created At</span>
            <span className="text-sm text-white/90">{formattedDate}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium text-white/70">Sign In Method</span>
            <span className="text-sm text-white/90">{getProviderName(authProvider)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
