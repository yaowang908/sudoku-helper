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
import { default as internalGenerateSudoku } from './generateSudoku';
import { validator_possibleValueChanged } from './validator';

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
      const data = { ...state.data };
      const prevPossibleValues =
        data[getRowId(row)][getColumnId(column)].possibleValues;
      // erase these values, the cells in same row and column need to be updated, so that they can have these values as possible values again

      data[getRowId(row)][getColumnId(column)].selectedValue = undefined;
      data[getRowId(row)][getColumnId(column)].crossedValues = [];
      data[getRowId(row)][getColumnId(column)].possibleValues = [];

      state.data = validator_possibleValueChanged(
        data,
        getRowId(row),
        getColumnId(column),
        [],
        prevPossibleValues
      );
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
