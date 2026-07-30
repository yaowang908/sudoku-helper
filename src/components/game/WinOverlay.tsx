import React from 'react';
import { Box, Button, Typography, Fade } from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import {
  getIsSolved,
  getPuzzleId,
  getDifficulty,
  generateSudoku,
} from '@/store/sudokuSlice';
import { useGameTimer, formatTime } from '@/hooks/useGameTimer';
import { SudoKuLevel } from '@/components/constants';

const confettiColors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const Confetti: React.FC = () => (
  <Box
    aria-hidden
    sx={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      '@keyframes fall': {
        '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: 1 },
        '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: 0 },
      },
    }}
  >
    {Array.from({ length: 60 }).map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          top: 0,
          left: `${(i * 37) % 100}%`,
          width: 8,
          height: 14,
          borderRadius: '2px',
          backgroundColor: confettiColors[i % confettiColors.length],
          animation: `fall ${2.5 + (i % 5) * 0.6}s linear ${
            (i % 10) * 0.25
          }s infinite`,
        }}
      />
    ))}
  </Box>
);

const WinOverlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const solved = useAppSelector(getIsSolved);
  const puzzleId = useAppSelector(getPuzzleId);
  const difficulty = useAppSelector(getDifficulty);
  const seconds = useGameTimer();

  const [dismissed, setDismissed] = React.useState(false);
  React.useEffect(() => {
    setDismissed(false);
  }, [puzzleId]);

  const show = solved && puzzleId > 0 && !dismissed;

  return (
    <Fade in={show} unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1300,
          display: 'grid',
          placeItems: 'center',
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          p: 2,
        }}
        onClick={() => setDismissed(true)}
      >
        <Confetti />
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'relative',
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 5,
            px: { xs: 3, sm: 5 },
            py: { xs: 4, sm: 5 },
            maxWidth: 380,
            width: '100%',
            boxShadow: 24,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              mx: 'auto',
              mb: 2,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              color: '#fff',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            }}
          >
            <EmojiEventsRoundedIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant='h4' sx={{ mb: 0.5 }}>
            Puzzle solved!
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 2.5 }}>
            {difficulty ? (
              <Box component='span' sx={{ textTransform: 'capitalize' }}>
                {difficulty}
              </Box>
            ) : (
              'Sudoku'
            )}{' '}
            completed in <strong>{formatTime(seconds)}</strong>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button variant='outlined' onClick={() => setDismissed(true)}>
              Review board
            </Button>
            <Button
              variant='contained'
              onClick={() =>
                dispatch(
                  generateSudoku({
                    level: difficulty ?? SudoKuLevel.easy,
                  })
                )
              }
            >
              Play again
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default WinOverlay;
