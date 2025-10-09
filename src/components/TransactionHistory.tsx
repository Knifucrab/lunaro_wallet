import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Modal,
  IconButton,
  Divider,
  Avatar,
  Alert,
} from '@mui/material';
import {
  VisibilityOutlined as ViewIcon,
  Close as CloseIcon,
  ArrowUpward as OutgoingIcon,
  ArrowDownward as IncomingIcon,
  CheckCircle as ApprovalIcon,
  OpenInNew as ExternalIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import TokenIcon from './TokenIcon';
import { useEtherscanTransactions } from '../hooks/useEtherscanTransactions';
import { formatUnits } from 'viem';

interface ProcessedEvent {
  id: string;
  type: 'incoming' | 'outgoing' | 'approval';
  token: string;
  amount: string;
  address: string;
  txHash: string;
  timestamp: number;
}

interface GroupedEvent {
  date: string;
  events: ProcessedEvent[];
}

const TransactionHistory: React.FC = () => {
  const { address: userAddress } = useAccount();
  const { tokenTransactions, loading, error, refetch } = useEtherscanTransactions();
  const [modalOpen, setModalOpen] = useState(false);

  // Combine and process all transactions
  const allProcessedEvents = useMemo(() => {
    console.log('Processing token transfers:', {
      tokenCount: tokenTransactions.length,
      userAddress,
    });

    const processed: ProcessedEvent[] = [];

    // Process ERC20 token transactions only
    tokenTransactions.forEach((tx) => {
      const isIncoming = tx.to?.toLowerCase() === userAddress?.toLowerCase();
      const type = isIncoming ? 'incoming' : 'outgoing';
      const decimals = parseInt(tx.tokenDecimal);

      processed.push({
        id: tx.hash,
        type,
        token: tx.tokenSymbol,
        amount: formatUnits(BigInt(tx.value), decimals),
        address: isIncoming ? tx.from : tx.to,
        txHash: tx.hash,
        timestamp: parseInt(tx.timeStamp) * 1000, // Convert to milliseconds
      });
    });

    console.log(`Processed ${processed.length} total transactions`);

    // Sort by timestamp (most recent first)
    return processed.sort((a, b) => b.timestamp - a.timestamp);
  }, [tokenTransactions, userAddress]);

  const formatDate = React.useCallback((timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  const groupEventsByDate = React.useCallback(
    (processedEvents: ProcessedEvent[]): GroupedEvent[] => {
      const groups: { [key: string]: ProcessedEvent[] } = {};

      processedEvents.forEach((event) => {
        const dateKey = formatDate(event.timestamp);
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(event);
      });

      return Object.entries(groups).map(([date, events]) => ({
        date,
        events,
      }));
    },
    [formatDate],
  );

  const groupedEvents = useMemo(
    () => groupEventsByDate(allProcessedEvents),
    [allProcessedEvents, groupEventsByDate],
  );
  const recentTransactions = useMemo(() => allProcessedEvents.slice(0, 4), [allProcessedEvents]); // Show only last 4 transactions

  const formatAmount = (amount: string, token: string, type: string) => {
    const prefix = type === 'incoming' ? '+' : type === 'outgoing' ? '-' : '';
    return `${prefix}${parseFloat(amount).toFixed(2)} ${token}`;
  };

  const formatAddress = (addr: string | undefined) => {
    if (!addr || typeof addr !== 'string') return 'Unknown';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return <IncomingIcon sx={{ color: '#4caf50', fontSize: 20 }} />;
      case 'outgoing':
        return <OutgoingIcon sx={{ color: '#f44336', fontSize: 20 }} />;
      case 'approval':
        return <ApprovalIcon sx={{ color: '#ff9800', fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'incoming':
        return '#4caf50';
      case 'outgoing':
        return '#f44336';
      case 'approval':
        return '#ff9800';
      default:
        return '#666';
    }
  };

  const TransactionRowInner = ({ event }: { event: ProcessedEvent }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'transparent', width: 40, height: 40 }}>
            {getTransactionIcon(event.type)}
          </Avatar>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {event.type === 'approval' ? 'Approval' : event.type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {event.type === 'approval'
                ? 'Approved to'
                : event.type === 'incoming'
                ? 'From'
                : 'To'}
              : {formatAddress(event.address)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TokenIcon symbol={event.token} size={20} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: getTransactionColor(event.type),
            }}
          >
            {formatAmount(event.amount, event.token, event.type)}
          </Typography>
          <IconButton
            size="small"
            onClick={() => window.open(`https://sepolia.etherscan.io/tx/${event.txHash}`, '_blank')}
          >
            <ExternalIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const TransactionRow = React.memo(
    ({ event, animate = false }: { event: ProcessedEvent; animate?: boolean }) => {
      if (animate) {
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TransactionRowInner event={event} />
          </motion.div>
        );
      }

      return <TransactionRowInner event={event} />;
    },
  );

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Last transactions
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Loading transaction history...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Last transactions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" onClick={refetch} disabled={loading}>
                <RefreshIcon fontSize="small" />
              </IconButton>
              {allProcessedEvents.length > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={() => setModalOpen(true)}
                  size="small"
                >
                  View All
                </Button>
              )}
            </Box>
          </Box>

          {recentTransactions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {loading
                    ? 'Loading transactions from Sepolia Etherscan...'
                    : 'No transactions found. Start by sending or receiving tokens.'}
                </Typography>
              )}
            </Box>
          ) : (
            <Box>
              {recentTransactions.map((event, index) => (
                <Box key={event.id}>
                  <TransactionRow event={event} animate={true} />
                  {index < recentTransactions.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
              {allProcessedEvents.length > 4 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Showing {recentTransactions.length} of {allProcessedEvents.length} transactions
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modal for all transactions */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: '90%',
            maxWidth: 800,
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              All Transactions ({allProcessedEvents.length})
            </Typography>
            <IconButton onClick={() => setModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box>
            {groupedEvents.map((group) => (
              <Box key={group.date} sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  {group.date}
                </Typography>
                {group.events.map((event, index) => (
                  <Box key={event.id}>
                    <TransactionRow event={event} />
                    {index < group.events.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default TransactionHistory;
