import { PayloadAction } from '@reduxjs/toolkit';
import { rowsEnum, columnsEnum } from '@/components/constants';
import { SudokuState, SudokuCellState } from './sudokuSlice';
import validator from './validator';

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

const setCrossedValue = (
  state: SudokuState,
  action: PayloadAction<{
    rowId: rowsEnum;
    columnId: columnsEnum;
    crossedValue: number;
  }>
) => {
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
};

const setSelectedValue = (
  state: SudokuState,
  action: PayloadAction<{
    rowId: rowsEnum;
    columnId: columnsEnum;
    selectedValue: number;
  }>
) => {
  const intermediateState = updateSudokuCellState({
    state,
    rowId: action.payload.rowId,
    columnId: action.payload.columnId,
    update: { selectedValue: action.payload.selectedValue },
  });
  state.data = validator(
    intermediateState,
    action.payload.rowId,
    action.payload.columnId,
    action.payload.selectedValue
  );
};

const setValue = (
  state: SudokuState,
  action: PayloadAction<{
    rowId: rowsEnum;
    columnId: columnsEnum;
    value: number;
  }>
) => {
  state.data = updateSudokuCellState({
    state,
    rowId: action.payload.rowId,
    columnId: action.payload.columnId,
    update: { value: action.payload.value },
  });
};

export { setCrossedValue, setSelectedValue, setValue };
