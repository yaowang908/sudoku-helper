import React from 'react';
import { Box } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useGameTimer, formatTime } from '@/hooks/useGameTimer';

/** Small clock display driven by the shared GameTimerProvider. */
const Timer: React.FC = () => {
  const seconds = useGameTimer();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 700,
        fontSize: '1.1rem',
        color: 'text.primary',
      }}
    >
      <AccessTimeRoundedIcon
        sx={{ fontSize: '1.2rem', color: 'text.secondary' }}
      />
      {formatTime(seconds)}
    </Box>
  );
};

export default Timer;
