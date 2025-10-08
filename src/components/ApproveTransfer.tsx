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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  SwapHoriz as TransferIcon,
  CheckCircle as ApproveIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAccount, useWriteContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { useAppContext } from '../context/useAppContext';
import type { Token } from '../context/AppContext';
import TokenIcon from './TokenIcon';

// Token configuration - TODO: move to config file eventually
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

const ApproveTransfer: React.FC = () => {
  const { address } = useAccount();
  const { balances, addEvent } = useAppContext();

  // Form state - keeping it simple for now
  const [token, setToken] = useState('DAI');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const selectedToken = TOKENS.find((t) => t.symbol === token)!;
  const balance = balances.find((b) => b.symbol === token)?.balance || '0';

  // Basic validation - could be more robust
  const validate = () => {
    if (!address) return 'Connect your wallet.';
    if (!recipient) return 'Recipient is required.';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return 'Enter a valid amount.';
    if (Number(amount) > Number(balance.replace(/,/g, ''))) return 'Not enough funds.';
    return '';
  };

  const handleApprove = async () => {
    setError('');
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    try {
      const tx = await writeContractAsync({
        address: selectedToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [recipient as `0x${string}`, BigInt(Number(amount) * 10 ** selectedToken.decimals)],
      });
      addEvent({
        id: `${tx}-${Date.now()}`,
        type: 'approval',
        token: token as Token,
        amount,
        from: address!,
        to: recipient,
        txHash: tx,
        timestamp: Date.now(),
      });
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message || 'Approve failed');
    }
    setLoading(false);
  };

  const handleTransfer = async () => {
    setError('');
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    try {
      const tx = await writeContractAsync({
        address: selectedToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, BigInt(Number(amount) * 10 ** selectedToken.decimals)],
      });
      addEvent({
        id: `${tx}-${Date.now()}`,
        type: 'transfer',
        token: token as Token,
        amount,
        from: address!,
        to: recipient,
        txHash: tx,
        timestamp: Date.now(),
      });
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message || 'Transfer failed');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TransferIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h2">
              Approve & Transfer
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
                    <TokenIcon symbol={value} size={24} />
                    <Typography>{value}</Typography>
                  </Box>
                )}
              >
                {TOKENS.map((t) => (
                  <MenuItem key={t.symbol} value={t.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TokenIcon symbol={t.symbol} size={24} />
                      <Typography>{t.symbol}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {t.symbol === 'DAI' ? 'Dai Stablecoin' : 'USD Coin'}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Recipient Address */}
            <TextField
              fullWidth
              label="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              helperText="Enter the Ethereum address of the recipient"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title="If you need an address to test, you can use: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 (Vitalik's address)"
                      arrow
                      placement="top"
                    >
                      <IconButton edge="end" size="small">
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                },
              }}
            />

            {/* Amount Input */}
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
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
              helperText={
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Enter the amount to approve or transfer</span>
                  <span>
                    Balance: {balance} {token}
                  </span>
                </span>
              }
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

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleApprove}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={16} color="inherit" /> : <ApproveIcon />
                }
                sx={{
                  flex: 1,
                  py: 1.5,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {loading ? 'Approving...' : 'Approve'}
              </Button>

              <Button
                variant="contained"
                onClick={handleTransfer}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={16} color="inherit" /> : <TransferIcon />
                }
                sx={{
                  flex: 1,
                  py: 1.5,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {loading ? 'Transferring...' : 'Transfer'}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ApproveTransfer;
