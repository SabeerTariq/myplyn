/** Renders empty fallback when items is missing or has length 0 (avoids `map() || empty` bug). */
export default function ListOrEmpty({ items, children, empty }) {
  if (!items?.length) return empty;
  return children(items);
}
