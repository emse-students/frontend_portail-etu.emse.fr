export interface JsonLdCollection<T> {
  collection: T[];
  totalItems: number;
  pages: JsonLdPage | null;
}

export interface JsonLdPage {
  current: number;
  first: number | null;
  next: number | null;
  last: number | null;
  previous: number | null;
}
