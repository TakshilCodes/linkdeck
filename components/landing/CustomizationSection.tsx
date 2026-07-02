import Reveal from "./animations/Reveal";

const chips = ["Cyan", "Minimal", "Rounded", "Glass", "Creator", "Portfolio"];

export default function CustomizationSection() {
  return (
    <section className="relative overflow-hidden bg-[#02070d] px-6 py-24 text-white md:px-10 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(0,184,219,0.10),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <Reveal>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#00B8DB]">
              Customization
            </p>
            <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.04]">
              Make the page feel like yours.{" "}
              <span className="text-white/40">
                Change colors, buttons, layout details, and profile styling
                without touching a single line of code.
              </span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            aria-hidden="true"
            className="rounded-[34px] border border-white/10 bg-black/50 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
          >
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Theme controls
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Tune the public page instantly.
                  </p>
                </div>
                <span className="rounded-full bg-[#00B8DB]/12 px-3 py-1 text-xs font-semibold text-[#8feeff]">
                  Preview on
                </span>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-[1fr_0.9fr]">
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs text-white/45">
                      <span>Accent color</span>
                      <span>#00B8DB</span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        "#00B8DB",
                        "#ffffff",
                        "#7c3aed",
                        "#f97316",
                        "#22c55e",
                      ].map((color) => (
                        <span
                          key={color}
                          className="h-10 flex-1 rounded-2xl border border-white/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {["Button radius", "Card glass", "Font weight"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-black/28 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between text-sm text-white/70">
                          <span>{item}</span>
                          <span>
                            {index === 0
                              ? "Rounded"
                              : index === 1
                                ? "Soft"
                                : "Medium"}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-[#00B8DB]"
                            style={{ width: ["72%", "46%", "58%"][index] }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="rounded-[26px] border border-white/10 bg-[#061018] p-4">
                  <div className="rounded-[22px] bg-black/55 p-4 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-[#00B8DB]" />
                    <div className="mx-auto mt-4 h-3 w-24 rounded-full bg-white/70" />
                    <div className="mx-auto mt-2 h-2 w-32 rounded-full bg-white/18" />
                    <div className="mt-5 space-y-2">
                      {[0, 1, 2].map((item) => (
                        <div
                          key={item}
                          className="h-10 rounded-2xl border border-[#00B8DB]/20 bg-white/6"
                        />
                      ))}
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
