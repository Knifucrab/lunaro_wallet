import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { useChainId, useSwitchChain, useAccount } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { motion, AnimatePresence } from 'framer-motion';

import { theme } from './theme/theme';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import NotConnected from './components/NotConnected';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const DRAWER_WIDTH = 80;

const NetworkWarning: React.FC = () => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (chainId !== sepolia.id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        style={{
          background: '#ff9800',
          color: 'white',
          padding: '12px 16px',
          textAlign: 'center',
          fontWeight: 500,
        }}
      >
        Wrong network. Please switch to Sepolia.{' '}
        {switchChain && (
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            style={{
              marginLeft: 8,
              padding: '4px 12px',
              background: 'white',
              color: '#ff9800',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Switch to Sepolia
          </button>
        )}
      </motion.div>
    );
  }
  return null;
};

const App: React.FC = () => {
  const { isConnected } = useAccount();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
          <Sidebar open={true} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { xs: '100%', sm: `calc(100% - ${DRAWER_WIDTH}px)` },
              minHeight: '100vh',
              backgroundColor: 'background.default',
              ml: { xs: 0, sm: `${DRAWER_WIDTH}px` },
            }}
          >
            <TopNavbar />
            <AnimatePresence>
              <NetworkWarning />
            </AnimatePresence>

            <Box sx={{ mt: 8, p: { xs: 2, sm: 3 }, width: '100%', maxWidth: 'none' }}>
              {!isConnected ? (
                <NotConnected />
              ) : (
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              )}
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
