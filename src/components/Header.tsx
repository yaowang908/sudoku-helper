import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SITE_TITLE } from '@/components/constants';
import ToggleCrossedValues from '@/components/ToggleButtons/ToggleCrossedValues';

interface HeaderProps {
  title?: string;
}

const Header = (props: HeaderProps) => {
  const { title = SITE_TITLE } = props;
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
      }}
    >
      <Typography variant='h3'>{title}</Typography>
      <Box>
        <ToggleCrossedValues />
      </Box>
    </Box>
  );
};

export default Header;
