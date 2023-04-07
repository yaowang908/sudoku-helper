import React from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Menu,
  useMediaQuery,
} from '@mui/material';
import { SITE_TITLE, SudoKuLevel } from '@/components/constants';
import ToggleCrossedValues from '@/components/ToggleButtons/ToggleCrossedValues';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { generateSudoku, reset } from '@/store/sudokuSlice';

interface HeaderProps {
  title?: string;
}

const Header = (props: HeaderProps) => {
  const { title = SITE_TITLE } = props;
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width: 600px)');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (value?: SudoKuLevel) => {
    value && dispatch(generateSudoku({ level: value }));
    setAnchorEl(null);
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

  return (
    <Box
      sx={{
        bgcolor: 'transparent',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        marginY: '1rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Typography
        variant='h3'
        sx={{
          '@media (max-width: 600px)': {
            fontSize: '2rem',
          },
        }}
      >
        {title}
      </Typography>
      {!isMobile && (
        <Box>
          <ToggleCrossedValues />
        </Box>
      )}
      <Box sx={{ position: 'relative' }}>
        <Button
          variant='contained'
          id='generate-sudoku-button'
          aria-controls={open ? 'generate-sudoku-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Generated new Sudoku
        </Button>
        <Menu
          id='generate-sudoku-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          MenuListProps={{
            'aria-labelledby': 'generate-sudoku-button',
          }}
        >
          <MenuItem onClick={() => handleClose(SudoKuLevel.easy)}>
            Easy
          </MenuItem>
          <MenuItem onClick={() => handleClose(SudoKuLevel.medium)}>
            Medium
          </MenuItem>
          <MenuItem onClick={() => handleClose(SudoKuLevel.hard)}>
            Hard
          </MenuItem>
          <MenuItem onClick={() => handleClose(SudoKuLevel.expert)}>
            Expert
          </MenuItem>
        </Menu>
        <Button
          variant='contained'
          color='error'
          id='reset-button'
          aria-haspopup='true'
          onClick={handleResetDialogueOpen}
        >
          Reset
        </Button>
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
    </Box>
  );
};

export default Header;
