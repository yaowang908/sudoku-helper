import React from 'react';
import { Box } from '@mui/material';
import { getTokens, ColorMode } from '@/theme';
import CellPossibilities from './CellPossibilities';

export interface SudokuCellProps {
  row: number;
  column: number;
  value?: number;
  given: boolean;
  possibleValues: number[];
  crossedValues: number[];
  hideCrossedValues: boolean;
  isSelected: boolean;
  isPeer: boolean;
  isSameNumber: boolean;
  isConflict: boolean;
  mode: ColorMode;
  onSelect: (row: number, column: number) => void;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  row,
  column,
  value,
  given,
  possibleValues,
  crossedValues,
  hideCrossedValues,
  isSelected,
  isPeer,
  isSameNumber,
  isConflict,
  mode,
  onSelect,
}) => {
  const t = getTokens(mode);

  const background = isConflict
    ? t.conflictBg
    : isSelected
    ? t.selectedBg
    : isSameNumber
    ? t.sameNumberBg
    : isPeer
    ? t.peerBg
    : t.surface;

  const numberColor = isConflict
    ? t.conflictText
    : given
    ? t.givenText
    : t.userText;

  // Draw only each cell's right + bottom lines; the board container's 3px
  // outer border covers the top/left edges. Rows/columns 3 & 6 sit on a 3x3
  // block boundary and get a thicker, darker separator; the last row/column
  // draw nothing so they don't double up with the container border.
  const isBlockRight = column === 3 || column === 6;
  const isBlockBottom = row === 3 || row === 6;
  const borderRight =
    column === 9
      ? 'none'
      : `${isBlockRight ? 2 : 1}px solid ${
          isBlockRight ? t.boardLineStrong : t.boardLine
        }`;
  const borderBottom =
    row === 9
      ? 'none'
      : `${isBlockBottom ? 2 : 1}px solid ${
          isBlockBottom ? t.boardLineStrong : t.boardLine
        }`;

  return (
    <Box
      onClick={() => onSelect(row, column)}
      sx={{
        position: 'relative',
        aspectRatio: '1 / 1',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: background,
        transition: 'background-color 0.12s ease',
        borderRight,
        borderBottom,
        boxShadow: isSelected ? `inset 0 0 0 2px ${t.candidateActive}` : 'none',
        '&:hover': {
          backgroundColor: isSelected ? t.selectedBg : t.peerBg,
        },
      }}
    >
      {value !== undefined ? (
        <Box
          component='span'
          sx={{
            fontSize: 'clamp(16px, 4.2vw, 30px)',
            fontWeight: given ? 700 : 600,
            color: numberColor,
            lineHeight: 1,
          }}
        >
          {value}
        </Box>
      ) : (
        <CellPossibilities
          possibleValues={possibleValues}
          crossedValues={crossedValues}
          hideCrossedValues={hideCrossedValues}
          mode={mode}
        />
      )}
    </Box>
  );
};

export default React.memo(SudokuCell);
