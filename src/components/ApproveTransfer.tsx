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
  Modal,
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
import { useAppContext } from '../context/useAppContext';
import useTokenActions from '../hooks/useTokenActions';
import useDetectedTokens from '../hooks/useDetectedTokens';
import TokenIcon from './TokenIcon';

const ApproveTransfer: React.FC = () => {
  const detected = useDetectedTokens();

  const { balances } = useAppContext();
  // use detected tokens if available, otherwise empty list
  const tokens = detected && detected.length > 0 ? detected : [];

  // Form state - keeping it simple for now
  const [token, setToken] = useState(tokens[0]?.symbol || '');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const {
    approve,
    transfer,
    loading,
    error,
    success,
    modalOpen,
    modalTitle,
    modalContent,
    setModalOpen,
    setError: setHookError,
    setSuccess: setHookSuccess,
  } = useTokenActions();

  const selectedToken = tokens.find((t) => t.symbol === token)!;
  const balance = balances.find((b) => b.symbol === token)?.balance || '0';

  // clear hook messages when token changes
  React.useEffect(() => {
    setHookError('');
    setHookSuccess('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleApprove = async () => {
    await approve({
      tokenAddress: selectedToken.address as `0x${string}`,
      decimals: selectedToken.decimals,
      recipient,
      amount,
      balance,
      onSuccess: () => {
        setAmount('');
        setRecipient('');
      },
    });
  };

  const handleTransfer = async () => {
    await transfer({
      tokenAddress: selectedToken.address as `0x${string}`,
      decimals: selectedToken.decimals,
      recipient,
      amount,
      balance,
      onSuccess: () => {
        setAmount('');
        setRecipient('');
      },
    });
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
                disabled={loading || tokens.length === 0}
                label="Token"
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TokenIcon symbol={value} size={24} />
                    <Typography>{value}</Typography>
                  </Box>
                )}
              >
                {tokens.length === 0 ? (
                  <MenuItem value="">
                    <Typography color="text.secondary">No tokens detected</Typography>
                  </MenuItem>
                ) : (
                  tokens.map((t) => (
                    <MenuItem key={t.address} value={t.symbol}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TokenIcon symbol={t.symbol} size={24} />
                        <Typography>{t.symbol}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {t.address}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Recipient Address */}
            <TextField
              fullWidth
              label="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={loading}
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
              disabled={loading}
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

            {/* Error / Success Alerts (short messages) */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert
                  severity="error"
                  action={
                    <Button
                      size="small"
                      onClick={() => {
                        setModalOpen(true);
                      }}
                    >
                      Show the error
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert
                  severity="success"
                  action={
                    <Button
                      size="small"
                      onClick={() => {
                        setModalOpen(true);
                      }}
                    >
                      Check details
                    </Button>
                  }
                >
                  {success}
                </Alert>
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
                    onClick={() => window.open(`https://etherscan.io/tx/${modalContent}`, '_blank')}
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

export default ApproveTransfer;
