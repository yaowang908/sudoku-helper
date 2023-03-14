import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SITE_TITLE } from '@/components/constants';

interface HeaderProps {
  title?: string;
}

const Header = (props: HeaderProps) => {
  const { title = SITE_TITLE } = props;
  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <Typography variant='h3' gutterBottom>
        {title}
      </Typography>
    </Box>
  );
};

export default Header;
