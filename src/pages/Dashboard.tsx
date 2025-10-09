import React from 'react';
import { Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { AccountBalanceWallet, TrendingUp } from '@mui/icons-material';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { useWalletStats } from '../hooks/useWalletStats';
import StatCard from '../components/StatCard';
import APYCard from '../components/APYCard';
import PortfolioPerformanceCard from '../components/PortfolioPerformanceCard';
import TotalBalanceCard from '../components/TotalBalanceCard';
import TransactionHistory from '../components/TransactionHistory';

const Dashboard: React.FC = () => {
  useTokenBalances();
  const stats = useWalletStats();

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
            flexDirection: { xs: 'column', xl: 'row' },
            gap: 3,
            width: '100%',
          }}
        >
          {/* Left Column - Main Content */}
          <Box sx={{ flex: { xs: '1 1 100%', xl: '3 1 0%' }, minWidth: 0 }}>
            <Stack spacing={3}>
              {/* Top Row - Stats Cards */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 2,
                }}
              >
                <StatCard
                  title="Total Assets"
                  value={`$${stats.totalAssets.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  icon={<AccountBalanceWallet sx={{ color: '#000' }} />}
                  bgColor="#d4f7dc"
                  delay={0}
                />
                <StatCard
                  title="Total Deposits"
                  value={`$${stats.totalDeposits.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  icon={<TrendingUp sx={{ color: '#6366f1' }} />}
                  bgColor="#e0e7ff"
                  delay={0.1}
                />
                <APYCard apy={stats.apy} />
              </Box>

              {/* Portfolio Performance Chart */}
              <PortfolioPerformanceCard />

              {/* Transaction History */}
              <TransactionHistory />
            </Stack>
          </Box>

          {/* Right Column - Total Balance & Actions */}
          <Box sx={{ flex: { xs: '1 1 100%', xl: '1 1 0%' }, minWidth: 0 }}>
            <TotalBalanceCard
              totalBalance={stats.totalBalance}
              priceChange={stats.priceChange24h}
            />
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Dashboard;
