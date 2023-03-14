import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <React.Fragment>
      <Container maxWidth='md'>
        <Box sx={{ bgcolor: 'transparent', height: '100vh' }}>{children}</Box>
      </Container>
    </React.Fragment>
  );
};

export default Layout;
