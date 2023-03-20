import React from 'react';
import { Box } from '@mui/material';
import { borderColor } from '../constants';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import {
  selectSudokuCell,
  setCrossedValue,
  setSelectedValue,
  getRowId,
  getColumnId,
} from '@/store/sudokuSlice';

interface CellPossibilitiesProps {
  row: number;
  column: number;
}

const CellPossibilities: React.FC<CellPossibilitiesProps> = (
  props: CellPossibilitiesProps
) => {
  const { row, column } = props;
  const cellState = useAppSelector(selectSudokuCell({ row, column }));
  const dispatch = useAppDispatch();

  const cellStyle = React.useCallback(
    (representedValue: number) => {
      const baseStyle: { [key: string]: string } = {
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        fontSize: '1.1vw',
      };
      if (cellState?.crossedValues?.includes(representedValue)) {
        baseStyle['textDecoration'] = 'line-through';
      } else {
        baseStyle['textDecoration'] = 'none';
        baseStyle['color'] = borderColor;
      }

      if (cellState?.selectedValue === representedValue) {
        baseStyle['fontWeight'] = 'bold';
        baseStyle['color'] = 'orange';
      }

      return baseStyle;
    },
    [cellState]
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.type === 'click') {
        //left click
        //set selected value
        event.preventDefault();
        dispatch(
          setSelectedValue({
            rowId: getRowId(row),
            columnId: getColumnId(column),
            selectedValue: Number(event?.currentTarget?.textContent),
          })
        );
      }
      if (event.type === 'contextmenu') {
        //right click
        // set crossed value
        event.preventDefault();
        dispatch(
          setCrossedValue({
            rowId: getRowId(row),
            columnId: getColumnId(column),
            crossedValue: Number(event?.currentTarget?.textContent),
          })
        );
      }
    },
    [dispatch, row, column]
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: '100%',
        height: '100%',
      }}
    >
      {Array(9)
        .fill(0)
        .map((_, index) => {
          const representedValue = index + 1;
          return (
            <Box
              key={`notes_${index}`}
              sx={cellStyle(representedValue)}
              onClick={handleClick}
              onContextMenu={handleClick}
            >
              {representedValue}
            </Box>
          );
        })}
    </Box>
  );
};

export default CellPossibilities;
