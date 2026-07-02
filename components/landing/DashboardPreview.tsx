import Reveal from "./animations/Reveal";

const linkRows = [
  "Launch notes",
  "YouTube channel",
  "Template pack",
  "Design newsletter",
];

export default function DashboardPreview() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-24 text-white md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.04]">
            Manage everything from one dashboard.{" "}
            <span className="text-white/40">
              Add links, update your profile, adjust the design, and preview
              your page without jumping between tools.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <div
            aria-hidden="true"
            className="mt-14 overflow-hidden rounded-[34px] border border-white/10 bg-[#02070d] shadow-[0_36px_120px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/3 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" />
                <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                <span className="h-3 w-3 rounded-full bg-[#00B8DB]" />
              </div>
              <div className="hidden rounded-full border border-white/10 bg-black/30 px-4 py-1 text-xs text-white/45 sm:block">
                dashboard.linkdeck.in
              </div>
            </div>

            <div className="grid min-h-155 grid-cols-1 lg:grid-cols-[190px_minmax(0,1fr)_320px]">
              <aside className="border-b border-white/10 bg-white/2.5 p-5 lg:border-b-0 lg:border-r">
                <div className="mb-8 h-8 w-28 rounded-full bg-white/10" />
                {["Links", "Design", "Insights", "Account"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className={[
                        "mb-2 rounded-2xl px-4 py-3 text-sm",
                        index === 0
                          ? "bg-[#00B8DB]/12 text-[#8feeff]"
                          : "text-white/45",
                      ].join(" ")}
                    >
                      {item}
                    </div>
                  )
                )}
              </aside>

              <div className="space-y-5 p-5 md:p-7">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Profile views", "9.4k"],
                    ["Total clicks", "2.8k"],
                    ["CTR", "29%"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                        {label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                    <p className="text-sm font-semibold text-white">
                      Profile editor
                    </p>
                    <div className="mt-5 flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#00B8DB_38%,#102231_70%)]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded-full bg-white/18" />
                        <div className="h-3 w-48 rounded-full bg-white/10" />
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="h-11 rounded-2xl border border-white/10 bg-black/24" />
                      <div className="h-20 rounded-2xl border border-white/10 bg-black/24" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Links</p>
                      <span className="rounded-full bg-[#00B8DB] px-3 py-1 text-xs font-semibold text-black">
                        Add link
                      </span>
                    </div>
                    <div className="mt-5 space-y-3">
                      {linkRows.map((row, index) => (
                        <div
                          key={row}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/24 p-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-white/86">
                              {row}
                            </p>
                            <p className="mt-1 text-xs text-white/35">
                              /{row.toLowerCase().replaceAll(" ", "-")}
                            </p>
                          </div>
                          <span className="text-xs text-white/38">
                            {index === 0 ? "Live" : "Visible"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/2.5 p-5 lg:border-l lg:border-t-0">
                <p className="text-sm font-semibold text-white">Live preview</p>
                <div className="mt-5 rounded-[30px] border border-white/10 bg-black p-4">
                  <div className="rounded-[24px] bg-[linear-gradient(180deg,#05131b,#02070d)] p-5 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-[#00B8DB]/80" />
                    <p className="mt-4 text-lg font-semibold">Mira Studio</p>
                    <p className="mt-1 text-xs text-white/40">
                      Everything important, one page.
                    </p>
                    <div className="mt-5 space-y-2">
                      {["Latest video", "Template pack", "Newsletter"].map(
                        (item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/80"
                          >
                            {item}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
