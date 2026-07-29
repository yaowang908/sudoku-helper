import React from 'react';
import { Box } from '@mui/material';
import SudokuCell from '@/components/sudoku/SudokuCell';
import {
  selectSudoku,
  getActiveCell,
  getHideCrossedValues,
  setActiveCell,
  computeConflicts,
  getRowId,
  getColumnId,
} from '@/store/sudokuSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useColorMode } from '@/hooks/useColorMode';
import { getTokens } from '@/theme';

const SudokuGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectSudoku);
  const activeCell = useAppSelector(getActiveCell);
  const hideCrossedValues = useAppSelector(getHideCrossedValues);
  const { mode } = useColorMode();
  const t = getTokens(mode);

  const conflicts = React.useMemo(() => computeConflicts(data), [data]);

  const activeInfo = React.useMemo(() => {
    if (!activeCell) return undefined;
    const cell = data[getRowId(activeCell.row)][getColumnId(activeCell.column)];
    return { group: cell.group, value: cell.selectedValue };
  }, [activeCell, data]);

  const handleSelect = React.useCallback(
    (row: number, column: number) => {
      dispatch(setActiveCell({ row, column }));
    },
    [dispatch]
  );

  const cells: JSX.Element[] = [];
  for (let r = 1; r <= 9; r++) {
    for (let c = 1; c <= 9; c++) {
      const cell = data[getRowId(r)][getColumnId(c)];
      const isSelected = activeCell?.row === r && activeCell?.column === c;
      const isPeer =
        !!activeCell &&
        !isSelected &&
        (activeCell.row === r ||
          activeCell.column === c ||
          activeInfo?.group === cell.group);
      const isSameNumber =
        !isSelected &&
        activeInfo?.value !== undefined &&
        cell.selectedValue === activeInfo.value;

      cells.push(
        <SudokuCell
          key={`${r}-${c}`}
          row={r}
          column={c}
          value={cell.selectedValue}
          given={!!cell.preInstalled}
          possibleValues={cell.possibleValues}
          crossedValues={cell.crossedValues}
          hideCrossedValues={hideCrossedValues}
          isSelected={isSelected}
          isPeer={isPeer}
          isSameNumber={isSameNumber}
          isConflict={conflicts.has(`${r}-${c}`)}
          mode={mode}
          onSelect={handleSelect}
        />
      );
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 'min(92vw, 560px)',
        aspectRatio: '1 / 1',
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gridTemplateRows: 'repeat(9, 1fr)',
        border: `3px solid ${t.boardLineStrong}`,
        borderRadius: '14px',
        overflow: 'hidden',
        backgroundColor: t.surface,
        boxShadow:
          mode === 'light'
            ? '0 20px 50px -20px rgba(30, 41, 59, 0.35)'
            : '0 20px 50px -20px rgba(0, 0, 0, 0.6)',
      }}
    >
      {cells}
    </Box>
  );
};

export default SudokuGrid;
