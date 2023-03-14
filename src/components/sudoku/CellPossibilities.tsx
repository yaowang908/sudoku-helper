import React from 'react';
import { Box } from '@mui/material';
import { borderColor } from '../constants';

interface CellPossibilitiesProps {
  crossedValues?: number[];
  row: number;
  column: number;
}

const CellPossibilities: React.FC<CellPossibilitiesProps> = (
  props: CellPossibilitiesProps
) => {
  const { crossedValues, row, column } = props;

  const baseStyle = {
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    fontSize: '1.1vw',
  };

  const cellStyle = (representedValue: number) =>
    crossedValues?.includes(representedValue)
      ? {
          ...baseStyle,
          textDecoration: 'line-through',
        }
      : {
          ...baseStyle,
          textDecoration: 'none',
          color: borderColor,
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
