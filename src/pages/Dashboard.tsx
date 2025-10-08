import React from 'react';
import { Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Balances from '../components/Balances';
import ApproveTransfer from '../components/ApproveTransfer';
import MintToken from '../components/MintToken';
import TransactionHistory from '../components/TransactionHistory';
import { useTokenBalances } from '../hooks/useTokenBalances';

const Dashboard: React.FC = () => {
  useTokenBalances();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <Box sx={{ width: '100%', maxWidth: 'none' }}>
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
              {/*Token Balances */}
              <Balances />

              {/* Transaction History */}
              <TransactionHistory />
            </Stack>
          </Box>

          {/* Right Column - Transfer, Approve, Mint */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 0%' }, minWidth: 0 }}>
            <Stack spacing={3}>
              <ApproveTransfer />
              <MintToken />
            </Stack>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Dashboard;
