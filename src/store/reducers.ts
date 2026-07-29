import { PayloadAction } from '@reduxjs/toolkit';
import { rowsEnum, columnsEnum } from '@/components/constants';
import { SudokuState, SudokuCellState } from './sudokuSlice';
import recomputeCrossedValues from './recompute';

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
  const { rowId, columnId, possibleValue } = action.payload;
  const cell = state.data[rowId][columnId];

  // Notes only make sense on empty, non-given cells.
  if (cell.preInstalled || cell.selectedValue !== undefined) return;

  const existing = cell.possibleValues || [];
  // Toggle the note on/off.
  const possibleValues = existing.includes(possibleValue)
    ? existing.filter((v) => v !== possibleValue)
    : [...existing, possibleValue].sort((a, b) => a - b);

  state.data = updateSudokuCellState({
    state,
    rowId,
    columnId,
    update: { possibleValues },
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
  const { rowId, columnId, selectedValue } = action.payload;

  // A pre-installed (given) cell can never be overwritten.
  if (state.data[rowId][columnId].preInstalled) return;

  const current = state.data[rowId][columnId].selectedValue;
  // Clicking the same value again toggles it off.
  const nextValue = current === selectedValue ? undefined : selectedValue;

  const intermediateState = updateSudokuCellState({
    state,
    rowId,
    columnId,
    // Placing a confirmed value clears that cell's pencil-mark notes.
    update: { selectedValue: nextValue, possibleValues: [] },
  });

  state.data = recomputeCrossedValues(intermediateState);
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
