import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { AccountBalanceWallet as WalletIcon, TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/useAppContext';
import { BalanceSkeleton } from './LoadingSkeletons';
import TokenIcon from './TokenIcon';

const Balances: React.FC = () => {
  const { balances } = useAppContext();
  React.useEffect(() => {
    console.log('[Balances] context balances:', balances);
  }, [balances]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <BalanceSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WalletIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h2">
              Token Balances
            </Typography>
          </Box>

          <List disablePadding>
            {balances.map((balance, index) => (
              <motion.div
                key={balance.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <ListItem
                  disablePadding
                  sx={{
                    py: { xs: 1.5, md: 2 },
                    px: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 0 },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: { xs: '100%', sm: 'auto' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <TokenIcon symbol={balance.symbol} size={32} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {balance.symbol}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {balance.symbol === 'DAI' ? 'Dai Stablecoin' : 'USD Coin'}
                        </Typography>
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-end' },
                      alignItems: { xs: 'center', sm: 'flex-end' },
                      gap: { xs: 2, sm: 0.5 },
                      width: { xs: '100%', sm: 'auto' },
                      ml: { xs: 0, sm: 'auto' },
                    }}
                  >
                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}
                      >
                        {balance.balance}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {balance.symbol}
                      </Typography>
                    </Box>
                    {balance.price && (
                      <Box sx={{ textAlign: { xs: 'right', sm: 'right' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {balance.price}
                        </Typography>
                        {balance.priceChange !== undefined && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: 0.5,
                            }}
                          >
                            {balance.priceChange > 0 ? (
                              <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
                            ) : (
                              <TrendingDown sx={{ fontSize: 14, color: 'error.main' }} />
                            )}
                            <Typography
                              variant="caption"
                              sx={{
                                color: balance.priceChange > 0 ? 'success.main' : 'error.main',
                                fontWeight: 500,
                              }}
                            >
                              {balance.priceChange > 0 ? '+' : ''}
                              {balance.priceChange}% ({balance.priceChangeAmount})
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Balances;
