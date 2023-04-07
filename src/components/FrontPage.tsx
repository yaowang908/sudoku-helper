import React from 'react';
import Header from '@/components/Header';
import { Container, Box } from '@mui/material';
import SudokuGrid from '@/components/sudoku/SudokuGrid';
import Operations from './Operations/Operations';

const FrontPage = () => {
  return (
    <Container sx={{ overflow: 'hidden', height: '100vh' }}>
      <Header />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          '@media (max-width: 1000px)': {
            gridTemplateColumns: '1fr',
          },
        }}
      >
        <SudokuGrid />
        <Operations />
      </Box>
    </Container>
  );
};

export default FrontPage;
