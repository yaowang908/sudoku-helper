import React from 'react';
import { useAppSelector } from '@/hooks/reduxHooks';
import { getPuzzleId, getIsSolved } from '@/store/sudokuSlice';

const TimerContext = React.createContext<number>(0);

export const formatTime = (total: number) => {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * Single source of truth for elapsed play time. Provided once near the top of
 * the game so the on-screen clock and the win screen always agree. Resets on a
 * new puzzle and freezes when the board is solved.
 */
export const GameTimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const puzzleId = useAppSelector(getPuzzleId);
  const solved = useAppSelector(getIsSolved);
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    setSeconds(0);
  }, [puzzleId]);

  React.useEffect(() => {
    if (puzzleId === 0 || solved) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [puzzleId, solved]);

  return (
    <TimerContext.Provider value={seconds}>{children}</TimerContext.Provider>
  );
};

export const useGameTimer = () => React.useContext(TimerContext);
