import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./animations/Reveal";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-black px-6 pb-12 pt-24 text-white md:px-10 md:pb-16 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,184,219,0.16),transparent_34%)]" />
      <Reveal>
        <div className="relative mx-auto max-w-5xl rounded-[36px] border border-white/10 bg-white/[0.035] px-6 py-14 text-center shadow-[0_32px_100px_rgba(0,0,0,0.5)] md:px-12 md:py-20">
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Your links deserve a better home.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/58 md:text-lg">
            Create a clean LinkDeck page, customize it, and share everything
            that matters from one place.
          </p>
          <Link
            href="/signup"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-[#00B8DB] px-7 py-4 text-base font-bold text-black shadow-[0_0_42px_rgba(0,184,219,0.28)] transition hover:-translate-y-0.5 hover:bg-[#36d8f0] hover:shadow-[0_0_54px_rgba(0,184,219,0.36)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            Create your LinkDeck
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
