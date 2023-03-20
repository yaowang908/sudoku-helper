import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { sudokuSlice } from './sudokuSlice';
import { createWrapper } from 'next-redux-wrapper';

const makeStore = () =>
  configureStore({
    reducer: {
      sudoku: sudokuSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;

export const wrapper = createWrapper(makeStore, { debug: true });
