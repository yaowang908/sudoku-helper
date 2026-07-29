import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import {
  getActiveCell,
  getOperationMode,
  getRowId,
  getColumnId,
  setSelectedValue,
  setPossibleValues,
  eraseCell,
  selectSudoku,
  OperationMode,
} from '@/store/sudokuSlice';

/**
 * Central place for turning a "number 1-9" / "erase" intent into the right
 * dispatch, honoring the current Edit/Note mode. Shared by the on-screen
 * number pad and the physical keyboard so both behave identically.
 */
export const useSudokuInput = () => {
  const dispatch = useAppDispatch();
  const activeCell = useAppSelector(getActiveCell);
  const operationMode = useAppSelector(getOperationMode);
  const data = useAppSelector(selectSudoku);

  const activeIsGiven = React.useMemo(() => {
    if (!activeCell) return false;
    return !!data[getRowId(activeCell.row)][getColumnId(activeCell.column)]
      .preInstalled;
  }, [activeCell, data]);

  const inputNumber = React.useCallback(
    (value: number, mode?: OperationMode) => {
      if (!activeCell || activeIsGiven) return;
      const effectiveMode = mode ?? operationMode;
      const payload = {
        rowId: getRowId(activeCell.row),
        columnId: getColumnId(activeCell.column),
      };
      if (effectiveMode === OperationMode.NOTE) {
        dispatch(setPossibleValues({ ...payload, possibleValue: value }));
      } else {
        dispatch(setSelectedValue({ ...payload, selectedValue: value }));
      }
    },
    [activeCell, activeIsGiven, operationMode, dispatch]
  );

  const erase = React.useCallback(() => {
    if (!activeCell || activeIsGiven) return;
    dispatch(eraseCell(activeCell));
  }, [activeCell, activeIsGiven, dispatch]);

  return { inputNumber, erase, hasActiveCell: !!activeCell, activeIsGiven };
};
