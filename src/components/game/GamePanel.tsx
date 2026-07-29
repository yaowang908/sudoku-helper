import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import {
  OperationMode,
  getOperationMode,
  setOperationMode,
  getDigitCounts,
  getHideCrossedValues,
  setHideCrossedValues,
  getDifficulty,
  getPuzzleId,
} from '@/store/sudokuSlice';
import { useSudokuInput } from '@/hooks/useSudokuInput';
import { useColorMode } from '@/hooks/useColorMode';
import { getTokens } from '@/theme';
import Timer from './Timer';

const ModeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(getOperationMode);

  const options: { value: OperationMode; label: string; icon: JSX.Element }[] = [
    { value: OperationMode.EDIT, label: 'Fill', icon: <EditRoundedIcon fontSize='small' /> },
    { value: OperationMode.NOTE, label: 'Notes', icon: <BorderColorRoundedIcon fontSize='small' /> },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0.5,
        p: 0.5,
        borderRadius: 999,
        bgcolor: 'action.hover',
      }}
    >
      {options.map((opt) => {
        const active = mode === opt.value;
        return (
          <Button
            key={opt.value}
            onClick={() => dispatch(setOperationMode(opt.value))}
            startIcon={opt.icon}
            disableRipple
            sx={{
              borderRadius: 999,
              py: 1,
              color: active ? 'primary.contrastText' : 'text.secondary',
              bgcolor: active ? 'primary.main' : 'transparent',
              boxShadow: active ? 2 : 'none',
              '&:hover': { bgcolor: active ? 'primary.dark' : 'action.selected' },
            }}
          >
            {opt.label}
          </Button>
        );
      })}
    </Box>
  );
};

const GamePanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { inputNumber, erase } = useSudokuInput();
  const counts = useAppSelector(getDigitCounts);
  const hideCrossed = useAppSelector(getHideCrossedValues);
  const difficulty = useAppSelector(getDifficulty);
  const puzzleId = useAppSelector(getPuzzleId);
  const gameActive = puzzleId > 0;
  const { mode } = useColorMode();
  const t = getTokens(mode);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Timer />
        {difficulty && (
          <Box
            sx={{
              textTransform: 'capitalize',
              fontWeight: 700,
              fontSize: '0.8rem',
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
            }}
          >
            {difficulty}
          </Box>
        )}
      </Box>

      <ModeToggle />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
        }}
      >
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
          const remaining = 9 - counts[n];
          const done = remaining <= 0;
          return (
            <Button
              key={n}
              onClick={() => inputNumber(n)}
              disabled={done}
              sx={{
                position: 'relative',
                aspectRatio: '1 / 1',
                minWidth: 0,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                color: 'text.primary',
                fontSize: 'clamp(20px, 5vw, 28px)',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: 'primary.main',
                },
                '&.Mui-disabled': { opacity: 0.35 },
              }}
            >
              {n}
              {gameActive && (
                <Box
                  component='span'
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 6,
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    color: done ? t.candidateActive : 'text.secondary',
                  }}
                >
                  {done ? '✓' : remaining}
                </Box>
              )}
            </Button>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          onClick={erase}
          startIcon={<BackspaceRoundedIcon />}
          variant='outlined'
          color='warning'
          sx={{ flex: 1, py: 1.1, borderRadius: 3 }}
        >
          Erase
        </Button>
        <Button
          onClick={() => dispatch(setHideCrossedValues(!hideCrossed))}
          startIcon={
            hideCrossed ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />
          }
          variant='outlined'
          color='inherit'
          sx={{ flex: 1.4, py: 1.1, borderRadius: 3, color: 'text.secondary' }}
        >
          {hideCrossed ? 'Show hints' : 'Hide hints'}
        </Button>
      </Box>

      <Typography
        variant='caption'
        sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.5 }}
      >
        Tip: pick a cell, then use the pad or your keyboard (1-9, arrows to
        move). The faint numbers are the candidates still possible for each
        cell — hide them for a classic, unassisted board.
      </Typography>
    </Paper>
  );
};

export default GamePanel;
