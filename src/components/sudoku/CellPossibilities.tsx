import React from 'react';
import { Box } from '@mui/material';
import { getTokens, ColorMode } from '@/theme';

interface CellPossibilitiesProps {
  possibleValues: number[];
  crossedValues: number[];
  hideCrossedValues: boolean;
  mode: ColorMode;
}

/**
 * Presentational 3x3 grid of candidate pencil-marks shown inside an empty
 * cell. It surfaces the app's core "helper" feature: values already eliminated
 * by peers are struck through, while manually noted candidates are highlighted.
 */
const CellPossibilities: React.FC<CellPossibilitiesProps> = ({
  possibleValues,
  crossedValues,
  hideCrossedValues,
  mode,
}) => {
  const t = getTokens(mode);
  const hasNotes = possibleValues.length > 0;

  // The helper's auto-candidates can be switched off for a "clean board"
  // solving experience. The player's own pencil notes always stay visible.
  if (hideCrossedValues && !hasNotes) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: '100%',
        height: '100%',
        placeItems: 'center',
      }}
    >
      {Array.from({ length: 9 }, (_, i) => i + 1).map((value) => {
        const isNoted = possibleValues.includes(value);
        const isCrossed = crossedValues.includes(value);

        // When the user has pencilled notes, only those notes are relevant.
        let visible = true;
        let struck = false;
        let color: string = t.candidate;
        let weight = 400;

        if (hasNotes) {
          visible = isNoted;
          color = t.candidateActive;
          weight = 700;
        } else if (isCrossed) {
          visible = !hideCrossedValues;
          struck = true;
          color = t.crossed;
        }

        return (
          <Box
            key={value}
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: '100%',
              height: '100%',
              fontSize: 'clamp(9px, 1.8vw, 15px)',
              lineHeight: 1,
              fontWeight: weight,
              color,
              opacity: visible ? 1 : 0,
              textDecoration: struck ? 'line-through' : 'none',
              transition: 'color 0.15s ease, opacity 0.15s ease',
            }}
          >
            {value}
          </Box>
        );
      })}
    </Box>
  );
};

export default CellPossibilities;
