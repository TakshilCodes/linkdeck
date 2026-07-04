import {
  closestCorners,
  pointerWithin,
  type ClientRect,
  type Collision,
  type CollisionDetection,
  type Over,
} from "@dnd-kit/core";
import type { TopLevelCard } from "@/types/board-types";
import {
  extractLinkIdFromCollectionSortable,
  isCollectionLinkSortableId,
  isTopLevelSortableId,
} from "@/utils/board-utils";

export const BOARD_ROOT_ID = "board-root";
export const COLLECTION_ZONE_PREFIX = "collection-zone-";
export const COLLECTION_GAP_BEFORE_PREFIX = "collection-gap-before-";

export type CollectionDropMode = "before" | "inside";

export function parseCollectionZoneId(id: string): { collectionId: string; mode: CollectionDropMode } | null {
  if (id.startsWith(COLLECTION_GAP_BEFORE_PREFIX)) {
    return { collectionId: id.replace(COLLECTION_GAP_BEFORE_PREFIX, ""), mode: "before" };
  }

  if (id.startsWith(`${COLLECTION_ZONE_PREFIX}before-`)) {
    return { collectionId: id.replace(`${COLLECTION_ZONE_PREFIX}before-`, ""), mode: "before" };
  }

  if (id.startsWith(`${COLLECTION_ZONE_PREFIX}inside-`)) {
    return { collectionId: id.replace(`${COLLECTION_ZONE_PREFIX}inside-`, ""), mode: "inside" };
  }

  return null;
}

function boardCollisionDetection(args: Parameters<CollisionDetection>[0]) {
  const pointerHits = pointerWithin(args);

  if (pointerHits.length > 0) {
    const withoutBoard = pointerHits.filter((collision) => collision.id !== BOARD_ROOT_ID);
    if (withoutBoard.length > 0) {
      return withoutBoard;
    }

    const boardHit = pointerHits.find((collision) => collision.id === BOARD_ROOT_ID);
    if (boardHit) {
      return [boardHit];
    }
  }

  return closestCorners(args);
}

export const linkBoardCollisionDetection: CollisionDetection = (args) => {
  const activeId = String(args.active.id);
  const pointer = args.pointerCoordinates;

  if (!pointer) {
    return boardCollisionDetection(args);
  }

  const pointerHits = pointerWithin(args);
  if (pointerHits.length === 0) {
    return boardCollisionDetection(args);
  }

  if (activeId.startsWith("collection-link-")) {
    const linkHit = pointerHits.find((collision) => String(collision.id).startsWith("collection-link-"));
    if (linkHit) return [linkHit];

    const gapBefore = pointerHits.find((collision) => String(collision.id).startsWith(COLLECTION_GAP_BEFORE_PREFIX));
    if (gapBefore) return [gapBefore];

    const bodyHit = pointerHits.find((collision) => String(collision.id).startsWith("collection-body-drop-"));
    if (bodyHit) return [bodyHit];

    const zoneHit = pointerHits.find(
      (collision) => String(collision.id).startsWith(COLLECTION_ZONE_PREFIX) || String(collision.id) === BOARD_ROOT_ID
    );
    if (zoneHit) return [zoneHit];

    const topLevelHit = pointerHits.find((collision) => isTopLevelSortableId(String(collision.id)));
    if (topLevelHit) return [topLevelHit];

    return pointerHits;
  }

  if (activeId.startsWith("link-")) {
    const gapBefore = pointerHits.find((collision) => String(collision.id).startsWith(COLLECTION_GAP_BEFORE_PREFIX));
    if (gapBefore) return [gapBefore];

    const bodyHit = pointerHits.find((collision) => String(collision.id).startsWith("collection-body-drop-"));
    if (bodyHit) return [bodyHit];

    const innerLinkHit = pointerHits.find((collision) => String(collision.id).startsWith("collection-link-"));
    if (innerLinkHit) return [innerLinkHit];

    const zoneInside = pointerHits.find((collision) => String(collision.id).startsWith("collection-zone-inside-"));
    if (zoneInside) return [zoneInside];

    const zoneBefore = pointerHits.find((collision) => String(collision.id).startsWith("collection-zone-before-"));
    if (zoneBefore) return [zoneBefore];
  }

  return boardCollisionDetection(args);
};

export function insertSlotFromBodyRect(pointerY: number, bodyRect: ClientRect, linkCount: number): number {
  const relativeY = pointerY - bodyRect.top;
  const height = Math.max(bodyRect.height, 1);

  if (linkCount === 0) {
    return 0;
  }

  return Math.max(0, Math.min(linkCount, Math.floor((relativeY / height) * (linkCount + 1))));
}

function collisionRectFromCollision(collision: Collision): ClientRect | null {
  const data = collision.data as { droppableContainer?: { rect: { current: ClientRect | null } }; value?: number } | undefined;
  return data?.droppableContainer?.rect?.current ?? null;
}

export function getTopLevelInsertIndexFromPointer(
  cards: TopLevelCard[],
  pointerY: number,
  over: Over | null,
  collisions: Collision[] | null
): number {
  const totalCards = cards.length;
  const topLevelIds = new Set(cards.map((card) => card.sortableId));

  function nearestTopLevelFromCollisions(): { id: string; rect: ClientRect; value: number } | null {
    if (!collisions?.length) {
      return null;
    }

    let best: { id: string; rect: ClientRect; value: number } | null = null;

    for (const collision of collisions) {
      const id = String(collision.id);
      if (!topLevelIds.has(id)) continue;

      const rect = collisionRectFromCollision(collision);
      if (!rect) continue;

      const data = collision.data as { value?: number } | undefined;
      const value = data?.value ?? Infinity;

      if (!best || value < best.value) {
        best = { id, rect, value };
      }
    }

    return best;
  }

  function insertBeforeOrAfterRect(rect: ClientRect, cardIndex: number): number {
    const midpoint = rect.top + rect.height / 2;
    return pointerY >= midpoint ? cardIndex + 1 : cardIndex;
  }

  if (!over) {
    const nearest = nearestTopLevelFromCollisions();
    if (nearest) {
      const index = cards.findIndex((card) => card.sortableId === nearest.id);
      if (index !== -1) return insertBeforeOrAfterRect(nearest.rect, index);
    }

    return totalCards;
  }

  const overId = String(over.id);
  if (overId === BOARD_ROOT_ID) {
    const nearest = nearestTopLevelFromCollisions();
    if (nearest) {
      const index = cards.findIndex((card) => card.sortableId === nearest.id);
      if (index !== -1) return insertBeforeOrAfterRect(nearest.rect, index);
    }

    return totalCards;
  }

  if (isTopLevelSortableId(overId)) {
    const index = cards.findIndex((card) => card.sortableId === overId);
    if (index === -1) {
      const nearest = nearestTopLevelFromCollisions();
      if (nearest) {
        const nearestIndex = cards.findIndex((card) => card.sortableId === nearest.id);
        if (nearestIndex !== -1) return insertBeforeOrAfterRect(nearest.rect, nearestIndex);
      }

      return totalCards;
    }

    return insertBeforeOrAfterRect(over.rect, index);
  }

  const nearest = nearestTopLevelFromCollisions();
  if (nearest) {
    const index = cards.findIndex((card) => card.sortableId === nearest.id);
    if (index !== -1) return insertBeforeOrAfterRect(nearest.rect, index);
  }

  return totalCards;
}

export function getInnerCollectionInsertIndexFromPointer(
  collectionId: string,
  cards: TopLevelCard[],
  pointerY: number,
  over: Over | null,
  collisions: Collision[] | null
): number {
  const collectionCard = cards.find(
    (card) => card.type === "COLLECTION" && card.collection.id === collectionId
  );

  if (!collectionCard || collectionCard.type !== "COLLECTION") {
    return 0;
  }

  const innerSortableIds = new Set(
    collectionCard.collection.links.map((link) => `collection-link-${link.id}`)
  );

  function nearestInnerFromCollisions(): { linkId: string; rect: ClientRect; value: number } | null {
    if (!collisions?.length) {
      return null;
    }

    let best: { linkId: string; rect: ClientRect; value: number } | null = null;

    for (const collision of collisions) {
      const id = String(collision.id);
      if (!innerSortableIds.has(id)) continue;

      const rect = collisionRectFromCollision(collision);
      if (!rect) continue;

      const data = collision.data as { value?: number } | undefined;
      const value = data?.value ?? Infinity;
      const linkId = extractLinkIdFromCollectionSortable(id);

      if (!best || value < best.value) {
        best = { linkId, rect, value };
      }
    }

    return best;
  }

  function insertBeforeOrAfterRect(rect: ClientRect, linkIndex: number, length: number): number {
    const midpoint = rect.top + rect.height / 2;
    return pointerY >= midpoint ? Math.min(linkIndex + 1, length) : linkIndex;
  }

  const links = collectionCard.collection.links;
  const length = links.length;

  if (!over) {
    const nearest = nearestInnerFromCollisions();
    if (nearest) {
      const index = links.findIndex((link) => link.id === nearest.linkId);
      if (index !== -1) return insertBeforeOrAfterRect(nearest.rect, index, length);
    }

    return length;
  }

  const overId = String(over.id);
  if (isCollectionLinkSortableId(overId)) {
    if (!innerSortableIds.has(overId)) {
      const nearest = nearestInnerFromCollisions();
      if (nearest) {
        const nearestIndex = links.findIndex((link) => link.id === nearest.linkId);
        if (nearestIndex !== -1) return insertBeforeOrAfterRect(nearest.rect, nearestIndex, length);
      }

      return length;
    }

    const linkId = extractLinkIdFromCollectionSortable(overId);
    const index = links.findIndex((link) => link.id === linkId);
    if (index === -1) return length;

    return insertBeforeOrAfterRect(over.rect, index, length);
  }

  const nearest = nearestInnerFromCollisions();
  if (nearest) {
    const index = links.findIndex((link) => link.id === nearest.linkId);
    if (index !== -1) return insertBeforeOrAfterRect(nearest.rect, index, length);
  }

  return length;
}