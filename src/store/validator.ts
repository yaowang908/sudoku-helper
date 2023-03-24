import { PayloadAction } from '@reduxjs/toolkit';
import { rowsEnum, columnsEnum } from '@/components/constants';
import {
  SudoKuDataType,
  SudokuCellState,
  getRowId,
  getColumnId,
} from './sudokuSlice';

const validator = (
  data: SudoKuDataType,
  rowId: rowsEnum,
  columnId: columnsEnum,
  selectedValue: number,
  prevSelectedValue?: number
): SudoKuDataType => {
  //once set selected value, check row and column and group, to make sure selected value is not in the same row, column or group
  let result = { ...data };

  if (selectedValue === prevSelectedValue) return result;

  const updateCrossedValues = (
    crossedValues: number[],
    selectedValue: number,
    prevSelectedValue?: number
  ) => {
    let newCrossedValues = [...crossedValues, selectedValue];

    if (prevSelectedValue !== undefined) {
      newCrossedValues = newCrossedValues.filter(
        (value) => value !== prevSelectedValue
      );
    }

    return Array.from(new Set(newCrossedValues));
  };

  // * check the same row
  for (let j = 1; j < 10; j++) {
    const column = getColumnId(j);
    if (column === columnId) continue;

    result = {
      ...result,
      [rowId]: {
        ...result[rowId],
        [column]: {
          ...result[rowId][column],
          crossedValues: updateCrossedValues(
            result[rowId][column].crossedValues,
            selectedValue,
            prevSelectedValue
          ),
        },
      },
    };
  }

  // * check the same column
  for (let i = 1; i < 10; i++) {
    const row = getRowId(i);
    if (row === rowId) continue;

    result = {
      ...result,
      [row]: {
        ...result[row],
        [columnId]: {
          ...result[row][columnId],
          crossedValues: updateCrossedValues(
            result[row][columnId].crossedValues,
            selectedValue,
            prevSelectedValue
          ),
        },
      },
    };
  }

  // * check the same group
  const group = result[rowId][columnId].group;
  for (let i = 1; i < 10; i++) {
    const row = getRowId(i);
    for (let j = 1; j < 10; j++) {
      const column = getColumnId(j);
      if (column === columnId && row === rowId) continue;
      if (result[row][column].group === group) {
        result = {
          ...result,
          [row]: {
            ...result[row],
            [column]: {
              ...result[row][column],
              crossedValues: updateCrossedValues(
                result[row][column].crossedValues,
                selectedValue,
                prevSelectedValue
              ),
            },
          },
        };
      }
    }
  }

  return result;
};

export default validator;
