import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';
import { gridStructures } from '@/components/sudoku/gridStructures';
import { rowsEnum, columnsEnum, SudoKuLevel } from '@/components/constants';
import {
  setCrossedValue as internalSetCrossedValue,
  setSelectedValue as internalSetSelectedValue,
  setPossibleValue as internalSetPossibleValue,
  setValue as internalSetValue,
} from './reducers';
import { default as internalGenerateSudoku } from './generateSudoku';
import recomputeCrossedValues from './recompute';

export interface SudokuCellState {
  group: number;
  row: number;
  column: number;
  selectedValue?: number;
  preInstalled?: boolean;
  crossedValues: number[];
  possibleValues: number[];
}

export type SudoKuDataType = {
  [key in rowsEnum]: { [key in columnsEnum]: SudokuCellState };
};

export enum OperationMode {
  EDIT = 'EDIT',
  NOTE = 'NOTE',
}
export interface SudokuState {
  data: SudoKuDataType;
  hideCrossedValues: boolean;
  operationMode: OperationMode;
  activeCell?: { row: number; column: number };
  difficulty?: SudoKuLevel;
  puzzleId: number;
}

const initialState: SudokuState = {
  data: gridStructures,
  hideCrossedValues: false,
  operationMode: OperationMode.EDIT,
  puzzleId: 0,
};

export const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    setCrossedValue: internalSetCrossedValue,
    setSelectedValue: internalSetSelectedValue,
    setPossibleValues: internalSetPossibleValue,
    setHideCrossedValues: (state, action: PayloadAction<boolean>) => {
      state.hideCrossedValues = action.payload;
    },
    setValue: internalSetValue,
    setActiveCell: (
      state,
      action: PayloadAction<{ row: number; column: number }>
    ) => {
      state.activeCell = action.payload;
    },
    moveActiveCell: (
      state,
      action: PayloadAction<'up' | 'down' | 'left' | 'right'>
    ) => {
      const current = state.activeCell ?? { row: 1, column: 1 };
      const clamp = (n: number) => Math.min(9, Math.max(1, n));
      const next = { ...current };
      switch (action.payload) {
        case 'up':
          next.row = clamp(current.row - 1);
          break;
        case 'down':
          next.row = clamp(current.row + 1);
          break;
        case 'left':
          next.column = clamp(current.column - 1);
          break;
        case 'right':
          next.column = clamp(current.column + 1);
          break;
      }
      state.activeCell = next;
    },
    setOperationMode: (state, action: PayloadAction<OperationMode>) => {
      state.operationMode = action.payload;
    },
    generateSudoku: internalGenerateSudoku,
    reset: () => initialState,
    eraseCell: (
      state,
      action: PayloadAction<{ row: number; column: number } | undefined>
    ) => {
      if (!action.payload) return;
      if (
        state.data[getRowId(action.payload.row)][
          getColumnId(action.payload.column)
        ].preInstalled
      )
        return;

      const { row, column } = action.payload;
      const data: SudoKuDataType = JSON.parse(JSON.stringify(state.data));

      // Clear the cell's own value & notes, then rebuild every cell's crossed
      // values from scratch so peers correctly regain the erased value as a
      // candidate again.
      data[getRowId(row)][getColumnId(column)].selectedValue = undefined;
      data[getRowId(row)][getColumnId(column)].crossedValues = [];
      data[getRowId(row)][getColumnId(column)].possibleValues = [];

      state.data = recomputeCrossedValues(data);
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.sudoku,
      };
    },
  },
});

export const {
  setCrossedValue,
  setSelectedValue,
  setPossibleValues,
  setHideCrossedValues,
  setValue,
  setActiveCell,
  moveActiveCell,
  setOperationMode,
  generateSudoku,
  reset,
  eraseCell,
} = sudokuSlice.actions;

export const getRowId = (row: number) => `row_${row}` as rowsEnum;
export const getColumnId = (column: number) =>
  `column_${column}` as columnsEnum;
export const getHideCrossedValues = (state: AppState) =>
  state.sudoku.hideCrossedValues;
export const selectSudoku = (state: AppState) => state.sudoku.data;
export const selectSudokuCell =
  (props: { row: number; column: number } | undefined) => (state: AppState) => {
    if (!props) return undefined;
    const { row, column } = props;
    return state.sudoku.data?.[getRowId(row)]?.[getColumnId(column)];
  };
export const getActiveCell = (state: AppState) => state.sudoku.activeCell;
export const getOperationMode = (state: AppState) => state.sudoku.operationMode;
export const getDifficulty = (state: AppState) => state.sudoku.difficulty;
export const getPuzzleId = (state: AppState) => state.sudoku.puzzleId;

/** Set of "row-column" keys for cells whose value clashes with a peer. */
export const computeConflicts = (data: SudoKuDataType): Set<string> => {
  const conflicts = new Set<string>();
  const cells: {
    row: number;
    column: number;
    group: number;
    value: number;
  }[] = [];

  for (let r = 1; r <= 9; r++) {
    for (let c = 1; c <= 9; c++) {
      const cell = data[getRowId(r)][getColumnId(c)];
      if (cell.selectedValue !== undefined) {
        cells.push({
          row: r,
          column: c,
          group: cell.group,
          value: cell.selectedValue,
        });
      }
    }
  }

  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      const a = cells[i];
      const b = cells[j];
      if (a.value !== b.value) continue;
      if (a.row === b.row || a.column === b.column || a.group === b.group) {
        conflicts.add(`${a.row}-${a.column}`);
        conflicts.add(`${b.row}-${b.column}`);
      }
    }
  }

  return conflicts;
};

export const getConflicts = (state: AppState): Set<string> =>
  computeConflicts(state.sudoku.data);

/** How many of each digit (1-9) are currently placed on the board. */
export const getDigitCounts = (state: AppState): Record<number, number> => {
  const data = state.sudoku.data;
  const counts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };
  for (let r = 1; r <= 9; r++) {
    for (let c = 1; c <= 9; c++) {
      const v = data[getRowId(r)][getColumnId(c)].selectedValue;
      if (v !== undefined) counts[v] += 1;
    }
  }
  return counts;
};

/** The board is solved when every cell is filled and no conflicts exist. */
export const getIsSolved = (state: AppState): boolean => {
  const data = state.sudoku.data;
  for (let r = 1; r <= 9; r++) {
    for (let c = 1; c <= 9; c++) {
      if (data[getRowId(r)][getColumnId(c)].selectedValue === undefined) {
        return false;
      }
    }
  }
  return getConflicts(state).size === 0;
};

/** Whether any cell has been placed at all (used to gate the "started" UI). */
export const getHasProgress = (state: AppState): boolean => {
  const data = state.sudoku.data;
  for (let r = 1; r <= 9; r++) {
    for (let c = 1; c <= 9; c++) {
      const cell = data[getRowId(r)][getColumnId(c)];
      if (
        !cell.preInstalled &&
        (cell.selectedValue !== undefined || cell.possibleValues.length > 0)
      ) {
        return true;
      }
    }
  }
  return false;
};
