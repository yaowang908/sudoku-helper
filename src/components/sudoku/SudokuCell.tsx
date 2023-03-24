import React, { useState } from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import {
  borderColor,
  normalBorderThickness,
  thickBorderThickness,
  cellSize,
} from '@/components/constants';
import CellPopup from '@/components/sudoku/CellPopup';
import { useAppDispatch } from '@/hooks/reduxHooks';
import {
  setSelectedValue,
  setCrossedValue,
  getRowId,
  getColumnId,
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

  const handleCellClick = () => {
    console.log('outside click');
    setShowPopup(true);
  };

  const handlePopupValueClick = (value: number) => {
    // Dispatch setSelectedValue action
    setShowPopup(false);
    dispatch(
      setSelectedValue({
        rowId: getRowId(row),
        columnId: getColumnId(column),
        selectedValue: value,
      })
    );
  };

  const handlePopupValueRightClick = (value: number) => {
    // Dispatch setCrossedValue action
    setShowPopup(false);
    dispatch(
      setCrossedValue({
        rowId: getRowId(row),
        columnId: getColumnId(column),
        crossedValue: value,
      })
    );
  };

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
      {showPopup && (
        <CellPopup
          row={row}
          column={column}
          onClose={() => setShowPopup(false)}
          onValueClick={handlePopupValueClick}
          onValueRightClick={handlePopupValueRightClick}
        />
      )}
    </Box>
  );
};

export default SudokuCell;
