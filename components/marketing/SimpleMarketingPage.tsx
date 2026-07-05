import Link from "next/link";

type MarketingItem = {
  title: string;
  description: string;
};

type SimpleMarketingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: MarketingItem[];
  primaryHref?: string;
  primaryLabel?: string;
};

export default function SimpleMarketingPage({
  eyebrow,
  title,
  description,
  items,
  primaryHref = "/signup",
  primaryLabel = "Start free",
}: SimpleMarketingPageProps) {
  return (
    <main className="min-h-screen bg-black px-6 py-32 text-white md:px-10">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#00B8DB]">
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
          {description}
        </p>
        <div className="mt-10">
          <Link
            href={primaryHref}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#00B8DB] px-6 text-sm font-semibold text-black shadow-[0_0_40px_rgba(0,184,219,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_0_46px_rgba(0,184,219,0.28)]"
          >
            {primaryLabel}
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.05]"
          >
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/55">{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
