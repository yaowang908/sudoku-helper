import React, { useState } from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import {
  borderColor,
  normalBorderThickness,
  thickBorderThickness,
  cellSizeCss,
} from '@/components/constants';
import CellPopup from '@/components/sudoku/CellPopup';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import {
  setSelectedValue,
  setPossibleValues,
  getRowId,
  getColumnId,
  setActiveCell,
  getActiveCell,
} from '@/store/sudokuSlice';
import CellPossibilities from './CellPossibilities';

interface SudokuCellProps {
  group: number;
  row: number;
  column: number;
  assertion?: number;
  notes?: number[];
}

const SudokuCell = (props: SudokuCellProps) => {
  const { assertion, notes, group, row, column } = props;

  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useAppDispatch();
  const activeCell = useAppSelector(getActiveCell);

  const handleCellClick = React.useCallback(() => {
    //* set active cell
    dispatch(setActiveCell({ row, column }));
  }, [row, column, dispatch]);

  const borderTopThicknessRows = [1, 4, 7];
  const borderTopThickness = borderTopThicknessRows.includes(row)
    ? thickBorderThickness
    : normalBorderThickness;
  const borderBottomThicknessRows = [3, 6, 9];
  const borderBottomThickness = borderBottomThicknessRows.includes(row)
    ? thickBorderThickness
    : normalBorderThickness;
  const borderLeftThicknessColumns = [1, 4, 7];
  const borderLeftThickness = borderLeftThicknessColumns.includes(column)
    ? thickBorderThickness
    : normalBorderThickness;
  const borderRightThicknessColumns = [3, 6, 9];
  const borderRightThickness = borderRightThicknessColumns.includes(column)
    ? thickBorderThickness
    : normalBorderThickness;

  return (
    <Box
      sx={{
        height: cellSizeCss,
        width: cellSizeCss,
        position: 'relative',
        borderTop: `${borderColor} ${borderTopThickness}px solid`,
        borderBottom: `${borderColor} ${borderBottomThickness}px solid`,
        borderLeft: `${borderColor} ${borderLeftThickness}px solid`,
        borderRight: `${borderColor} ${borderRightThickness}px solid`,
        backgroundColor:
          activeCell?.row === row || activeCell?.column === column
            ? '#d5f1fa'
            : 'white',
        cursor: 'pointer',
      }}
      onClick={handleCellClick}
    >
      <Typography
        variant='h5'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
      >
        {assertion ? assertion : ''}
      </Typography>
      <CellPossibilities row={row} column={column} />
    </Box>
  );
};

export default SudokuCell;
