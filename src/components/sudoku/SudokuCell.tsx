import React from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import {
  borderColor,
  normalBorderThickness,
  thickBorderThickness,
  cellSize,
} from '@/components/constants';
import CellPossibilities from '@/components/sudoku/CellPossibilities';

interface SudokuCellProps {
  group: number;
  row: number;
  column: number;
  assertion?: number;
  notes?: number[];
}

const SudokuCell = (props: SudokuCellProps) => {
  const { assertion, notes, group, row, column } = props;

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
        height: cellSize,
        width: cellSize,
        position: 'relative',
        borderTop: `${borderColor} ${borderTopThickness}px solid`,
        borderBottom: `${borderColor} ${borderBottomThickness}px solid`,
        borderLeft: `${borderColor} ${borderLeftThickness}px solid`,
        borderRight: `${borderColor} ${borderRightThickness}px solid`,
      }}
    >
      <CellPossibilities row={row} column={column} />
      {/* <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
      >
        <Typography variant='h5'>{assertion ? assertion : column}</Typography>
      </Box> */}
    </Box>
  );
};

export default SudokuCell;
