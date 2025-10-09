import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useWriteContract } from 'wagmi';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Token as TokenIconMUI,
  Info as InfoIcon,
} from '@mui/icons-material';
import { erc20Abi } from 'viem';
import TokenIcon from './TokenIcon';
import { useAppContext } from '../context/useAppContext';
import type { Token } from '../context/AppContext';

// Extended ABI for mint function
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

// Token configuration
const TOKENS = [
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47',
    decimals: 6,
  },
];

interface TotalBalanceCardProps {
  totalBalance?: number;
  priceChange?: number;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({
  totalBalance = 0,
  priceChange = 0,
}) => {
  const theme = useTheme();
  const { address } = useAccount();
  const { balances, addEvent } = useAppContext();
  const { writeContractAsync } = useWriteContract();

  const username = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User';

  // Tab state (0 = Approve & Transfer, 1 = Mint)
  const [activeTab, setActiveTab] = useState(0);

  // Approve & Transfer state
  const [token, setToken] = useState('DAI');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  // Mint state
  const [mintToken, setMintToken] = useState('DAI');
  const [mintAmount, setMintAmount] = useState('100');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedToken = TOKENS.find((t) => t.symbol === token)!;
  const selectedMintToken = TOKENS.find((t) => t.symbol === mintToken)!;
  const balance = balances.find((b) => b.symbol === token)?.balance || '0';

  // Validation for Approve/Transfer
  const validate = () => {
    if (!address) return 'Connect your wallet.';
    if (!recipient) return 'Recipient is required.';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return 'Enter a valid amount.';
    if (Number(amount) > Number(balance.replace(/,/g, ''))) return 'Not enough funds.';
    return '';
  };

  // Handle Approve
  const handleApprove = async () => {
    setError('');
    setSuccess('');
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
      setSuccess(`Approved successfully! Tx: ${tx.slice(0, 10)}...`);
      setAmount('');
      setRecipient('');
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message || 'Approve failed');
    }
    setLoading(false);
  };

  // Handle Transfer
  const handleTransfer = async () => {
    setError('');
    setSuccess('');
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
      setSuccess(`Transferred successfully! Tx: ${tx.slice(0, 10)}...`);
      setAmount('');
      setRecipient('');
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message || 'Transfer failed');
    }
    setLoading(false);
  };

  // Handle Mint
  const handleMint = async () => {
    setError('');
    setSuccess('');
    if (!address) {
      setError('Connect your wallet.');
      return;
    }
    setLoading(true);
    try {
      const tx = await writeContractAsync({
        address: selectedMintToken.address as `0x${string}`,
        abi: erc20WithMintAbi,
        functionName: 'mint',
        args: [address, BigInt(Number(mintAmount) * 10 ** selectedMintToken.decimals)],
      });
      addEvent({
        id: `${tx}-${Date.now()}`,
        type: 'transfer',
        token: mintToken as Token,
        amount: mintAmount,
        from: '0x0000000000000000000000000000000000000000',
        to: address!,
        txHash: tx,
        timestamp: Date.now(),
      });
      setSuccess(`Minted ${mintAmount} ${mintToken} successfully! Tx: ${tx.slice(0, 10)}...`);
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
              onChange={(_, newValue) => {
                setActiveTab(newValue);
                setError('');
                setSuccess('');
              }}
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

            {/* Error/Success Alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert severity="error" sx={{ mb: 2, fontSize: '0.75rem' }}>
                    {error}
                  </Alert>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert severity="success" sx={{ mb: 2, fontSize: '0.75rem' }}>
                    {success}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tab Panels */}
            <AnimatePresence mode="wait">
              {activeTab === 0 ? (
                // Approve & Transfer Form
                <motion.div
                  key="approve-transfer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Token Selector */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    Token
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.divider,
                        },
                      }}
                      renderValue={(value) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TokenIcon symbol={value} size={24} />
                          <Typography variant="body2">{value}</Typography>
                        </Box>
                      )}
                    >
                      {TOKENS.map((t) => (
                        <MenuItem key={t.symbol} value={t.symbol}>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}
                          >
                            <TokenIcon symbol={t.symbol} size={24} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2">{t.symbol}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {t.name}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Recipient Address */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    Recipient Address
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    size="small"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip
                            title="Test address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                            arrow
                          >
                            <IconButton edge="end" size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Amount Input */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    Amount
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    size="small"
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Chip
                            label={token}
                            size="small"
                            sx={{
                              bgcolor: '#000',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Balance Display */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 2, display: 'block' }}
                  >
                    Balance: {balance} {token}
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleApprove}
                      disabled={loading || !recipient || !amount}
                      startIcon={loading ? <CircularProgress size={16} /> : null}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: '#000',
                        color: '#000',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#000',
                          bgcolor: 'rgba(0,0,0,0.04)',
                        },
                      }}
                    >
                      {loading ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleTransfer}
                      disabled={loading || !recipient || !amount}
                      startIcon={loading ? <CircularProgress size={16} /> : null}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        bgcolor: '#000',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#333',
                        },
                      }}
                    >
                      {loading ? 'Transferring...' : 'Transfer'}
                    </Button>
                  </Box>
                </motion.div>
              ) : (
                // Mint Form
                <motion.div
                  key="mint"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Token Selector */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    Token
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                      value={mintToken}
                      onChange={(e) => setMintToken(e.target.value)}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.divider,
                        },
                      }}
                      renderValue={(value) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TokenIcon symbol={value} size={24} />
                          <Typography variant="body2">{value}</Typography>
                        </Box>
                      )}
                    >
                      {TOKENS.map((t) => (
                        <MenuItem key={t.symbol} value={t.symbol}>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}
                          >
                            <TokenIcon symbol={t.symbol} size={24} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2">{t.symbol}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {t.name}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Amount Input */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    Amount to Mint
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="100"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    type="number"
                    size="small"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Chip
                            label={mintToken}
                            size="small"
                            sx={{
                              bgcolor: '#000',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Info Box */}
                  <Box
                    sx={{
                      mb: 2,
                      p: 1.5,
                      bgcolor: 'rgba(0,0,0,0.03)',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      💡 This will mint test tokens to your wallet address for development purposes.
                    </Typography>
                  </Box>

                  {/* Mint Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleMint}
                    disabled={loading || !mintAmount || Number(mintAmount) <= 0}
                    startIcon={loading ? <CircularProgress size={16} /> : <TokenIconMUI />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: '#000',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#333',
                      },
                    }}
                  >
                    {loading ? 'Minting...' : `Mint ${mintAmount} ${mintToken}`}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TotalBalanceCard;
