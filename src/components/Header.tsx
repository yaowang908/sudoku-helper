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
  IconButton,
  Tooltip,
} from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { SITE_TITLE, SudoKuLevel } from '@/components/constants';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { generateSudoku, reset } from '@/store/sudokuSlice';
import { useColorMode } from '@/hooks/useColorMode';

const levels: SudoKuLevel[] = [
  SudoKuLevel.easy,
  SudoKuLevel.medium,
  SudoKuLevel.hard,
  SudoKuLevel.expert,
];

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mode, toggle } = useColorMode();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = (value?: SudoKuLevel) => {
    if (value) dispatch(generateSudoku({ level: value }));
    setAnchorEl(null);
  };

  const [resetOpen, setResetOpen] = React.useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        mb: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 44,
            height: 44,
            borderRadius: '14px',
            color: '#fff',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 8px 20px -8px rgba(99,102,241,0.8)',
          }}
        >
          <GridViewRoundedIcon />
        </Box>
        <Box>
          <Typography
            variant='h4'
            sx={{ fontSize: { xs: '1.4rem', sm: '1.9rem' }, lineHeight: 1.1 }}
          >
            {SITE_TITLE}
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.secondary' }}>
            Solve smarter — candidates tracked for you
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant='contained'
          startIcon={<AddRoundedIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ px: 2, py: 1 }}
        >
          New game
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {levels.map((level) => (
            <MenuItem
              key={level}
              onClick={() => handleClose(level)}
              sx={{ textTransform: 'capitalize', minWidth: 140 }}
            >
              {level}
            </MenuItem>
          ))}
        </Menu>

        <Tooltip title='Reset board'>
          <IconButton
            onClick={() => setResetOpen(true)}
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <RestartAltRoundedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton
            onClick={toggle}
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            {mode === 'light' ? (
              <DarkModeRoundedIcon />
            ) : (
              <LightModeRoundedIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Reset the board?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This clears every value and note. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              dispatch(reset());
              setResetOpen(false);
            }}
            color='error'
            variant='contained'
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Header;
