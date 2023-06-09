import { Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';
import SudokuCell from '@/components/sudoku/SudokuCell';
import { gridStructures } from '@/components/sudoku/gridStructures';
import { selectSudoku } from '@/store/sudokuSlice';
import { useSelector } from 'react-redux';

interface GridStructure {
  group: number;
  row: number;
  column: number;
}

const SudokuGrid: React.FC = () => {
  const sudoku = useSelector(selectSudoku);

  const getCells = React.useMemo(() => {
    const cells: JSX.Element[] = [];

    Object.entries(gridStructures).map(([rowId, value]) => {
      Object.entries(value).map(([columnId, cell]) => {
        cells.push(
          <SudokuCell key={`${cell.group}_${rowId}_${columnId}`} {...cell} />
        );
      });
    });

    return cells;
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'flex-start',
        width: '100%',
        marginRight: '1rem',
        '@media (max-width: 1000px)': {
          marginRight: '0',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          width: 'auto',
          height: 'auto',
          gap: 0,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {getCells}
      </Box>
    </Box>
  );
};

export default SudokuGrid;
