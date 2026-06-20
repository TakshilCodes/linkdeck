import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { QuickLinkItem } from "@/lib/help/help-data";

type Props = {
  items: QuickLinkItem[];
};

export default function QuickLinks({ items }: Props) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Quick links</h2>
        <p className="mt-2 text-sm leading-6 text-white/55">
          Jump straight to the pages and guides people use most often.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/3 p-5 transition duration-200 hover:border-cyan-400/30 hover:bg-white/5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1724] text-cyan-300">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                </div>
                <p className="mt-2 text-sm leading-6 text-white/55">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
