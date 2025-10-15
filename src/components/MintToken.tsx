import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Modal,
  Box,
  Stack,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Token as TokenIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import useTokenActions from '../hooks/useTokenActions';
// no longer using AppContext events
import TokenIconComponent from './TokenIcon';

const TOKENS = [
  {
    symbol: 'DAI',
    address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    address: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47',
    decimals: 6,
  },
];

const MintToken: React.FC = () => {
  const { mint, loading, error, success, modalOpen, modalTitle, modalContent, setModalOpen } =
    useTokenActions();
  const [token, setToken] = useState('DAI');
  const [amount, setAmount] = useState('100');

  const selectedToken = TOKENS.find((t) => t.symbol === token)!;

  const handleMint = async () => {
    await mint({
      tokenAddress: selectedToken.address as `0x${string}`,
      decimals: selectedToken.decimals,
      mintAmount: amount,
      onSuccess: () => {
        setAmount('100');
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TokenIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h2">
              Mint Test Tokens
            </Typography>
          </Box>

          <Stack spacing={3}>
            {/* Token Selector */}
            <FormControl fullWidth>
              <InputLabel>Token</InputLabel>
              <Select
                value={token}
                onChange={(e) => setToken(e.target.value)}
                label="Token"
                disabled={loading}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TokenIconComponent symbol={value} size={24} />
                    <Typography>{value}</Typography>
                  </Box>
                )}
              >
                {TOKENS.map((t) => (
                  <MenuItem key={t.symbol} value={t.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TokenIconComponent symbol={t.symbol} size={24} />
                      <Typography>{t.symbol}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {t.symbol === 'DAI' ? 'Dai Stablecoin' : 'USD Coin'}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Amount Input */}
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              placeholder="100"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Chip
                      label={token}
                      size="small"
                      sx={{ backgroundColor: 'primary.main', color: 'white' }}
                    />
                  </InputAdornment>
                ),
              }}
              helperText="Enter the amount of test tokens to mint"
            />

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert
                  severity="error"
                  action={
                    <Button size="small" onClick={() => setModalOpen(true)}>
                      Show the error
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Success Alert */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert
                  severity="success"
                  action={
                    <Button size="small" onClick={() => setModalOpen(true)}>
                      Show details
                    </Button>
                  }
                >
                  {success}
                </Alert>
              </motion.div>
            )}

            {/* Mint Button */}
            <Button
              variant="contained"
              onClick={handleMint}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <TokenIcon />}
              sx={{
                py: 1.5,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {loading ? 'Minting...' : 'Mint Test Tokens'}
            </Button>
            {/* Details Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
              <Box
                sx={{
                  position: 'absolute' as const,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 3,
                  borderRadius: 2,
                  width: { xs: '90%', sm: 500 },
                  maxHeight: '80vh',
                  overflow: 'auto',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {modalTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    mb: 2,
                  }}
                >
                  {modalContent}
                </Typography>
                {modalTitle === 'Transaction' && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      window.open(`https://sepolia.etherscan.io/tx/${modalContent}`, '_blank')
                    }
                  >
                    View on Etherscan
                  </Button>
                )}
                <Button sx={{ ml: 1 }} onClick={() => setModalOpen(false)}>
                  Close
                </Button>
              </Box>
            </Modal>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MintToken;
