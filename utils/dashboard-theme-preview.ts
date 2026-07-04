import type { IconType } from "@/app/generated/prisma/enums";
import { resolveSocialUrl } from "@/lib/social-icons";
import type { BoardItem } from "@/types/board-types";

export type ThemePreviewLink = { id: string; name: string; url: string };

export type ThemePreviewCollection = {
  id: string;
  name: string;
  links: ThemePreviewLink[];
};

export type ThemePreviewSection =
  | {
      id: string;
      type: "LINKS";
      title: string | null;
      links: ThemePreviewLink[];
    }
  | {
      id: string;
      type: "COLLECTION";
      title: string;
      links: ThemePreviewLink[];
    };

export type ThemePreviewIcon = {
  id: string;
  type: string;
  url: string;
  label?: string | null;
};

/** Same ordering and visibility rules as the public profile page. */
export function buildBoardPreviewPayload(boardItems: BoardItem[]) {
  const sorted = [...boardItems].sort((a, b) => a.position - b.position);
  const standaloneLinks: ThemePreviewLink[] = [];
  const collections: ThemePreviewCollection[] = [];
  const sections: ThemePreviewSection[] = [];
  let pendingStandaloneLinks: ThemePreviewLink[] = [];
  let standaloneSectionIndex = 0;
  let renderedStandaloneTitle = false;

  const hasCollectionSection = sorted.some((item) => {
    if (item.type !== "COLLECTION" || !item.collection?.isVisible) {
      return false;
    }

    return item.collection.links.some((link) => link.isVisible);
  });

  const flushStandaloneLinks = () => {
    if (pendingStandaloneLinks.length === 0) return;

    sections.push({
      id: `standalone-links-${standaloneSectionIndex}`,
      type: "LINKS",
      title: hasCollectionSection && !renderedStandaloneTitle ? "Websites" : null,
      links: pendingStandaloneLinks,
    });

    pendingStandaloneLinks = [];
    standaloneSectionIndex += 1;
    renderedStandaloneTitle = true;
  };

  for (const item of sorted) {
    if (item.type === "LINK" && item.link?.isVisible) {
      const link = {
        id: item.link.id,
        name: item.link.name,
        url: item.link.url,
      };

      standaloneLinks.push(link);
      pendingStandaloneLinks.push(link);
    }

    if (item.type === "COLLECTION" && item.collection?.isVisible) {
      const links = item.collection.links
        .filter((link) => link.isVisible)
        .sort((a, b) => a.position - b.position)
        .map((link) => ({ id: link.id, name: link.name, url: link.url }));

      const collection = {
        id: item.collection.id,
        name: item.collection.name,
        links,
      };

      collections.push(collection);

      if (links.length > 0) {
        flushStandaloneLinks();
        sections.push({
          id: item.collection.id,
          type: "COLLECTION",
          title: item.collection.name,
          links,
        });
      }
    }
  }

  flushStandaloneLinks();

  return { standaloneLinks, collections, sections };
}

export function mapIconsForThemePreview(
  icons: {
    id: string;
    type: IconType;
    value: string;
    label?: string | null;
    isVisible: boolean;
    position: number;
  }[]
): ThemePreviewIcon[] {
  return [...icons]
    .filter((i) => i.isVisible)
    .sort((a, b) => a.position - b.position)
    .map((i) => ({
      id: i.id,
      type: i.type,
      url: resolveSocialUrl(i.type, i.value),
      label: i.label,
    }));
}
