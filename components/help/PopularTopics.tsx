import { ArrowUpRight, Grid2x2 } from "lucide-react";
import type { HelpCategoryFilter, HelpTopic } from "@/lib/help/help-data";

type Props = {
  topics: HelpTopic[];
  selectedCategory: HelpCategoryFilter;
  onSelectCategory: (category: HelpCategoryFilter) => void;
};

export default function PopularTopics({ topics, selectedCategory, onSelectCategory }: Props) {
  const handleSelect = (category: HelpCategoryFilter) => {
    onSelectCategory(category);

    requestAnimationFrame(() => {
      const articlesSection = document.getElementById("help-articles");
      if (!articlesSection) return;

      const y = articlesSection.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(y, 0), behavior: "smooth" });
    });
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Popular topics</h2>
        <p className="mt-2 text-sm leading-6 text-white/55">
          Start with the areas people visit most often when setting up and growing their LinkDeck.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={() => handleSelect("All")}
          className={`group flex h-full flex-col rounded-2xl border p-6 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-200 ${
            selectedCategory === "All"
              ? "border-cyan-400/40 bg-cyan-400/8"
              : "border-white/10 bg-white/4 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/6"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0c1724] text-cyan-300">
              <Grid2x2 className="h-5 w-5" />
            </div>
            <ArrowUpRight className={`h-4 w-4 transition ${selectedCategory === "All" ? "text-cyan-300" : "text-white/25 group-hover:text-cyan-300"}`} />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-white">All</h3>
          <p className="mt-2 text-sm leading-6 text-white/55">Browse every help article across LinkDeck.</p>
        </button>

        {topics.map((topic) => {
          const Icon = topic.icon;
          const isActive = selectedCategory === topic.title;

          return (
            <button
              key={topic.title}
              type="button"
              onClick={() => handleSelect(topic.title)}
              className={`group flex h-full flex-col rounded-2xl border p-6 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-200 ${
                isActive
                  ? "border-cyan-400/40 bg-cyan-400/8"
                  : "border-white/10 bg-white/4 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/6"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0c1724] text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className={`h-4 w-4 transition ${isActive ? "text-cyan-300" : "text-white/25 group-hover:text-cyan-300"}`} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{topic.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{topic.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
