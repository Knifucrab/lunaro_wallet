import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import WalletConnect from './WalletConnect';

const DRAWER_WIDTH = 80;

const TopNavbar: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          xs: '100%',
          sm: `calc(100% - ${DRAWER_WIDTH}px)`,
        },
        ml: {
          xs: 0,
          sm: `${DRAWER_WIDTH}px`,
        },
        backgroundColor: 'white',
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            Dashboard
          </Typography>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WalletConnect />
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
