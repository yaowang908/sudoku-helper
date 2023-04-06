import { PayloadAction } from '@reduxjs/toolkit';
import { rowsEnum, columnsEnum } from '@/components/constants';
import { SudokuState, SudoKuDataType } from './sudokuSlice';
import { SudoKuLevel } from '@/components/constants';
import { gridStructures } from '@/components/sudoku/gridStructures';
import { getSudoku } from 'sudoku-gen';
import wholeStateValidator from './wholeStateValidator';

const getRowNumber = (rowId: string) => Number(rowId.split('_')[1]) - 1;
const getColumnNumber = (columnId: string) =>
  Number(columnId.split('_')[1]) - 1;

const convertStringToGridData = (s: string): SudoKuDataType | undefined => {
  const data = s.split('');
  if (data.length !== 81) return undefined;
  let gridData = JSON.parse(JSON.stringify(gridStructures));
  for (let rowId of Object.values(rowsEnum)) {
    for (let columnId of Object.values(columnsEnum)) {
      const targetValue =
        data[getRowNumber(rowId) * 9 + getColumnNumber(columnId)];
      if (targetValue === '-') {
        gridData[rowId][columnId].preInstalled = false;
        gridData[rowId][columnId].selectedValue = undefined;
      } else {
        gridData[rowId][columnId].selectedValue = Number(
          data[getRowNumber(rowId) * 9 + getColumnNumber(columnId)]
        );
        gridData[rowId][columnId].preInstalled = true;
      }
    }
  }
  return gridData;
};

const generateSudoku = (
  state: SudokuState,
  action: PayloadAction<{
    level: SudoKuLevel;
  }>
) => {
  const sudoku = getSudoku(action.payload.level);
  const data = convertStringToGridData(sudoku.puzzle);

  state.data = wholeStateValidator(data) || gridStructures;
};

export default generateSudoku;
