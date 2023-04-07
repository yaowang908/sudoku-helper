import React from 'react';
import {
  Box,
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  borderColor,
  normalBorderThickness,
  cellSizeCss,
  operationSizeCss,
  textDecorationThickness,
} from '@/components/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import {
  setOperationMode,
  getOperationMode,
  OperationMode,
  getActiveCell,
  getRowId,
  getColumnId,
  setSelectedValue,
  setPossibleValues,
  selectSudokuCell,
  eraseCell,
} from '@/store/sudokuSlice';

const buttonBorderRadius = '0%';
const buttonMargin = '8px';
const fontSize = 'min(0.8em, 3vw)';

const Operations = () => {
  const dispatch = useAppDispatch();
  const operationMode = useAppSelector(getOperationMode);
  const activeCell = useAppSelector(getActiveCell);
  const cellData = useAppSelector(selectSudokuCell(activeCell));
  const crossedValues = cellData?.crossedValues;

  const handleClick =
    (
      cellValue: number,
      operationMode: OperationMode,
      activeCell: { row: number; column: number } | undefined
    ) =>
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (activeCell) {
        if (operationMode === OperationMode.NOTE) {
          dispatch(
            setPossibleValues({
              rowId: getRowId(activeCell.row),
              columnId: getColumnId(activeCell.column),
              possibleValue: cellValue,
            })
          );
        } else {
          dispatch(
            setSelectedValue({
              rowId: getRowId(activeCell.row),
              columnId: getColumnId(activeCell.column),
              selectedValue: cellValue,
            })
          );
        }
      } else {
        handleNoActiveCellDialogueOpen();
      }
    };

  // * no active cell confirmation dialog logic
  const [noActiveCellDialogueOpen, setNoActiveCellDialogueOpen] =
    React.useState(false);

  const handleNoActiveCellDialogueOpen = () => {
    setNoActiveCellDialogueOpen(true);
  };

  const handleNoActiveCellDialogueConfirm = () => {
    setNoActiveCellDialogueOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          height: cellSizeCss,
          display: 'flex',
          flexDirection: 'row',
          '@media (max-width: 1000px)': {
            marginTop: buttonMargin,
            marginBottom: buttonMargin,
          },
        }}
      >
        <Button
          variant={
            operationMode === OperationMode.EDIT ? 'contained' : 'outlined'
          }
          color={operationMode === OperationMode.EDIT ? 'success' : 'primary'}
          sx={{
            borderRadius: buttonBorderRadius,
            height: cellSizeCss,
            width: cellSizeCss,
            '@media (max-width: 600px)': {
              width: operationSizeCss,
            },
            minWidth: cellSizeCss,
            fontSize: fontSize,
          }}
          onClick={() => dispatch(setOperationMode(OperationMode.EDIT))}
        >
          Edit mode
        </Button>
        <Button
          variant={
            operationMode === OperationMode.NOTE ? 'contained' : 'outlined'
          }
          color={operationMode === OperationMode.NOTE ? 'success' : 'primary'}
          sx={{
            borderRadius: buttonBorderRadius,
            height: cellSizeCss,
            width: cellSizeCss,
            '@media (max-width: 600px)': {
              width: operationSizeCss,
            },
            minWidth: cellSizeCss,
            fontSize: fontSize,
          }}
          onClick={() => dispatch(setOperationMode(OperationMode.NOTE))}
        >
          Note mode
        </Button>
        <Button
          variant='contained'
          color='warning'
          sx={{
            borderRadius: buttonBorderRadius,
            height: cellSizeCss,
            width: cellSizeCss,
            '@media (max-width: 600px)': {
              width: operationSizeCss,
            },
            minWidth: cellSizeCss,
            fontSize: fontSize,
          }}
          onClick={() => dispatch(eraseCell(activeCell))}
        >
          Erase
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          maxWidth: operationSizeCss,
          '@media (max-width: 1000px)': {
            maxWidth: 'max-content',
          },
        }}
      >
        {Array(9)
          .fill(0)
          .map((_, index) => {
            const representedValue = index + 1;
            if (
              (crossedValues && crossedValues.includes(representedValue)) ||
              cellData?.preInstalled
            ) {
              return (
                <Box
                  key={`notes_${index}`}
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    height: cellSizeCss,
                    width: cellSizeCss,
                    cursor: 'pointer',
                    borderTop: `${borderColor} ${normalBorderThickness}px solid`,
                    borderBottom: `${borderColor} ${normalBorderThickness}px solid`,
                    borderLeft: `${borderColor} ${normalBorderThickness}px solid`,
                    borderRight: `${borderColor} ${normalBorderThickness}px solid`,
                    textDecoration: 'line-through',
                    textDecorationThickness: textDecorationThickness,
                    color: 'grey',
                    backgroundColor: 'lightgrey',
                  }}
                >
                  {representedValue}
                </Box>
              );
            }
            return (
              <Box
                key={`notes_${index}`}
                onClick={handleClick(
                  representedValue,
                  operationMode,
                  activeCell
                )}
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  height: cellSizeCss,
                  width: cellSizeCss,
                  cursor: 'pointer',
                  borderTop: `${borderColor} ${normalBorderThickness}px solid`,
                  borderBottom: `${borderColor} ${normalBorderThickness}px solid`,
                  borderLeft: `${borderColor} ${normalBorderThickness}px solid`,
                  borderRight: `${borderColor} ${normalBorderThickness}px solid`,
                }}
              >
                {representedValue}
              </Box>
            );
          })}
      </Box>
      <Dialog
        open={noActiveCellDialogueOpen}
        onClose={handleNoActiveCellDialogueConfirm}
      >
        <DialogTitle>No active cell selected</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You need to select an active cell before you can make changes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoActiveCellDialogueConfirm} color='success'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Operations;
