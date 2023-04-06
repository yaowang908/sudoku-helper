import { PayloadAction } from '@reduxjs/toolkit';
import { rowsEnum, columnsEnum } from '@/components/constants';
import {
  SudoKuDataType,
  SudokuCellState,
  getRowId,
  getColumnId,
} from './sudokuSlice';

const wholeStateValidator = (
  data: SudoKuDataType | undefined
): SudoKuDataType | undefined => {
  if (!data) return undefined;
  // loop through all the cells, and check if the selected value is valid
  // and update the crossed values
  let result = JSON.parse(JSON.stringify(data));

  for (let rowId of Object.values(rowsEnum)) {
    for (let columnId of Object.values(columnsEnum)) {
      const selectedValue = data[rowId][columnId].selectedValue;
      if (selectedValue === undefined) continue;

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
              crossedValues: result[rowId][column].crossedValues.includes(
                selectedValue
              )
                ? result[rowId][column].crossedValues
                : [...result[rowId][column].crossedValues, selectedValue],
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
              crossedValues: result[row][columnId].crossedValues.includes(
                selectedValue
              )
                ? result[row][columnId].crossedValues
                : [...result[row][columnId].crossedValues, selectedValue],
            },
          },
        };
      }

      // * check the same group
      const group = data[rowId][columnId].group;
      for (let i = 1; i < 10; i++) {
        const row = getRowId(i);
        for (let j = 1; j < 10; j++) {
          const column = getColumnId(j);
          if (data[row][column].group !== group) continue;
          if (row === rowId && column === columnId) continue;

          result = {
            ...result,
            [row]: {
              ...result[row],
              [column]: {
                ...result[row][column],
                crossedValues: result[row][column].crossedValues.includes(
                  selectedValue
                )
                  ? result[row][column].crossedValues
                  : [...result[row][column].crossedValues, selectedValue],
              },
            },
          };
        }
      }
    }
  }
  return result;
};

export default wholeStateValidator;
