export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface Connection<T, CustomEdge extends Edge<T> = Edge<T>> {
  nodes: T[];
  edges: Array<CustomEdge>;
  pageInfo: PageInfo;
  totalCount: number;
}
