import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SITE_TITLE, SudoKuLevel } from '@/components/constants';
import ToggleCrossedValues from '@/components/ToggleButtons/ToggleCrossedValues';
import { MenuItem, Menu, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { generateSudoku } from '@/store/sudokuSlice';

interface HeaderProps {
  title?: string;
}

const Header = (props: HeaderProps) => {
  const { title = SITE_TITLE } = props;
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (value?: SudoKuLevel) => {
    value && dispatch(generateSudoku({ level: value }));
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        bgcolor: 'transparent',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        wrap: 'nowrap',
        alignItems: 'flex-end',
        marginY: '1rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Typography variant='h3'>{title}</Typography>
      <Box>
        <ToggleCrossedValues />
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Button
          variant='contained'
          id='basic-button'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Generated new Sudoku
        </Button>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
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
      </Box>
    </Box>
  );
};

export default Header;
