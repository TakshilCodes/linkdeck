import Reveal from "./animations/Reveal";

const features = [
  {
    title: "Build your creator profile",
    copy: "Add your avatar, name, bio, socials, and a clean public URL that is easy to share anywhere.",
  },
  {
    title: "Organize every important link",
    copy: "Group your content, projects, shops, videos, documents, and socials so visitors can find what matters faster.",
  },
  {
    title: "Customize the page, not the code",
    copy: "Change colors, button styles, fonts, and layout details from a simple dashboard.",
  },
  {
    title: "Preview changes before sharing",
    copy: "See your public page update while editing so your profile always feels ready.",
  },
  {
    title: "Understand what people click",
    copy: "Simple insights help you see which links are getting attention.",
  },
];

function PublicProfileMockup() {
  const links = [
    "Latest video",
    "Portfolio",
    "Creator kit",
    "Shop presets",
    "Newsletter",
  ];

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:max-w-none">
      <style>
        {
          "@keyframes landing-preview-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } @media (prefers-reduced-motion: reduce) { .landing-preview-float { animation: none !important; } }"
        }
      </style>
      <div className="pointer-events-none absolute -inset-8 rounded-[48px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,184,219,0.24),transparent_58%)] blur-2xl" />
      <div
        className="landing-preview-float relative rounded-[34px] border border-white/10 bg-[#02070d]/92 p-4 shadow-[0_32px_100px_rgba(0,0,0,0.58),0_0_60px_rgba(0,184,219,0.12)]"
        style={{ animation: "landing-preview-float 7s ease-in-out infinite" }}
      >
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs text-white/45">
            <span>linkdeck.in/mira</span>
            <span className="h-2 w-2 rounded-full bg-[#00B8DB] shadow-[0_0_20px_rgba(0,184,219,0.8)]" />
          </div>

          <div className="flex flex-col items-center pt-8 text-center">
            <div className="h-20 w-20 rounded-full border border-[#00B8DB]/35 bg-[radial-gradient(circle_at_32%_28%,#8ff1ff,#00B8DB_42%,#102231_72%)] shadow-[0_0_35px_rgba(0,184,219,0.28)]" />
            <p className="mt-4 text-xl font-semibold text-white">Mira Studio</p>
            <p className="mt-1 text-sm text-white/48">
              Design resources, videos, and tiny products.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["X", "YT", "IG", "GH"].map((social) => (
                <span
                  key={social}
                  className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs font-medium text-white/70"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7 space-y-3">
            {links.map((link, index) => (
              <div
                key={link}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/4.5 px-4 py-3 transition hover:border-[#00B8DB]/30 hover:bg-white/[0.07]"
              >
                <span className="text-sm font-medium text-white/86">{link}</span>
                <span className="text-xs text-white/35">
                  {index === 0 ? "hot" : "open"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-[#00B8DB]/20 bg-[#00B8DB]/6 p-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                Clicks
              </p>
              <p className="mt-1 text-sm font-semibold text-white">2.8k</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                Top
              </p>
              <p className="mt-1 text-sm font-semibold text-white">Video</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                Views
              </p>
              <p className="mt-1 text-sm font-semibold text-white">9.4k</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductFeatures() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#02070d] px-6 py-24 text-white md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(0,184,219,0.12),transparent_30%),linear-gradient(180deg,#02070d_0%,#000_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(380px,0.78fr)] lg:gap-20">
        <div>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#00B8DB]">
              Product
            </p>
            <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.04]">
              Everything you share, organized with intention.{" "}
              <span className="text-white/40">
                Build a profile that feels clear before anyone clicks.
              </span>
            </h2>
          </Reveal>

          <div className="mt-14 space-y-4">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 80}>
                <article className="group rounded-[28px] border border-white/10 bg-white/3 p-6 transition duration-300 hover:border-[#00B8DB]/30 hover:bg-white/5.5 hover:shadow-[0_0_44px_rgba(0,184,219,0.08)] md:p-8">
                  <div className="flex items-start gap-5">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#00B8DB]/30 bg-[#00B8DB]/10 text-sm font-semibold text-[#00B8DB]">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-base leading-7 text-white/58">
                        {feature.copy}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={160}>
            <PublicProfileMockup />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
