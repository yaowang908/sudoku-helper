import { createSlice } from '@reduxjs/toolkit';
import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';
import { gridStructures } from '@/components/sudoku/gridStructures';

export interface SudokuCellState {
  group: number;
  row: number;
  column: number;
  crossedValues: number[];
  value: number | undefined;
}
export interface SudokuState {
  data: SudokuCellState[];
}

const initialState: SudokuState = {
  data: gridStructures,
};

export const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState,
  reducers: {
    setData(state, action) {
      // TODO:
      state.data = action.payload;
    },
    // Validate the sudoku grid, probably should be in a separate file
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

export const { setData } = sudokuSlice.actions;

export const selectSudoku = (state: AppState) => state.sudoku.data;
