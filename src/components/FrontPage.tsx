import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Header from '@/components/Header';
import SudokuGrid from '@/components/sudoku/SudokuGrid';
import GamePanel from '@/components/game/GamePanel';
import WinOverlay from '@/components/game/WinOverlay';
import { GameTimerProvider } from '@/hooks/useGameTimer';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useSudokuInput } from '@/hooks/useSudokuInput';
import {
  moveActiveCell,
  getPuzzleId,
  generateSudoku,
} from '@/store/sudokuSlice';
import { SudoKuLevel } from '@/components/constants';

const StartOverlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const levels: SudoKuLevel[] = [
    SudoKuLevel.easy,
    SudoKuLevel.medium,
    SudoKuLevel.hard,
    SudoKuLevel.expert,
  ];
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '14px',
        backdropFilter: 'blur(3px)',
        backgroundColor: 'rgba(255,255,255,0.35)',
        zIndex: 5,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 4,
          p: 3,
          boxShadow: 6,
          mx: 2,
        }}
      >
        <Typography variant='h6' sx={{ mb: 0.5 }}>
          Ready to play?
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
          Pick a difficulty to generate a puzzle.
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
          }}
        >
          {levels.map((level) => (
            <Button
              key={level}
              variant={level === SudoKuLevel.easy ? 'contained' : 'outlined'}
              onClick={() => dispatch(generateSudoku({ level }))}
              sx={{ textTransform: 'capitalize' }}
            >
              {level}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const FrontPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const puzzleId = useAppSelector(getPuzzleId);
  const { inputNumber, erase } = useSudokuInput();

  // Keyboard controls: arrows move the selection, 1-9 enter values / notes,
  // Backspace / Delete / 0 clear the active cell.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          dispatch(moveActiveCell('up'));
          return;
        case 'ArrowDown':
          e.preventDefault();
          dispatch(moveActiveCell('down'));
          return;
        case 'ArrowLeft':
          e.preventDefault();
          dispatch(moveActiveCell('left'));
          return;
        case 'ArrowRight':
          e.preventDefault();
          dispatch(moveActiveCell('right'));
          return;
        case 'Backspace':
        case 'Delete':
        case '0':
          e.preventDefault();
          erase();
          return;
      }

      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        inputNumber(Number(e.key));
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch, inputNumber, erase]);

  return (
    <GameTimerProvider>
      <Header />
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2.5, md: 4 },
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 320px' },
          alignItems: 'start',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SudokuGrid />
          {puzzleId === 0 && <StartOverlay />}
        </Box>
        <GamePanel />
      </Box>
      <WinOverlay />
    </GameTimerProvider>
  );
};

export default FrontPage;
