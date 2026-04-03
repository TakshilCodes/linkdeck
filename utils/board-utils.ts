import type { BoardItem, PersistBoardPayload, TopLevelCard } from "@/types/board-types";

export function toTopLevelCards(items: BoardItem[] = []): TopLevelCard[] {
  return items
    .map((item) => {
      if (item.type === "LINK" && item.link) {
        return {
          id: item.link.id,
          sortableId: `link-${item.link.id}`,
          type: "LINK" as const,
          position: item.position,
          link: item.link,
        };
      }

      if (item.type === "COLLECTION" && item.collection) {
        return {
          id: item.collection.id,
          sortableId: `collection-${item.collection.id}`,
          type: "COLLECTION" as const,
          position: item.position,
          collection: {
            ...item.collection,
            links: [...item.collection.links].sort((a, b) => a.position - b.position),
          },
        };
      }

      return null;
    })
    .filter(Boolean) as TopLevelCard[];
}

export function getBoardSignature(items: BoardItem[] = []) {
  return JSON.stringify(
    items.map((item) => ({
      id: item.id,
      type: item.type,
      position: item.position,
      linkId: item.link?.id ?? null,
      collectionId: item.collection?.id ?? null,
      nestedLinks:
        item.collection?.links.map((link) => ({
          id: link.id,
          position: link.position,
        })) ?? [],
    }))
  );
}

export function isCollectionCard(card: TopLevelCard): card is Extract<TopLevelCard, { type: "COLLECTION" }> {
  return card.type === "COLLECTION";
}

export function isLinkCard(card: TopLevelCard): card is Extract<TopLevelCard, { type: "LINK" }> {
  return card.type === "LINK";
}

/** Top-level board cards only (`link-*`, `collection-{uuid}`). */
export function isTopLevelSortableId(id: string) {
  if (id.startsWith("collection-link-")) return false;
  if (id.startsWith("collection-body-drop-")) return false;
  if (id.startsWith("collection-zone-")) return false;
  if (id.startsWith("collection-gap-before-")) return false;
  return id.startsWith("link-") || id.startsWith("collection-");
}

/** Collection card row (`collection-{id}`) only — not nested links, body layer, or zone ids. */
export function isCollectionCardSortableId(id: string) {
  return (
    id.startsWith("collection-") &&
    !id.startsWith("collection-link-") &&
    !id.startsWith("collection-body-drop-") &&
    !id.startsWith("collection-zone-") &&
    !id.startsWith("collection-gap-before-")
  );
}

export function isCollectionLinkSortableId(id: string) {
  return id.startsWith("collection-link-");
}

export function extractLinkIdFromCollectionSortable(id: string) {
  return id.replace("collection-link-", "");
}

/** Full-area inner drop target behind nested link rows (fills gaps between cards). */
export const COLLECTION_BODY_DROP_PREFIX = "collection-body-drop-";

export function isCollectionBodyDropId(id: string) {
  return id.startsWith(COLLECTION_BODY_DROP_PREFIX);
}

export function extractCollectionIdFromBodyDropId(id: string) {
  return id.replace(COLLECTION_BODY_DROP_PREFIX, "");
}

export function buildPersistPayload(cards: TopLevelCard[]): PersistBoardPayload {
  return {
    topLevel: cards.map((card, index) => ({
      id: card.id,
      type: card.type,
      position: index,
    })),
    collectionLinks: cards
      .filter(isCollectionCard)
      .map((card) => ({
        collectionId: card.collection.id,
        links: card.collection.links.map((link, index) => ({
          id: link.id,
          position: index,
        })),
      })),
  };
}

export function cloneCards(cards: TopLevelCard[]): TopLevelCard[] {
  return cards.map((card) =>
    card.type === "LINK"
      ? {
          ...card,
          link: { ...card.link },
        }
      : {
          ...card,
          collection: {
            ...card.collection,
            links: card.collection.links.map((link) => ({ ...link })),
          },
        }
  );
}