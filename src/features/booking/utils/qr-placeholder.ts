/**
 * Deterministic 17×17 QR-style placeholder (finder squares + a pseudo-random
 * data pattern seeded by position). Purely decorative — real receipts would
 * embed an actual QR code generated server-side.
 */
export function buildQrCells(): string[] {
  const cells: string[] = [];
  for (let r = 0; r < 17; r += 1) {
    for (let c = 0; c < 17; c += 1) {
      let dark: boolean;
      const inFinder = (r < 7 && c < 7) || (r < 7 && c > 9) || (r > 9 && c < 7);
      if (inFinder) {
        const rr = r > 9 ? r - 10 : r;
        const cc = c > 9 ? c - 10 : c;
        dark =
          rr === 0 ||
          rr === 6 ||
          cc === 0 ||
          cc === 6 ||
          (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
      } else {
        dark = (r * 7 + c * 11 + ((r * c) % 5)) % 3 < 2 && (r + c * 3) % 4 !== 0;
      }
      cells.push(dark ? '#1A202C' : '#FFFFFF');
    }
  }
  return cells;
}
