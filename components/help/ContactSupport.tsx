import Link from "next/link";
import { LifeBuoy } from "lucide-react";

export default function ContactSupport() {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#07111d]/75 px-6 py-14 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-10">
      <div className="mx-auto max-w-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/8 text-cyan-300">
          <LifeBuoy className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-white">Still need help?</h2>
        <p className="mt-3 text-sm leading-7 text-white/58 sm:text-base">
          If you couldn&apos;t find an answer, feel free to reach out.
        </p>
        <div className="mt-8">
          <Link
            href="mailto:takshilcodes@gmail.com"
            className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.2)] transition hover:bg-cyan-300"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
