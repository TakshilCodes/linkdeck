import type { IconType } from "@/app/generated/prisma/enums";
import { resolveSocialUrl } from "@/lib/social-icons";
import type { BoardItem } from "@/types/board-types";

export type ThemePreviewLink = { id: string; name: string; url: string };

export type ThemePreviewCollection = {
  id: string;
  name: string;
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

  for (const item of sorted) {
    if (item.type === "LINK" && item.link?.isVisible) {
      standaloneLinks.push({
        id: item.link.id,
        name: item.link.name,
        url: item.link.url,
      });
    }
    if (item.type === "COLLECTION" && item.collection?.isVisible) {
      const links = item.collection.links
        .filter((l) => l.isVisible)
        .sort((a, b) => a.position - b.position)
        .map((l) => ({ id: l.id, name: l.name, url: l.url }));
      collections.push({
        id: item.collection.id,
        name: item.collection.name,
        links,
      });
    }
  }

  return { standaloneLinks, collections };
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
