import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LineWaves from "@/components/landing/LineWaves";
import SplitText from "./animations/SplitText";
import ShinyText from "./animations/ShinyText";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#050b14] px-4 pb-20 pt-36 text-white sm:px-6 sm:pt-40 lg:px-8">
      <div className="absolute inset-0">
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={1}
          brightness={0.2}
          color1="#53eafd"
          color2="#53eafd"
          color3="#53eafd"
          enableMouseInteraction
          mouseInfluence={2}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,184,219,0.18),transparent_34%),linear-gradient(180deg,rgba(5,11,20,0.35)_0%,rgba(5,11,20,0.84)_72%,#050b14_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-[#050b14]" />

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1 pl-1 pr-3 text-sm font-semibold text-white/78 shadow-[0_12px_42px_rgba(83,234,253,0.16)] backdrop-blur-xl">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950 shadow-[0_4px_14px_rgba(255,255,255,0.22)]">
            NEW
          </span>
          <ShinyText
            text="Just shipped v1.0"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </div>

        <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
          <SplitText text="One clean page for every link you share." />
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
          LinkDeck gives creators a fast, polished home for links, collections,
          social profiles, themes, and insights.
        </p>

        <div className="pointer-events-auto mt-9 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00B8DB] px-7 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(0,184,219,0.28)] transition hover:bg-[#36d8f0] hover:shadow-[0_0_52px_rgba(0,184,219,0.36)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            Start free
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.07] px-7 py-4 text-base font-bold text-white transitio hover:border-[#00B8DB]/35 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            View features
          </Link>
        </div>
      </div>
    </section>
  );
}
