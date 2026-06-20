"use client";

import { useMemo, useState } from "react";
import ContactSupport from "./ContactSupport";
import HelpArticleAccordion from "./HelpArticleAccordion";
import HelpHero from "./HelpHero";
import PopularTopics from "./PopularTopics";
import QuickLinks from "./QuickLinks";
import {
  helpArticles,
  helpTopics,
  quickLinks,
  type HelpCategoryFilter,
} from "@/lib/help/help-data";

export default function HelpCenterClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<HelpCategoryFilter>("All");

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return helpArticles.filter((article) => {
      const categoryMatch = selectedCategory === "All" || article.category === selectedCategory;
      if (!categoryMatch) return false;

      if (!query) return true;

      const searchFields = [
        article.title,
        article.description,
        article.content,
        article.keywords.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchFields.includes(query);
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8">
      <HelpHero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm("")}
      />
      {searchTerm.trim() === "" ? (
        <PopularTopics
          topics={helpTopics}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      ) : null}
      <HelpArticleAccordion articles={filteredArticles} selectedCategory={selectedCategory} />
      <QuickLinks items={quickLinks} />
      <ContactSupport />
    </div>
  );
}
