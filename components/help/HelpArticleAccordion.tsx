"use client";

import { useEffect, useState } from "react";
import { ChevronDown, FileSearch } from "lucide-react";
import type { HelpArticle, HelpCategoryFilter } from "@/lib/help/help-data";

type Props = {
  articles: HelpArticle[];
  selectedCategory: HelpCategoryFilter;
};

export default function HelpArticleAccordion({ articles, selectedCategory }: Props) {
  const [openArticleId, setOpenArticleId] = useState<string | null>(articles[0]?.id ?? null);

  useEffect(() => {
    if (!articles.length) {
      setOpenArticleId(null);
      return;
    }

    setOpenArticleId((current) =>
      current && articles.some((article) => article.id === current) ? current : articles[0].id
    );
  }, [articles]);

  if (!articles.length) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/12 bg-white/2 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/3 text-white/55">
          <FileSearch className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-white">No help articles found</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
          Try searching for links, analytics, password, or username.
        </p>
      </div>
    );
  }

  return (
    <section id="help-articles" className="scroll-mt-24">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Help articles</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Clear answers to the questions creators ask most when managing their LinkDeck.
          </p>
        </div>
        <div className="text-sm text-white/45 sm:text-right">
          <div>Showing {articles.length} article{articles.length === 1 ? "" : "s"}</div>
          {selectedCategory !== "All" ? (
            <div className="mt-1 text-white/60">Filtered by {selectedCategory}</div>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
        {articles.map((article, index) => {
          const isOpen = openArticleId === article.id;

          return (
            <div key={article.id} className={index === 0 ? "" : "border-t border-white/10"}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenArticleId((current) => (current === article.id ? null : article.id))}
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition hover:bg-white/3 sm:px-6"
              >
                <div className="min-w-0">
                  <div className="text-base font-medium text-white sm:text-lg">{article.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/50">{article.description}</p>
                </div>
                <ChevronDown
                  className={`mt-1 h-5 w-5 shrink-0 text-white/45 transition-transform duration-200 ${isOpen ? "rotate-180 text-cyan-300" : ""}`}
                />
              </button>

              <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 text-sm leading-7 text-white/60 sm:px-6 sm:text-[15px]">
                    {article.content.split("\n\n").map((paragraph) => (
                      <p key={paragraph} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
