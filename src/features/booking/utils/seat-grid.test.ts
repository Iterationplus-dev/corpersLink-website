import { describe, expect, it } from 'vitest';

import type { Seat } from '@/features/booking/types';

import { buildSeatGrid, describeSeatPosition } from './seat-grid';

function makeSeat(overrides: Partial<Seat> & { id: number }): Seat {
  const label = overrides.label ?? String(overrides.id);
  return {
    vehicleId: 1,
    label,
    row: 0,
    col: 0,
    position: 'window',
    status: 'available',
    holdExpiresAt: null,
    ...overrides,
  };
}

describe('buildSeatGrid', () => {
  it('lays out a single row of 4 seats with an aisle in column 2', () => {
    const seats = [
      makeSeat({ id: 1, label: '1', row: 0, col: 0, position: 'window' }),
      makeSeat({ id: 2, label: '2', row: 0, col: 1, position: 'aisle' }),
      makeSeat({ id: 3, label: '3', row: 0, col: 3, position: 'aisle' }),
      makeSeat({ id: 4, label: '4', row: 0, col: 4, position: 'window' }),
    ];

    const cells = buildSeatGrid(seats);

    expect(cells).toHaveLength(5);
    expect(cells[0]?.seat?.label).toBe('1');
    expect(cells[1]?.seat?.label).toBe('2');
    expect(cells[2]).toEqual({ seat: null, status: 'aisle' });
    expect(cells[3]?.seat?.label).toBe('3');
    expect(cells[4]?.seat?.label).toBe('4');
  });

  it('passes the server-computed status straight through, including held_by_you', () => {
    const seats = [makeSeat({ id: 2, row: 0, col: 1, status: 'held_by_you' })];
    const cells = buildSeatGrid(seats);
    expect(cells.find((c) => c.seat?.id === 2)?.status).toBe('held_by_you');
  });

  it('marks held and occupied seats with their server status', () => {
    const seats = [
      makeSeat({ id: 1, row: 0, col: 0, status: 'held' }),
      makeSeat({ id: 4, row: 0, col: 4, status: 'occupied' }),
    ];
    const cells = buildSeatGrid(seats);
    expect(cells.find((c) => c.seat?.id === 1)?.status).toBe('held');
    expect(cells.find((c) => c.seat?.id === 4)?.status).toBe('occupied');
  });

  it('fills any grid position with no matching seat as an aisle placeholder', () => {
    // Row 0 full, row 1 (the partial last row) has only one real seat —
    // columns 1/3/4 of row 1 have no matching seat.
    const seats = [
      makeSeat({ id: 1, row: 0, col: 0 }),
      makeSeat({ id: 2, row: 0, col: 1 }),
      makeSeat({ id: 3, row: 0, col: 3 }),
      makeSeat({ id: 4, row: 0, col: 4 }),
      makeSeat({ id: 5, row: 1, col: 0, status: 'available' }),
    ];
    const cells = buildSeatGrid(seats);

    expect(cells).toHaveLength(10);
    const secondRow = cells.slice(5, 10);
    expect(secondRow[0]?.seat?.id).toBe(5);
    expect(secondRow[1]).toEqual({ seat: null, status: 'aisle' });
    expect(secondRow[3]).toEqual({ seat: null, status: 'aisle' });
  });

  it('returns an empty grid for no seats', () => {
    expect(buildSeatGrid([])).toEqual([]);
  });
});

describe('describeSeatPosition', () => {
  it('describes a window seat with a 1-indexed row', () => {
    expect(describeSeatPosition(3, 'window')).toBe('Window · Row 4');
  });

  it('describes an aisle seat', () => {
    expect(describeSeatPosition(0, 'aisle')).toBe('Aisle · Row 1');
  });
});
