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

const SudokuGrid = () => {
  const sudoku = useSelector(selectSudoku);
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        width: 'auto',
        height: 'auto',
        gap: 0,
        maxWidth: '50vw',
      }}
    >
      {sudoku.map((grid, index) => (
        <SudokuCell key={`${grid.group}_${index}`} {...grid} />
      ))}
    </Box>
  );
};

export default SudokuGrid;
