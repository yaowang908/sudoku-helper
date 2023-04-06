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
} from '@/components/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import {
  setOperationMode,
  getOperationMode,
  reset,
  OperationMode,
  getActiveCell,
  getRowId,
  getColumnId,
  setSelectedValue,
  setPossibleValues,
} from '@/store/sudokuSlice';

const buttonBorderRadius = '0%';
const buttonMargin = '8px';
const fontSize = 'min(1em, 3vw)';

const Operations = () => {
  const dispatch = useAppDispatch();
  const operationMode = useAppSelector(getOperationMode);
  const activeCell = useAppSelector(getActiveCell);

  const handleClick =
    (
      cellValue: number,
      operationMode: OperationMode,
      activeCell: { row: number; column: number } | undefined
    ) =>
    (event: React.MouseEvent<HTMLDivElement>) => {
      console.log(activeCell);
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

  // * reset confirmation dialog logic
  const [resetDialogueOpen, setResetDialogueOpen] = React.useState(false);

  const handleResetDialogueOpen = () => {
    setResetDialogueOpen(true);
  };

  const handleResetDialogueClose = () => {
    setResetDialogueOpen(false);
  };

  const handleResetDialogueConfirm = () => {
    dispatch(reset());
    handleResetDialogueClose();
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
    <Container>
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
            minWidth: cellSizeCss,
            fontSize: fontSize,
          }}
          onClick={() => dispatch(setOperationMode(OperationMode.NOTE))}
        >
          Note mode
        </Button>
        <Button
          variant='contained'
          color='error'
          sx={{
            borderRadius: buttonBorderRadius,
            height: cellSizeCss,
            width: cellSizeCss,
            minWidth: cellSizeCss,
            fontSize: fontSize,
          }}
          onClick={handleResetDialogueOpen}
        >
          Reset
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
      <Dialog open={resetDialogueOpen} onClose={handleResetDialogueClose}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset all data? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetDialogueClose}>Cancel</Button>
          <Button onClick={handleResetDialogueConfirm} color='error'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
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
    </Container>
  );
};

export default Operations;
