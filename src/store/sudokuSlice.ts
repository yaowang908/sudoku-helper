import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';
import { gridStructures } from '@/components/sudoku/gridStructures';
import { rowsEnum, columnsEnum } from '@/components/constants';
import {
  setCrossedValue as internalSetCrossedValue,
  setSelectedValue as internalSetSelectedValue,
  setPossibleValue as internalSetPossibleValue,
  setValue as internalSetValue,
} from './reducers';

export interface SudokuCellState {
  group: number;
  row: number;
  column: number;
  selectedValue?: number;
  crossedValues: number[];
  possibleValues: number[];
  value: number | undefined;
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
}

const initialState: SudokuState = {
  data: gridStructures,
  hideCrossedValues: false,
  operationMode: OperationMode.EDIT,
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
    setOperationMode: (state, action: PayloadAction<OperationMode>) => {
      state.operationMode = action.payload;
    },
    reset: () => initialState,
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
  setOperationMode,
  reset,
} = sudokuSlice.actions;

export const getRowId = (row: number) => `row_${row}` as rowsEnum;
export const getColumnId = (column: number) =>
  `column_${column}` as columnsEnum;
export const getHideCrossedValues = (state: AppState) =>
  state.sudoku.hideCrossedValues;
export const selectSudoku = (state: AppState) => state.sudoku.data;
export const selectSudokuCell =
  ({ row, column }: { row: number; column: number }) =>
  (state: AppState) =>
    state.sudoku.data?.[getRowId(row)]?.[getColumnId(column)];
export const getActiveCell = (state: AppState) => state.sudoku.activeCell;
export const getOperationMode = (state: AppState) => state.sudoku.operationMode;
