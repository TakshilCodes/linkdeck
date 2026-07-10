import { CalendarDays, KeyRound } from "lucide-react";

function getProviderName(provider: string) {
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
}

export default function AccountInfoSection({ createdAt, authProvider }: { createdAt: Date; authProvider: string }) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(createdAt));

  const details = [
    { label: "Member since", value: formattedDate, icon: CalendarDays },
    { label: "Sign-in method", value: getProviderName(authProvider), icon: KeyRound },
  ];

  return (
    <section className="py-6 sm:py-7" aria-labelledby="account-info-heading">
      <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-10">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">Account</p>
          <h2 id="account-info-heading" className="text-lg font-semibold text-white">Account info</h2>
          <p className="mt-1.5 max-w-xs text-sm leading-6 text-white/50">Useful details about how this account is set up.</p>
        </div>

        <dl className="overflow-hidden rounded-2xl border border-white/10 bg-black/15">
          {details.map(({ label, value, icon: Icon }, index) => (
            <div key={label} className={`flex items-center justify-between gap-4 px-4 py-4 sm:px-5 ${index > 0 ? "border-t border-white/10" : ""}`}>
              <dt className="flex items-center gap-2.5 text-sm text-white/55">
                <Icon className="h-4 w-4 text-cyan-300/75" aria-hidden="true" />
                {label}
              </dt>
              <dd className="text-right text-sm font-medium text-white/90">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}