import React from 'react';
import { Box } from '@mui/material';
import { borderColor } from '../constants';
import { useAppSelector } from '@/hooks/reduxHooks';
import {
  selectSudokuCell,
  getHideCrossedValues,
  setCrossedValue,
  setSelectedValue,
  getRowId,
  getColumnId,
} from '@/store/sudokuSlice';

interface CellPossibilitiesProps {
  row: number;
  column: number;
  onValueClick?: (value: number) => void;
  onValueRightClick?: (value: number) => void;
}

const CellPossibilities: React.FC<CellPossibilitiesProps> = (
  props: CellPossibilitiesProps
) => {
  const { row, column, onValueClick, onValueRightClick } = props;
  const cellState = useAppSelector(selectSudokuCell({ row, column }));
  const hideCrossedValues = useAppSelector(getHideCrossedValues);

  const isDisplayOnly = !onValueClick && !onValueRightClick;
  const selectedValue = cellState?.selectedValue;
  const displaySelectedValue = isDisplayOnly && selectedValue !== undefined;
  const possibleValues = cellState?.possibleValues;
  const crossedValues = cellState?.crossedValues;

  const cellStyle = (representedValue: number) => {
    const baseStyle: { [key: string]: string } = {
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      fontSize: 'min(1.2em, 5vw)',
    };
    if (!isDisplayOnly) {
      baseStyle['fontSize'] = 'min(3em, 10vw)';
    }
    if (displaySelectedValue) {
      baseStyle['fontSize'] = 'min(2em, 5vw)';
    }
    if (crossedValues?.includes(representedValue)) {
      if (!isDisplayOnly) {
        baseStyle['display'] = 'none'; // hide crossed values
      }
      if (hideCrossedValues) {
        baseStyle['display'] = 'none';
      }
      if (possibleValues.length > 0) {
        baseStyle['display'] = 'none';
      }
      baseStyle['textDecoration'] = 'line-through';
      baseStyle['color'] = borderColor;
    } else if (cellState?.selectedValue === representedValue) {
      baseStyle['fontWeight'] = 'bold';
      baseStyle['color'] = 'orange';
    } else if (possibleValues?.includes(representedValue)) {
      // This is a possible value
      baseStyle['color'] = '#175a9d';
    } else {
      baseStyle['textDecoration'] = 'none';
      baseStyle['color'] = borderColor;
      isDisplayOnly ? (baseStyle['display'] = 'none') : '';
    }

    return baseStyle;
  };

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.type === 'click') {
        //left click
        //set selected value
        event.preventDefault();
        onValueClick && onValueClick(Number(event?.currentTarget?.textContent));
      }
      if (event.type === 'contextmenu') {
        //right click
        // set crossed value
        event.preventDefault();
        onValueRightClick &&
          onValueRightClick(Number(event?.currentTarget?.textContent));
      }
    },
    [onValueClick, onValueRightClick]
  );

  const generateCells = (): JSX.Element[] => {
    if (displaySelectedValue) {
      return [
        <Box
          key={`notes_${selectedValue}`}
          sx={cellStyle(selectedValue)}
          onClick={handleClick}
          onContextMenu={handleClick}
        >
          {selectedValue}
        </Box>,
      ];
    }
    return Array(9)
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
      });
  };

  const containerStyle = () => {
    const baseStyle: { [key: string]: string } = {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      width: '100%',
      height: '100%',
    };
    if (displaySelectedValue) {
      baseStyle['gridTemplateColumns'] = '1fr';
      baseStyle['gridTemplateRows'] = '1fr';
    }
    return baseStyle;
  };

  return <Box sx={containerStyle()}>{generateCells()}</Box>;
};

export default CellPossibilities;
