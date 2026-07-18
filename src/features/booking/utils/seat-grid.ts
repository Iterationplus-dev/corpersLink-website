import type { Seat, SeatCell, SeatPosition } from '@/features/booking/types';

/**
 * Lays the vehicle's seats (already carrying server-computed `row`/`col`,
 * 0-indexed, with column 2 reserved as the aisle in a 2·aisle·2 layout) into
 * a grid, filling in `aisle` cells wherever no seat occupies a slot.
 */
export function buildSeatGrid(seats: Seat[]): SeatCell[] {
  if (seats.length === 0) return [];

  const maxRow = seats.reduce((max, seat) => Math.max(max, seat.row), 0);
  const cells: SeatCell[] = [];

  for (let row = 0; row <= maxRow; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      if (col === 2) {
        cells.push({ seat: null, status: 'aisle' });
        continue;
      }
      const seat = seats.find((s) => s.row === row && s.col === col);
      cells.push(seat ? { seat, status: seat.status } : { seat: null, status: 'aisle' });
    }
  }

  return cells;
}

/** e.g. "Window · Row 4" for display in the selection summary. Takes the
 * primitives directly (not a full `Seat`) so it also works from booking-store
 * state, which only persists `seatRow`/`seatPosition`. */
export function describeSeatPosition(row: number, position: SeatPosition): string {
  const side = position === 'window' ? 'Window' : 'Aisle';
  return `${side} · Row ${row + 1}`;
}
