import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';
import { useAppContext } from '../context/useAppContext';
import type { EventLog } from '../context/AppContext';

const TOKENS = [
  {
    symbol: 'DAI',
    address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091' as `0x${string}`,
    decimals: 18,
  },
  {
    symbol: 'USDC',
    address: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47' as `0x${string}`,
    decimals: 6,
  },
];

export function useHistoricalEvents() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { setEvents } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [historicalFetched, setHistoricalFetched] = useState(false);

  useEffect(() => {
    if (!address || !publicClient || historicalFetched) return;

    const fetchHistoricalEvents = async () => {
      setLoading(true);
      try {
        const historicalEvents: EventLog[] = [];

        // Define Transfer event ABI
        const transferEvent = parseAbiItem(
          'event Transfer(address indexed from, address indexed to, uint256 value)',
        );
        const approvalEvent = parseAbiItem(
          'event Approval(address indexed owner, address indexed spender, uint256 value)',
        );

        for (const token of TOKENS) {
          // Get current block - limiting range to avoid RPC rate limits
          const currentBlock = await publicClient.getBlockNumber();
          const fromBlock = currentBlock - 5000n > 0n ? currentBlock - 5000n : 0n; // Fetch Transfer events where user is sender or receiver
          const [transfersFrom, transfersTo, approvals] = await Promise.all([
            // Transfers from user
            publicClient.getLogs({
              address: token.address,
              event: transferEvent,
              args: {
                from: address,
              },
              fromBlock,
              toBlock: 'latest',
            }),
            // Transfers to user
            publicClient.getLogs({
              address: token.address,
              event: transferEvent,
              args: {
                to: address,
              },
              fromBlock,
              toBlock: 'latest',
            }),
            // Approvals by user
            publicClient.getLogs({
              address: token.address,
              event: approvalEvent,
              args: {
                owner: address,
              },
              fromBlock,
              toBlock: 'latest',
            }),
          ]);

          // Process Transfer events (from user)
          for (const log of transfersFrom) {
            if (log.args.from && log.args.to && log.args.value !== undefined) {
              // Get block timestamp
              const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
              historicalEvents.push({
                id: `${log.transactionHash}-${log.logIndex}`,
                type: 'transfer',
                token: token.symbol as 'DAI' | 'USDC',
                amount: (Number(log.args.value) / Math.pow(10, token.decimals)).toString(),
                from: log.args.from,
                to: log.args.to,
                txHash: log.transactionHash,
                timestamp: Number(block.timestamp) * 1000,
              });
            }
          }

          // Process Transfer events (to user)
          for (const log of transfersTo) {
            if (log.args.from && log.args.to && log.args.value !== undefined) {
              // Skip if we already added this event (user transferring to themselves)
              const isDuplicate = historicalEvents.some(
                (e: EventLog) => e.id === `${log.transactionHash}-${log.logIndex}`,
              );
              if (!isDuplicate) {
                const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
                historicalEvents.push({
                  id: `${log.transactionHash}-${log.logIndex}`,
                  type: 'transfer',
                  token: token.symbol as 'DAI' | 'USDC',
                  amount: (Number(log.args.value) / Math.pow(10, token.decimals)).toString(),
                  from: log.args.from,
                  to: log.args.to,
                  txHash: log.transactionHash,
                  timestamp: Number(block.timestamp) * 1000,
                });
              }
            }
          }

          // Process Approval events
          for (const log of approvals) {
            if (log.args.owner && log.args.spender && log.args.value !== undefined) {
              const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
              historicalEvents.push({
                id: `${log.transactionHash}-${log.logIndex}`,
                type: 'approval',
                token: token.symbol as 'DAI' | 'USDC',
                amount: (Number(log.args.value) / Math.pow(10, token.decimals)).toString(),
                from: log.args.owner,
                to: log.args.spender,
                txHash: log.transactionHash,
                timestamp: Number(block.timestamp) * 1000,
              });
            }
          }
        }

        // Sort historical events by timestamp (most recent first) and update context
        const sortedEvents = historicalEvents.sort(
          (a: EventLog, b: EventLog) => b.timestamp - a.timestamp,
        );

        setEvents(sortedEvents);
        setHistoricalFetched(true);
      } catch {
        // Silently handle errors to avoid console noise
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalEvents();
  }, [address, publicClient, setEvents, historicalFetched]);

  return { loading };
}
