import React, { useState } from 'react';
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
} from '@mui/material';
import {
  VisibilityOutlined as ViewIcon,
  Close as CloseIcon,
  ArrowUpward as OutgoingIcon,
  ArrowDownward as IncomingIcon,
  CheckCircle as ApprovalIcon,
  OpenInNew as ExternalIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/useAppContext';
import { useHistoricalEvents } from '../hooks/useHistoricalEvents';
import { useAccount } from 'wagmi';
import TokenIcon from './TokenIcon';
import type { EventLog } from '../context/AppContext';

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
  const { events } = useAppContext();
  const { loading } = useHistoricalEvents();
  const { address: userAddress } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    // Quick date formatting - could probably clean this up
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const processEvents = (events: EventLog[]): ProcessedEvent[] => {
    return events.map((event) => {
      const isIncoming = event.to?.toLowerCase() === userAddress?.toLowerCase();
      const isOutgoing = event.from?.toLowerCase() === userAddress?.toLowerCase();

      let type: 'incoming' | 'outgoing' | 'approval';
      let address: string;

      if (event.type === 'approval') {
        type = 'approval';
        address = event.to || 'Unknown';
      } else if (isIncoming && !isOutgoing) {
        type = 'incoming';
        address = event.from || 'Unknown';
      } else {
        type = 'outgoing';
        address = event.to || 'Unknown';
      }

      return {
        id: event.id || event.txHash || `${Date.now()}-${Math.random()}`,
        type,
        token: event.token || 'UNKNOWN',
        amount: event.amount || '0',
        address,
        txHash: event.txHash || '',
        timestamp: event.timestamp || Date.now(),
      };
    });
  };

  const groupEventsByDate = (processedEvents: ProcessedEvent[]): GroupedEvent[] => {
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
  };

  const processedEvents = processEvents(events);
  const groupedEvents = groupEventsByDate(processedEvents);
  const recentTransactions = processedEvents.slice(0, 4); // Show only last 4 transactions

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

  const TransactionRow = ({
    event,
    animate = false,
  }: {
    event: ProcessedEvent;
    animate?: boolean;
  }) => {
    const content = (
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

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      );
    }

    return content;
  };

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
            {events.length > 0 && (
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

          {recentTransactions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No transactions found. Start by minting, approving, or transferring tokens.
              </Typography>
            </Box>
          ) : (
            <Box>
              {recentTransactions.map((event, index) => (
                <Box key={event.id}>
                  <TransactionRow event={event} animate={true} />
                  {index < recentTransactions.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
              {events.length > 4 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Showing {recentTransactions.length} of {events.length} transactions
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
              All Transactions ({events.length})
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
