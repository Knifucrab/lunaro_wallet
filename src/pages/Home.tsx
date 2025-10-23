import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Stack,
  useTheme,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <WalletIcon sx={{ fontSize: 40 }} />,
      title: 'Wallet Integration',
      description: 'Connect your wallet seamlessly with RainbowKit',
    },
    {
      icon: <TrendingIcon sx={{ fontSize: 40 }} />,
      title: 'Token Management',
      description: 'View balances, approve, transfer, and mint tokens',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Transactions',
      description: 'All transactions are secured by blockchain technology',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: theme.palette.primary.main,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Lunaro Wallet
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            A modern interface for managing your crypto tokens with ease and security
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              borderRadius: 3,
              mb: 8,
            }}
          >
            Launch Dashboard
          </Button>
        </motion.div>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mt: 8 }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              style={{ flex: 1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
