"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  getClientRect,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type ClientRect,
  type Collision,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Over,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveBoardStateAction } from "@/actions/dashboard/links";
import type { BoardItem, LinkItem, TopLevelCard } from "@/types/board-types";
import {
  buildPersistPayload,
  cloneCards,
  extractCollectionIdFromBodyDropId,
  extractLinkIdFromCollectionSortable,
  getBoardSignature,
  isCollectionBodyDropId,
  isCollectionCardSortableId,
  isCollectionLinkSortableId,
  isTopLevelSortableId,
  toTopLevelCards,
} from "@/utils/board-utils";
import SortableLinkCard from "./SortableLinkCard";
import SortableCollectionCard from "./SortableCollectionCard";
import { CollectionCardPreview, LinkCardPreview } from "./DragPreview";
import AddItemModal from "./AddItemModal";

type Props = {
  boardItems?: BoardItem[];
};

const EMPTY_BOARD_ITEMS: BoardItem[] = [];
const BOARD_ROOT_ID = "board-root";
const COLLECTION_ZONE_PREFIX = "collection-zone-";
const COLLECTION_GAP_BEFORE_PREFIX = "collection-gap-before-";

type CollectionDropMode = "before" | "inside";

function parseCollectionZoneId(
  id: string
): { collectionId: string; mode: CollectionDropMode } | null {
  if (id.startsWith(`${COLLECTION_GAP_BEFORE_PREFIX}`)) {
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

/** Prefer the droppable under the pointer; ignore board root if another target also contains the pointer. */
const boardCollisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args);
  if (pointerHits.length > 0) {
    const withoutBoard = pointerHits.filter((c) => c.id !== BOARD_ROOT_ID);
    if (withoutBoard.length > 0) return withoutBoard;
    const boardHit = pointerHits.find((c) => c.id === BOARD_ROOT_ID);
    if (boardHit) return [boardHit];
  }
  return closestCorners(args);
};

/**
 * Pointer-first collision so inner collection targets win over the collection card hull.
 * - Nested link: link row > body layer > zones > top-level.
 * - Top-level link: body > inner link > zone-inside (so drops into collection register reliably).
 */
const linkBoardCollisionDetection: CollisionDetection = (args) => {
  const activeId = String(args.active.id);
  const pointer = args.pointerCoordinates;

  if (!pointer) return boardCollisionDetection(args);

  const pointerHits = pointerWithin(args);
  if (pointerHits.length === 0) return boardCollisionDetection(args);

  if (activeId.startsWith("collection-link-")) {
    const linkHit = pointerHits.find((c) => String(c.id).startsWith("collection-link-"));
    if (linkHit) return [linkHit];
    const gapBefore = pointerHits.find((c) => String(c.id).startsWith(COLLECTION_GAP_BEFORE_PREFIX));
    if (gapBefore) return [gapBefore];
    const bodyHit = pointerHits.find((c) => String(c.id).startsWith("collection-body-drop-"));
    if (bodyHit) return [bodyHit];
    const zoneHit = pointerHits.find(
      (c) => String(c.id).startsWith("collection-zone-") || String(c.id) === BOARD_ROOT_ID
    );
    if (zoneHit) return [zoneHit];
    const topLevelHit = pointerHits.find((c) => isTopLevelSortableId(String(c.id)));
    if (topLevelHit) return [topLevelHit];
    return pointerHits;
  }

  if (activeId.startsWith("link-")) {
    const gapBefore = pointerHits.find((c) => String(c.id).startsWith(COLLECTION_GAP_BEFORE_PREFIX));
    if (gapBefore) return [gapBefore];
    const bodyHit = pointerHits.find((c) => String(c.id).startsWith("collection-body-drop-"));
    if (bodyHit) return [bodyHit];
    const innerLinkHit = pointerHits.find((c) => String(c.id).startsWith("collection-link-"));
    if (innerLinkHit) return [innerLinkHit];
    const zoneInside = pointerHits.find((c) => String(c.id).startsWith("collection-zone-inside-"));
    if (zoneInside) return [zoneInside];
    const zoneBefore = pointerHits.find((c) => String(c.id).startsWith("collection-zone-before-"));
    if (zoneBefore) return [zoneBefore];
  }

  return boardCollisionDetection(args);
};

/** Map pointer Y within collection body rect to insert slot 0..linkCount (inclusive). */
function insertSlotFromBodyRect(pointerY: number, bodyRect: ClientRect, linkCount: number): number {
  const relY = pointerY - bodyRect.top;
  const h = Math.max(bodyRect.height, 1);
  if (linkCount === 0) return 0;
  return Math.max(0, Math.min(linkCount, Math.floor((relY / h) * (linkCount + 1))));
}

function collisionRectFromCollision(c: Collision): ClientRect | null {
  const data = c.data as { droppableContainer?: { rect: { current: ClientRect | null } }; value?: number } | undefined;
  return data?.droppableContainer?.rect?.current ?? null;
}

/** Insert index in [0, length] for top-level list: pointer above mid of target = before, below = after. */
function getTopLevelInsertIndexFromPointer(
  cards: TopLevelCard[],
  pointerY: number,
  over: Over | null,
  collisions: Collision[] | null
): number {
  const n = cards.length;
  const topLevelIds = new Set(cards.map((c) => c.sortableId));

  function nearestTopLevelFromCollisions(): { id: string; rect: ClientRect; value: number } | null {
    if (!collisions?.length) return null;
    let best: { id: string; rect: ClientRect; value: number } | null = null;
    for (const c of collisions) {
      const id = String(c.id);
      if (!topLevelIds.has(id)) continue;
      const rect = collisionRectFromCollision(c);
      if (!rect) continue;
      const data = c.data as { value?: number } | undefined;
      const value = data?.value ?? Infinity;
      if (!best || value < best.value) best = { id, rect, value };
    }
    return best;
  }

  function insertBeforeOrAfterRect(rect: ClientRect, cardIndex: number): number {
    const mid = rect.top + rect.height / 2;
    return pointerY >= mid ? cardIndex + 1 : cardIndex;
  }

  if (!over) {
    const nearest = nearestTopLevelFromCollisions();
    if (nearest) {
      const idx = cards.findIndex((c) => c.sortableId === nearest.id);
      if (idx !== -1) return insertBeforeOrAfterRect(nearest.rect, idx);
    }
    return n;
  }

  const overId = String(over.id);
  if (overId === BOARD_ROOT_ID) {
    const nearest = nearestTopLevelFromCollisions();
    if (nearest) {
      const idx = cards.findIndex((c) => c.sortableId === nearest.id);
      if (idx !== -1) return insertBeforeOrAfterRect(nearest.rect, idx);
    }
    return n;
  }

  if (isTopLevelSortableId(overId)) {
    const idx = cards.findIndex((c) => c.sortableId === overId);
    if (idx === -1) {
      const nearest = nearestTopLevelFromCollisions();
      if (nearest) {
        const j = cards.findIndex((c) => c.sortableId === nearest.id);
        if (j !== -1) return insertBeforeOrAfterRect(nearest.rect, j);
      }
      return n;
    }
    return insertBeforeOrAfterRect(over.rect, idx);
  }

  const nearest = nearestTopLevelFromCollisions();
  if (nearest) {
    const idx = cards.findIndex((c) => c.sortableId === nearest.id);
    if (idx !== -1) return insertBeforeOrAfterRect(nearest.rect, idx);
  }
  return n;
}

/** Insert index in [0, links.length] inside a collection's link list. */
function getInnerCollectionInsertIndexFromPointer(
  collectionId: string,
  cards: TopLevelCard[],
  pointerY: number,
  over: Over | null,
  collisions: Collision[] | null
): number {
  const collCard = cards.find(
    (c) => c.type === "COLLECTION" && c.collection.id === collectionId
  );
  if (!collCard || collCard.type !== "COLLECTION") return 0;

  const innerSortableIds = new Set(
    collCard.collection.links.map((l) => `collection-link-${l.id}`)
  );

  function nearestInnerFromCollisions(): { linkId: string; rect: ClientRect; value: number } | null {
    if (!collisions?.length) return null;
    let best: { linkId: string; rect: ClientRect; value: number } | null = null;
    for (const c of collisions) {
      const id = String(c.id);
      if (!innerSortableIds.has(id)) continue;
      const rect = collisionRectFromCollision(c);
      if (!rect) continue;
      const data = c.data as { value?: number } | undefined;
      const value = data?.value ?? Infinity;
      const linkId = extractLinkIdFromCollectionSortable(id);
      if (!best || value < best.value) best = { linkId, rect, value };
    }
    return best;
  }

  function insertBeforeOrAfterRect(rect: ClientRect, linkIndex: number, len: number): number {
    const mid = rect.top + rect.height / 2;
    return pointerY >= mid ? Math.min(linkIndex + 1, len) : linkIndex;
  }

  const links = collCard.collection.links;
  const len = links.length;

  if (!over) {
    const nearest = nearestInnerFromCollisions();
    if (nearest) {
      const idx = links.findIndex((l) => l.id === nearest.linkId);
      if (idx !== -1) return insertBeforeOrAfterRect(nearest.rect, idx, len);
    }
    return len;
  }

  const overId = String(over.id);
  if (overId.startsWith("collection-link-")) {
    if (!innerSortableIds.has(overId)) {
      const nearest = nearestInnerFromCollisions();
      if (nearest) {
        const idx = links.findIndex((l) => l.id === nearest.linkId);
        if (idx !== -1) return insertBeforeOrAfterRect(nearest.rect, idx, len);
      }
      return len;
    }
    const linkId = extractLinkIdFromCollectionSortable(overId);
    const idx = links.findIndex((l) => l.id === linkId);
    if (idx === -1) return len;
    return insertBeforeOrAfterRect(over.rect, idx, len);
  }

  const nearest = nearestInnerFromCollisions();
  if (nearest) {
    const idx = links.findIndex((l) => l.id === nearest.linkId);
    if (idx !== -1) return insertBeforeOrAfterRect(nearest.rect, idx, len);
  }
  return len;
}

function BoardDropArea({
  children,
  isDragging,
}: {
  children: React.ReactNode;
  isDragging: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: BOARD_ROOT_ID,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-[30px] p-2 transition-all duration-200 ${
        isDragging && isOver ? "bg-cyan-400/5 ring-1 ring-cyan-400/20" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function LinksBoard({ boardItems }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [collectionDropMode, setCollectionDropMode] = useState<{
    collectionId: string;
    mode: CollectionDropMode;
  } | null>(null);

  const safeBoardItems = boardItems ?? EMPTY_BOARD_ITEMS;

  const serverCards = useMemo(() => toTopLevelCards(safeBoardItems), [safeBoardItems]);
  const serverSignature = useMemo(() => getBoardSignature(safeBoardItems), [safeBoardItems]);

  const [cards, setCards] = useState<TopLevelCard[]>(() => serverCards);
  const [lastSyncedSignature, setLastSyncedSignature] = useState(serverSignature);

  const pointerClientRef = useRef({ x: 0, y: 0 });

  const [dragOverlayContainer, setDragOverlayContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setDragOverlayContainer(document.body);
  }, []);

  useEffect(() => {
    if (serverSignature !== lastSyncedSignature) {
      setCards(serverCards);
      setLastSyncedSignature(serverSignature);
    }
  }, [serverCards, serverSignature, lastSyncedSignature]);

  useEffect(() => {
    if (!activeId) return;
    const onMove = (e: PointerEvent) => {
      pointerClientRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [activeId]);

  const sensors = useSensors(useSensor(PointerSensor));

  const topLevelIds = useMemo(() => cards.map((item) => item.sortableId), [cards]);

  const activeCard = useMemo(() => {
    if (!activeId) return null;

    const topLevel = cards.find((item) => item.sortableId === activeId);
    if (topLevel) return topLevel;

    if (isCollectionLinkSortableId(activeId)) {
      const linkId = extractLinkIdFromCollectionSortable(activeId);

      for (const card of cards) {
        if (card.type !== "COLLECTION") continue;

        const found = card.collection.links.find((link) => link.id === linkId);
        if (found) {
          return {
            id: found.id,
            sortableId: activeId,
            type: "LINK" as const,
            position: found.position,
            link: found,
          };
        }
      }
    }

    return null;
  }, [activeId, cards]);

  function getCollectionCard(
    list: TopLevelCard[],
    index: number
  ): Extract<TopLevelCard, { type: "COLLECTION" }> | null {
    const card = list[index];
    if (!card || card.type !== "COLLECTION") return null;
    return card;
  }

  function normalizeCards(list: TopLevelCard[]): TopLevelCard[] {
    return list.map((card, index) =>
      card.type === "LINK"
        ? {
            ...card,
            position: index,
            sortableId: `link-${card.link.id}`,
            link: {
              ...card.link,
              collectionId: null,
              position: 0,
            },
          }
        : {
            ...card,
            position: index,
            sortableId: `collection-${card.collection.id}`,
            collection: {
              ...card.collection,
              links: card.collection.links.map((link, linkIndex) => ({
                ...link,
                collectionId: card.collection.id,
                position: linkIndex,
              })),
            },
          }
    );
  }

  function persistCards(nextCards: TopLevelCard[], previousCards: TopLevelCard[]) {
    setCards(nextCards);

    startTransition(async () => {
      const payload = buildPersistPayload(nextCards);
      const res = await saveBoardStateAction(payload);

      if (!res.success) {
        setCards(previousCards);
        toast.error(res.message || "Failed to save board");
        return;
      }

      router.refresh();
    });
  }

  function findTopLevelIndexBySortableId(list: TopLevelCard[], sortableId: string) {
    return list.findIndex((card) => card.sortableId === sortableId);
  }

  function findCollectionLinkLocation(list: TopLevelCard[], linkId: string) {
    for (let i = 0; i < list.length; i++) {
      const card = list[i];
      if (card.type !== "COLLECTION") continue;

      const linkIndex = card.collection.links.findIndex((link) => link.id === linkId);

      if (linkIndex !== -1) {
        return {
          collectionIndex: i,
          linkIndex,
          link: card.collection.links[linkIndex],
        };
      }
    }

    return null;
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    const ae = event.activatorEvent;
    if (ae && "clientY" in ae) {
      const m = ae as PointerEvent;
      pointerClientRef.current = { x: m.clientX, y: m.clientY };
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;

    if (!over) {
      setCollectionDropMode(null);
      return;
    }

    const overId = String(over.id);

    const parsed = parseCollectionZoneId(overId);
    if (parsed) {
      setCollectionDropMode(parsed);
      return;
    }

    // If we're not over an explicit zone, clear the hint.
    // (We still handle `collection-*` / `collection-link-*` in onDragEnd for safety.)
    setCollectionDropMode(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, collisions } = event;
    const activeSortableId = String(active.id);
    const pointerY = pointerClientRef.current.y;

    setActiveId(null);

    // Drop outside any droppable: pull nested link to top-level (Linktree-style "drop in empty").
    if (!over) {
      if (isCollectionLinkSortableId(activeSortableId)) {
        const previousCards = cloneCards(cards);
        let nextCards = cloneCards(cards);
        const activeLinkId = extractLinkIdFromCollectionSortable(activeSortableId);
        const sourceLocation = findCollectionLinkLocation(nextCards, activeLinkId);

        if (sourceLocation) {
          const { collectionIndex, linkIndex, link: movingLink } = sourceLocation;
          const sourceCollectionCard = getCollectionCard(nextCards, collectionIndex);

          if (sourceCollectionCard) {
            const insertIndex = getTopLevelInsertIndexFromPointer(
              nextCards,
              pointerY,
              null,
              collisions
            );
            sourceCollectionCard.collection.links.splice(linkIndex, 1);
            nextCards.splice(insertIndex, 0, {
              id: movingLink.id,
              sortableId: `link-${movingLink.id}`,
              type: "LINK",
              position: 0,
              link: {
                ...movingLink,
                collectionId: null,
                position: 0,
              },
            });
            nextCards = normalizeCards(nextCards);
            persistCards(nextCards, previousCards);
          }
        }
      }

      setCollectionDropMode(null);
      return;
    }

    const overSortableId = String(over.id);

    if (activeSortableId === overSortableId) {
      setCollectionDropMode(null);
      return;
    }

    const zoneTarget = parseCollectionZoneId(overSortableId);
    const resolvedOverSortableId = zoneTarget
      ? `collection-${zoneTarget.collectionId}`
      : overSortableId;

    const previousCards = cloneCards(cards);
    let nextCards = cloneCards(cards);

    function moveTopLevelLinkIntoCollection(
      movingLink: LinkItem,
      targetCollectionId: string,
      insertIndex?: number
    ) {
      const targetCollectionIndex = nextCards.findIndex(
        (card) => card.type === "COLLECTION" && card.collection.id === targetCollectionId
      );
      const targetCollectionCard = getCollectionCard(nextCards, targetCollectionIndex);
      if (!targetCollectionCard) return false;

      const safeIndex =
        typeof insertIndex === "number"
          ? Math.max(0, Math.min(insertIndex, targetCollectionCard.collection.links.length))
          : targetCollectionCard.collection.links.length;

      targetCollectionCard.collection.links.splice(safeIndex, 0, {
        ...movingLink,
        collectionId: targetCollectionCard.collection.id,
        position: safeIndex,
      });

      nextCards = normalizeCards(nextCards);
      return true;
    }

    // 1A) TOP-LEVEL LINK -> COLLECTION BODY DROP (was misclassified as "collection-*" card before)
    if (activeSortableId.startsWith("link-") && isCollectionBodyDropId(overSortableId)) {
      const activeTopLevelIndex = findTopLevelIndexBySortableId(nextCards, activeSortableId);
      if (activeTopLevelIndex === -1) {
        setCollectionDropMode(null);
        return;
      }

      const activeCard = nextCards[activeTopLevelIndex];
      if (!activeCard || activeCard.type !== "LINK") {
        setCollectionDropMode(null);
        return;
      }

      const targetCollectionId = extractCollectionIdFromBodyDropId(overSortableId);
      const targetCollectionIndex = nextCards.findIndex(
        (c) => c.type === "COLLECTION" && c.collection.id === targetCollectionId
      );
      const targetCollectionCard = getCollectionCard(nextCards, targetCollectionIndex);
      if (!targetCollectionCard) {
        setCollectionDropMode(null);
        return;
      }

      const n = targetCollectionCard.collection.links.length;
      const insertAt = insertSlotFromBodyRect(pointerY, over.rect, n);

      nextCards.splice(activeTopLevelIndex, 1);

      const freshTargetIndex = nextCards.findIndex(
        (c) => c.type === "COLLECTION" && c.collection.id === targetCollectionId
      );
      const freshTargetCollectionCard = getCollectionCard(nextCards, freshTargetIndex);
      if (!freshTargetCollectionCard) {
        setCollectionDropMode(null);
        return;
      }

      const safeInsert = Math.max(
        0,
        Math.min(insertAt, freshTargetCollectionCard.collection.links.length)
      );
      freshTargetCollectionCard.collection.links.splice(safeInsert, 0, {
        ...activeCard.link,
        collectionId: freshTargetCollectionCard.collection.id,
        position: safeInsert,
      });

      nextCards = normalizeCards(nextCards);
      setCollectionDropMode(null);
      persistCards(nextCards, previousCards);
      return;
    }

    // 1) TOP-LEVEL REORDER
    if (
      isTopLevelSortableId(activeSortableId) &&
      isTopLevelSortableId(resolvedOverSortableId)
    ) {
      // Special case:
      // top-level LINK dragged onto collection card top area => place before collection
      if (
        activeSortableId.startsWith("link-") &&
        isCollectionCardSortableId(resolvedOverSortableId)
      ) {
        const activeTopLevelIndex = findTopLevelIndexBySortableId(nextCards, activeSortableId);
        const targetCollectionIndex = findTopLevelIndexBySortableId(nextCards, resolvedOverSortableId);

        if (activeTopLevelIndex === -1 || targetCollectionIndex === -1) {
          setCollectionDropMode(null);
          return;
        }

        const activeCard = nextCards[activeTopLevelIndex];
        const targetCollectionCard = getCollectionCard(nextCards, targetCollectionIndex);

        if (!activeCard || activeCard.type !== "LINK" || !targetCollectionCard) {
          setCollectionDropMode(null);
          return;
        }

        const dropMode: CollectionDropMode =
          zoneTarget?.collectionId === targetCollectionCard.collection.id
            ? zoneTarget.mode
            : "inside";

        // top/header area => before collection
        if (dropMode === "before") {
          nextCards = arrayMove(nextCards, activeTopLevelIndex, targetCollectionIndex);
          nextCards = normalizeCards(nextCards);
          setCollectionDropMode(null);
          persistCards(nextCards, previousCards);
          return;
        }

        // body area => move inside collection
        nextCards.splice(activeTopLevelIndex, 1);

        const freshTargetIndex = nextCards.findIndex(
          (card) =>
            card.type === "COLLECTION" &&
            card.collection.id === targetCollectionCard.collection.id
        );
        const freshTargetCollectionCard = getCollectionCard(nextCards, freshTargetIndex);

        if (!freshTargetCollectionCard) {
          setCollectionDropMode(null);
          return;
        }

        const innerInsertAt = getInnerCollectionInsertIndexFromPointer(
          freshTargetCollectionCard.collection.id,
          nextCards,
          pointerY,
          over,
          collisions
        );

        freshTargetCollectionCard.collection.links.splice(innerInsertAt, 0, {
          ...activeCard.link,
          collectionId: freshTargetCollectionCard.collection.id,
          position: innerInsertAt,
        });

        nextCards = normalizeCards(nextCards);
        setCollectionDropMode(null);
        persistCards(nextCards, previousCards);
        return;
      }

      const oldIndex = findTopLevelIndexBySortableId(nextCards, activeSortableId);
      const newIndex = findTopLevelIndexBySortableId(nextCards, resolvedOverSortableId);

      if (oldIndex !== -1 && newIndex !== -1) {
        nextCards = arrayMove(nextCards, oldIndex, newIndex);
        nextCards = normalizeCards(nextCards);
        setCollectionDropMode(null);
        persistCards(nextCards, previousCards);
      }

      return;
    }

    // 1B) TOP-LEVEL LINK -> COLLECTION LINK (insert into that collection at index)
    if (activeSortableId.startsWith("link-") && isCollectionLinkSortableId(resolvedOverSortableId)) {
      const activeTopLevelIndex = findTopLevelIndexBySortableId(nextCards, activeSortableId);
      if (activeTopLevelIndex === -1) {
        setCollectionDropMode(null);
        return;
      }

      const activeCard = nextCards[activeTopLevelIndex];
      if (!activeCard || activeCard.type !== "LINK") {
        setCollectionDropMode(null);
        return;
      }

      const overLinkId = extractLinkIdFromCollectionSortable(resolvedOverSortableId);
      const targetLocation = findCollectionLinkLocation(nextCards, overLinkId);
      if (!targetLocation) {
        setCollectionDropMode(null);
        return;
      }

      // Remove from top-level
      nextCards.splice(activeTopLevelIndex, 1);

      const targetCollectionCard = getCollectionCard(nextCards, targetLocation.collectionIndex);
      if (!targetCollectionCard) {
        setCollectionDropMode(null);
        return;
      }

      const ok = moveTopLevelLinkIntoCollection(
        activeCard.link,
        targetCollectionCard.collection.id,
        targetLocation.linkIndex
      );

      if (!ok) {
        setCollectionDropMode(null);
        return;
      }

      setCollectionDropMode(null);
      persistCards(nextCards, previousCards);
      return;
    }

    // 2) COLLECTION LINK ACTIONS
    if (isCollectionLinkSortableId(activeSortableId)) {
      const activeLinkId = extractLinkIdFromCollectionSortable(activeSortableId);
      const sourceLocation = findCollectionLinkLocation(nextCards, activeLinkId);

      if (!sourceLocation) {
        setCollectionDropMode(null);
        return;
      }

      const {
        collectionIndex: sourceCollectionIndex,
        linkIndex: sourceLinkIndex,
        link: movingLink,
      } = sourceLocation;

      // 2A) COLLECTION LINK -> EMPTY BOARD AREA
      if (overSortableId === BOARD_ROOT_ID) {
        const sourceCollectionCard = getCollectionCard(nextCards, sourceCollectionIndex);
        if (!sourceCollectionCard) {
          setCollectionDropMode(null);
          return;
        }

        const insertIndex = getTopLevelInsertIndexFromPointer(
          nextCards,
          pointerY,
          over,
          collisions
        );

        sourceCollectionCard.collection.links.splice(sourceLinkIndex, 1);

        nextCards.splice(insertIndex, 0, {
          id: movingLink.id,
          sortableId: `link-${movingLink.id}`,
          type: "LINK",
          position: 0,
          link: {
            ...movingLink,
            collectionId: null,
            position: 0,
          },
        });

        nextCards = normalizeCards(nextCards);
        setCollectionDropMode(null);
        persistCards(nextCards, previousCards);
        return;
      }

      // 2B) COLLECTION LINK -> TOP-LEVEL LINK
      if (overSortableId.startsWith("link-")) {
        const sourceCollectionCard = getCollectionCard(nextCards, sourceCollectionIndex);

        if (!sourceCollectionCard) {
          setCollectionDropMode(null);
          return;
        }

        const insertIndex = getTopLevelInsertIndexFromPointer(
          nextCards,
          pointerY,
          over,
          collisions
        );

        sourceCollectionCard.collection.links.splice(sourceLinkIndex, 1);

        nextCards.splice(insertIndex, 0, {
          id: movingLink.id,
          sortableId: `link-${movingLink.id}`,
          type: "LINK",
          position: 0,
          link: {
            ...movingLink,
            collectionId: null,
            position: 0,
          },
        });

        nextCards = normalizeCards(nextCards);
        setCollectionDropMode(null);
        persistCards(nextCards, previousCards);
        return;
      }

      // 2B.5) COLLECTION LINK -> FULL COLLECTION BODY (gaps + slot-based insert)
      if (isCollectionBodyDropId(overSortableId)) {
        const targetCollectionId = extractCollectionIdFromBodyDropId(overSortableId);
        const sourceCollectionCard = getCollectionCard(nextCards, sourceCollectionIndex);
        const targetCollectionIndex = nextCards.findIndex(
          (card) => card.type === "COLLECTION" && card.collection.id === targetCollectionId
        );
        const targetCollectionCard = getCollectionCard(nextCards, targetCollectionIndex);

        if (!sourceCollectionCard || !targetCollectionCard) {
          setCollectionDropMode(null);
          return;
        }

        const nTarget = targetCollectionCard.collection.links.length;
        const insertSlot = insertSlotFromBodyRect(pointerY, over.rect, nTarget);

        sourceCollectionCard.collection.links.splice(sourceLinkIndex, 1);

        let insertIndex = insertSlot;
        if (sourceCollectionIndex === targetCollectionIndex && sourceLinkIndex < insertSlot) {
          insertIndex = insertSlot - 1;
        }
        insertIndex = Math.max(0, Math.min(insertIndex, targetCollectionCard.collection.links.length));

        targetCollectionCard.collection.links.splice(insertIndex, 0, {
          ...movingLink,
          collectionId: targetCollectionCard.collection.id,
          position: insertIndex,
        });

        nextCards = normalizeCards(nextCards);
        setCollectionDropMode(null);
        persistCards(nextCards, previousCards);
        return;
      }

      // 2C) COLLECTION LINK -> COLLECTION CARD (not collection-link-* — that is 2D)
      if (isCollectionCardSortableId(resolvedOverSortableId)) {
        const targetCollectionIndex = findTopLevelIndexBySortableId(nextCards, resolvedOverSortableId);

        if (targetCollectionIndex === -1) {
          setCollectionDropMode(null);
          return;
        }

        const sourceCollectionCard = getCollectionCard(nextCards, sourceCollectionIndex);
        const targetCollectionCard = getCollectionCard(nextCards, targetCollectionIndex);

        if (!sourceCollectionCard || !targetCollectionCard) {
          setCollectionDropMode(null);
          return;
        }

        const dropMode: CollectionDropMode =
          zoneTarget?.collectionId === targetCollectionCard.collection.id
            ? zoneTarget.mode
            : "inside";

        sourceCollectionCard.collection.links.splice(sourceLinkIndex, 1);

        // top/header area => place before that collection
        if (dropMode === "before") {
          const insertIndex =
            sourceCollectionIndex < targetCollectionIndex
              ? targetCollectionIndex - 1
              : targetCollectionIndex;

          nextCards.splice(insertIndex, 0, {
            id: movingLink.id,
            sortableId: `link-${movingLink.id}`,
            type: "LINK",
            position: 0,
            link: {
              ...movingLink,
              collectionId: null,
              position: 0,
            },
          });

          nextCards = normalizeCards(nextCards);
          setCollectionDropMode(null);
          persistCards(nextCards, previousCards);
          return;
        }

        // body area => move inside collection
        const freshTargetIndex = nextCards.findIndex(
          (card) =>
            card.type === "COLLECTION" &&
            card.collection.id === targetCollectionCard.collection.id
        );
        const freshTargetCollectionCard = getCollectionCard(nextCards, freshTargetIndex);

        if (!freshTargetCollectionCard) {
          setCollectionDropMode(null);
          return;
        }

        let insertAt = getInnerCollectionInsertIndexFromPointer(
          targetCollectionCard.collection.id,
          nextCards,
          pointerY,
          over,
          collisions
        );
        if (sourceCollectionIndex === targetCollectionIndex && sourceLinkIndex < insertAt) {
          insertAt -= 1;
        }
        insertAt = Math.max(0, Math.min(insertAt, freshTargetCollectionCard.collection.links.length));

        freshTargetCollectionCard.collection.links.splice(insertAt, 0, {
          ...movingLink,
          collectionId: freshTargetCollectionCard.collection.id,
          position: insertAt,
        });

        nextCards = normalizeCards(nextCards);
        setCollectionDropMode(null);
        persistCards(nextCards, previousCards);
        return;
      }

      // 2D) COLLECTION LINK -> COLLECTION LINK
      if (isCollectionLinkSortableId(overSortableId)) {
        const overLinkId = extractLinkIdFromCollectionSortable(overSortableId);
        const targetLocation = findCollectionLinkLocation(nextCards, overLinkId);

        if (!targetLocation) {
          setCollectionDropMode(null);
          return;
        }

        const {
          collectionIndex: targetCollectionIndex,
          linkIndex: targetLinkIndex,
        } = targetLocation;

        const sourceCollectionCard = getCollectionCard(nextCards, sourceCollectionIndex);
        const targetCollectionCard = getCollectionCard(nextCards, targetCollectionIndex);

        if (!sourceCollectionCard || !targetCollectionCard) {
          setCollectionDropMode(null);
          return;
        }

        // same collection reorder
        if (sourceCollectionIndex === targetCollectionIndex) {
          sourceCollectionCard.collection.links = arrayMove(
            sourceCollectionCard.collection.links,
            sourceLinkIndex,
            targetLinkIndex
          );

          nextCards = normalizeCards(nextCards);
          setCollectionDropMode(null);
          persistCards(nextCards, previousCards);
          return;
        }

        // different collection move
        sourceCollectionCard.collection.links.splice(sourceLinkIndex, 1);

        const freshTargetCollectionCard = getCollectionCard(nextCards, targetCollectionIndex);
        if (!freshTargetCollectionCard) {
          setCollectionDropMode(null);
          return;
        }

        freshTargetCollectionCard.collection.links.splice(targetLinkIndex, 0, {
          ...movingLink,
          collectionId: freshTargetCollectionCard.collection.id,
          position: targetLinkIndex,
        });

        nextCards = normalizeCards(nextCards);
        setCollectionDropMode(null);
        persistCards(nextCards, previousCards);
        return;
      }
    }

    setCollectionDropMode(null);
  };

  return (
    <>
      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={linkBoardCollisionDetection}
          measuring={{ draggable: { measure: getClientRect } }}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <BoardDropArea isDragging={!!activeId}>
            <SortableContext items={topLevelIds} strategy={verticalListSortingStrategy}>
              {cards.length === 0 ? (
                <div
                  className="rounded-[22px] border border-dashed border-white/12 bg-white/[0.02] px-6 py-14 text-center"
                  role="status"
                >
                  <p className="text-base font-medium text-white/85">
                    No links or collections yet
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/45">
                    Use <span className="text-white/65">Add</span> or{" "}
                    <span className="text-white/65">Add collection</span> in your profile
                    section above to build your page.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cards.map((item) =>
                    item.type === "LINK" ? (
                      <SortableLinkCard
                        key={item.sortableId}
                        sortableId={item.sortableId}
                        link={item.link}
                      />
                    ) : (
                      <SortableCollectionCard
                        key={item.sortableId}
                        sortableId={item.sortableId}
                        collection={item.collection}
                      />
                    )
                  )}
                </div>
              )}
            </SortableContext>
          </BoardDropArea>

          {dragOverlayContainer
            ? createPortal(
                <DragOverlay
                  adjustScale={false}
                  dropAnimation={null}
                  zIndex={9999}
                  className="pointer-events-none"
                >
                  {activeCard?.type === "LINK" ? (
                    <LinkCardPreview
                      link={activeCard.link}
                      variant={
                        activeId != null && isCollectionLinkSortableId(activeId)
                          ? "inner"
                          : "root"
                      }
                    />
                  ) : activeCard?.type === "COLLECTION" ? (
                    <CollectionCardPreview collection={activeCard.collection} />
                  ) : null}
                </DragOverlay>,
                dragOverlayContainer
              )
            : null}
        </DndContext>
      </div>

      <AddItemModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}