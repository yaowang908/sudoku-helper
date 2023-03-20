import React from 'react';
import { Box } from '@mui/material';
import { borderColor } from '../constants';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectSudokuCell } from '@/store/sudokuSlice';

interface CellPossibilitiesProps {
  row: number;
  column: number;
}

const CellPossibilities: React.FC<CellPossibilitiesProps> = (
  props: CellPossibilitiesProps
) => {
  const { row, column } = props;
  const cellState = useAppSelector(selectSudokuCell({ row, column }));

  const baseStyle = {
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    fontSize: '1.1vw',
  };

  const cellStyle = (representedValue: number) =>
    cellState?.crossedValues?.includes(representedValue)
      ? {
          ...baseStyle,
          textDecoration: 'line-through',
        }
      : {
          ...baseStyle,
          textDecoration: 'none',
          color: borderColor,
        };

  const handleClick =
    ({ row, column }: { row: number; column: number }) =>
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.type === 'click') {
        //left click
        //set selected value
      }
      if (event.type === 'contextmenu') {
        //right click
        // set crossed value
      }
    };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: '100%',
        height: '100%',
      }}
    >
      {Array(9)
        .fill(0)
        .map((_, index) => {
          const representedValue = index + 1;
          return (
            <Box key={`notes_${index}`} sx={cellStyle(representedValue)}>
              {representedValue}
            </Box>
          );
        })}
    </Box>
  );
};

export default CellPossibilities;
