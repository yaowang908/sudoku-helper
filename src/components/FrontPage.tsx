import React from 'react';
import Header from '@/components/Header';
import { Container } from '@mui/material';
import SudokuGrid from '@/components/sudoku/SudokuGrid';

const FrontPage = () => {
  return (
    <Container>
      <Header />
      <SudokuGrid />
    </Container>
  );
};

export default FrontPage;
