import React from 'react';
import Box from '@mui/material/Box';
import { useColorMode } from '@/hooks/useColorMode';
import { getTokens } from '@/theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { mode } = useColorMode();
  const t = getTokens(mode);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: `radial-gradient(1200px 600px at 15% -10%, ${t.appBgTo} 0%, transparent 60%), linear-gradient(160deg, ${t.appBgFrom} 0%, ${t.appBgTo} 100%)`,
        transition: 'background 0.3s ease',
      }}
    >
      <Box
        sx={{
          maxWidth: 980,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 2.5, sm: 4 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
