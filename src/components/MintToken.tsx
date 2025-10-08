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
  Box,
  Stack,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Token as TokenIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAccount, useWriteContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { useAppContext } from '../context/useAppContext';
import type { Token } from '../context/AppContext';
import TokenIconComponent from './TokenIcon';

// Extended ABI that includes the mint function
const erc20WithMintAbi = [
  ...erc20Abi,
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;

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
  const { address } = useAccount();
  const { addEvent } = useAppContext();
  const { writeContractAsync } = useWriteContract();
  const [token, setToken] = useState('DAI');
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedToken = TOKENS.find((t) => t.symbol === token)!;

  const handleMint = async () => {
    setError('');
    setSuccess('');
    if (!address) {
      setError('Connect your wallet.');
      return;
    }
    setLoading(true);
    try {
      // Use the extended ABI that includes the mint function
      const tx = await writeContractAsync({
        address: selectedToken.address as `0x${string}`,
        abi: erc20WithMintAbi,
        functionName: 'mint',
        args: [address, BigInt(Number(amount) * 10 ** selectedToken.decimals)],
      });

      // Add mint event to context (we'll show it as a transfer from 0x0 to the user)
      addEvent({
        id: `${tx}-${Date.now()}`,
        type: 'transfer',
        token: token as Token,
        amount,
        from: '0x0000000000000000000000000000000000000000', // Mint is from zero address
        to: address!,
        txHash: tx,
        timestamp: Date.now(),
      });

      setSuccess(`Minted successfully! Transaction: ${tx}`);
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message || 'Mint failed. This token may not support minting.');
    }
    setLoading(false);
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
                <Alert severity="error">{error}</Alert>
              </motion.div>
            )}

            {/* Success Alert */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert severity="success">{success}</Alert>
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
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MintToken;
