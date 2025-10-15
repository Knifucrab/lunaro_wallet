import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, Tab, Tabs, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { TrendingUp, TrendingDown, SwapHoriz, Token as TokenIconMUI } from '@mui/icons-material';
// erc20Abi not needed here; token actions handled by hook
import ApproveTransfer from './ApproveTransfer';
import MintToken from './MintToken';

interface TotalBalanceCardProps {
  totalBalance?: number;
  priceChange?: number;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({
  totalBalance = 0,
  priceChange = 0,
}) => {
  const { address } = useAccount();

  const username = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User';

  // Tab state (0 = Approve & Transfer, 1 = Mint)
  const [activeTab, setActiveTab] = useState(0);
  // The action UIs live in their own components now (ApproveTransfer, MintToken)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {/* User Avatar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#000',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
          </Box>

          {/* Total Balance Label */}
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
            Total Balance
          </Typography>

          {/* Balance Amount */}
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 1 }}>
            $
            {totalBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>

          {/* Percentage Change */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: priceChange >= 0 ? '#d4f7dc' : '#ffe0e0',
                color: priceChange >= 0 ? '#00a651' : '#d32f2f',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {priceChange >= 0 ? '+' : ''}
              {priceChange.toFixed(2)}%
              {priceChange >= 0 ? (
                <TrendingUp sx={{ fontSize: 16, ml: 0.5 }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, ml: 0.5 }} />
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Functionality Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Actions
            </Typography>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                mb: 2,
                minHeight: 40,
                '& .MuiTabs-indicator': {
                  backgroundColor: '#000',
                },
              }}
            >
              <Tab
                label="Approve & Transfer"
                icon={<SwapHoriz sx={{ fontSize: 18 }} />}
                iconPosition="start"
                sx={{
                  minHeight: 40,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  textTransform: 'none',
                  '&.Mui-selected': { color: '#000', fontWeight: 600 },
                }}
              />
              <Tab
                label="Mint Tokens"
                icon={<TokenIconMUI sx={{ fontSize: 18 }} />}
                iconPosition="start"
                sx={{
                  minHeight: 40,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  textTransform: 'none',
                  '&.Mui-selected': { color: '#000', fontWeight: 600 },
                }}
              />
            </Tabs>

            {/* Tab Panels render their own controls */}
            <Box>{activeTab === 0 ? <ApproveTransfer /> : <MintToken />}</Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TotalBalanceCard;
