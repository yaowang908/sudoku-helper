import { rowsEnum, columnsEnum } from '@/components/constants';
import { SudoKuDataType, getRowId, getColumnId } from './sudokuSlice';

/**
 * Recomputes the `crossedValues` of every cell from scratch based on the
 * `selectedValue`s currently placed on the board.
 *
 * A value is "crossed" (eliminated) for a cell when that value already appears
 * as a placed value in a peer cell — i.e. a cell in the same row, column, or
 * 3x3 group. Deriving this in one pass keeps the helper state consistent no
 * matter how the board was mutated (place, erase, generate) and fixes stale
 * cross-outs that the previous incremental approach left behind after erasing.
 */
const recomputeCrossedValues = (data: SudoKuDataType): SudoKuDataType => {
  const result: SudoKuDataType = JSON.parse(JSON.stringify(data));

  const rows = Object.values(rowsEnum);
  const columns = Object.values(columnsEnum);

  for (let r = 1; r <= 9; r++) {
    const rowId = getRowId(r);
    for (let c = 1; c <= 9; c++) {
      const columnId = getColumnId(c);
      const cell = result[rowId][columnId];
      const group = cell.group;

      const eliminated = new Set<number>();

      // same row + same column
      for (let k = 1; k <= 9; k++) {
        if (k !== c) {
          const v = result[rowId][getColumnId(k)].selectedValue;
          if (v !== undefined) eliminated.add(v);
        }
        if (k !== r) {
          const v = result[getRowId(k)][columnId].selectedValue;
          if (v !== undefined) eliminated.add(v);
        }
      }

      // same group
      for (const rId of rows) {
        for (const cId of columns) {
          if (rId === rowId && cId === columnId) continue;
          const peer = result[rId][cId];
          if (peer.group === group && peer.selectedValue !== undefined) {
            eliminated.add(peer.selectedValue);
          }
        }
      }

      cell.crossedValues = Array.from(eliminated).sort((a, b) => a - b);
    }
  }

  return result;
};

export default recomputeCrossedValues;
