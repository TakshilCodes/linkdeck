export type LinkItem = {
  id: string;
  name: string;
  url: string;
  isVisible: boolean;
  clickCount: number;
  position: number;
  collectionId: string | null;
};

export type CollectionItem = {
  id: string;
  name: string;
  isVisible: boolean;
  position: number;
  links: LinkItem[];
};

export type BoardItem = {
  id: string;
  type: "LINK" | "COLLECTION";
  position: number;
  link: LinkItem | null;
  collection: CollectionItem | null;
};

export type TopLevelCard =
  | {
      id: string;
      sortableId: string;
      type: "LINK";
      position: number;
      link: LinkItem;
    }
  | {
      id: string;
      sortableId: string;
      type: "COLLECTION";
      position: number;
      collection: CollectionItem;
    };

export type PersistBoardPayload = {
  topLevel: {
    id: string;
    type: "LINK" | "COLLECTION";
    position: number;
  }[];
  collectionLinks: {
    collectionId: string;
    links: {
      id: string;
      position: number;
    }[];
  }[];
};