export function getPageNumbers(current, total, window = 5) {
  if (total <= window) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - Math.floor(window / 2));
  let end = Math.min(total, start + window - 1);

  if (end - start + 1 < window) {
    start = Math.max(1, end - window + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
