import React from 'react';
import { Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Balances from '../components/Balances';
import { useTokenBalances } from '../hooks/useTokenBalances';

const Wallet: React.FC = () => {
  useTokenBalances();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
            width: '100%',
          }}
        >
          {/* Left Column */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '2 1 0%' }, minWidth: 0 }}>
            <Stack spacing={3}>
              {/* Token Balances */}
              <Balances />
            </Stack>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Wallet;
