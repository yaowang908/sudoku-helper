import React from 'react';
import { Box } from '@mui/material';
import CellPossibilities from './CellPossibilities';

interface CellPopupProps {
  column: number;
  row: number;
  onClose?: () => void;
  onValueClick: (value: number) => void;
  onValueRightClick: (value: number) => void;
}

const CellPopup: React.FC<CellPopupProps> = ({
  column,
  row,
  onClose,
  onValueClick,
  onValueRightClick,
}) => {
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClose && onClose();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        cursor: 'pointer',
      }}
      onClick={handleClickOutside}
    >
      <Box
        sx={{
          width: '25%',
          height: '25%',
          backgroundColor: 'white',
          borderRadius: '5px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CellPossibilities
          column={column}
          row={row}
          onValueClick={onValueClick}
          onValueRightClick={onValueRightClick}
        />
      </Box>
    </Box>
  );
};

export default CellPopup;
