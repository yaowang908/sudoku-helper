import { PayloadAction } from '@reduxjs/toolkit';
import { rowsEnum, columnsEnum } from '@/components/constants';
import { SudokuState, SudokuCellState } from './sudokuSlice';
import {
  validator_selectedValueChanged,
  validator_possibleValueChanged,
} from './validator';

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

const setPossibleValue = (
  state: SudokuState,
  action: PayloadAction<{
    rowId: rowsEnum;
    columnId: columnsEnum;
    possibleValue: number;
  }>
) => {
  const intermediateState = updateSudokuCellState({
    state,
    rowId: action.payload.rowId,
    columnId: action.payload.columnId,
    update: {
      possibleValues: [
        ...(state.data[action.payload.rowId][action.payload.columnId]
          .possibleValues || []),
        action.payload.possibleValue,
      ],
    },
  });
  state.data = intermediateState;
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
  state.data = validator_selectedValueChanged(
    intermediateState,
    action.payload.rowId,
    action.payload.columnId,
    action.payload.selectedValue,
    state?.data[action.payload.rowId][action.payload.columnId]?.selectedValue
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
    update: { selectedValue: action.payload.value },
  });
};

export { setCrossedValue, setSelectedValue, setValue, setPossibleValue };
