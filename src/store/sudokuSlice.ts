import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';
import { gridStructures } from '@/components/sudoku/gridStructures';
import { rowsEnum, columnsEnum } from '@/components/constants';

export interface SudokuCellState {
  group: number;
  row: number;
  column: number;
  selectedValue?: number;
  crossedValues: number[];
  value: number | undefined;
}

export type SudoKuDataType = {
  [key in rowsEnum]: { [key in columnsEnum]: SudokuCellState };
};
export interface SudokuState {
  data: SudoKuDataType;
}

const initialState: SudokuState = {
  data: gridStructures,
};

const updateSudokuCellState = ({
  state,
  rowId,
  columnId,
  update,
}: {
  state: SudokuState;
  rowId: rowsEnum;
  columnId: columnsEnum;
  update: Partial<SudokuCellState>;
}) => ({
  ...state.data,
  [rowId]: {
    ...state.data[rowId],
    [columnId]: {
      ...state.data[rowId][columnId],
      ...update,
    },
  },
});

export const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    setCrossedValue(
      state,
      action: PayloadAction<{
        rowId: rowsEnum;
        columnId: columnsEnum;
        crossedValue: number;
      }>
    ) {
      state.data = updateSudokuCellState({
        state,
        rowId: action.payload.rowId,
        columnId: action.payload.columnId,
        update: {
          crossedValues: [
            ...state.data[action.payload.rowId][action.payload.columnId]
              .crossedValues,
            action.payload.crossedValue,
          ],
        },
      });
    },
    setSelectedValue(
      state,
      action: PayloadAction<{
        rowId: rowsEnum;
        columnId: columnsEnum;
        selectedValue: number;
      }>
    ) {
      state.data = updateSudokuCellState({
        state,
        rowId: action.payload.rowId,
        columnId: action.payload.columnId,
        update: { selectedValue: action.payload.selectedValue },
      });
    },
    setValue(
      state,
      action: PayloadAction<{
        rowId: rowsEnum;
        columnId: columnsEnum;
        value: number;
      }>
    ) {
      state.data = updateSudokuCellState({
        state,
        rowId: action.payload.rowId,
        columnId: action.payload.columnId,
        update: { value: action.payload.value },
      });
    },
    //TODO: Validate the sudoku grid, probably should be in a separate file
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

export const { setCrossedValue, setSelectedValue, setValue } =
  sudokuSlice.actions;

export const getRowId = (row: number) => `row_${row}` as rowsEnum;
export const getColumnId = (column: number) =>
  `column_${column}` as columnsEnum;

export const selectSudoku = (state: AppState) => state.sudoku.data;
export const selectSudokuCell =
  ({ row, column }: { row: number; column: number }) =>
  (state: AppState) =>
    state.sudoku.data?.[getRowId(row)]?.[getColumnId(column)];
