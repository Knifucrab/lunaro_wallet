import React from 'react';
import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import WalletConnect from './WalletConnect';

const NotConnected: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              p: 2,
              maxWidth: 400,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Box
                  component="img"
                  src="/knifucrab.svg"
                  alt="Knifucrab Logo"
                  sx={{
                    width: 200,
                    height: 300,
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Typography variant="h4" component="h1" gutterBottom>
                  Connect Your Wallet
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  To access the dashboard and manage your tokens, please connect your wallet first.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <WalletConnect />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default NotConnected;
