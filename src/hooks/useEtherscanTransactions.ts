import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount } from 'wagmi';

// Sepolia Etherscan API base URL
const SEPOLIA_API_URL = 'https://api-sepolia.etherscan.io/api';

// Read API key from Vite env. When running locally, put the key in a `.env.local` file
// as VITE_ETHERSCAN_API_KEY=your_key and restart the dev server.
const API_KEY =
  (import.meta as unknown as { env: Record<string, string | undefined> }).env
    .VITE_ETHERSCAN_API_KEY || '';

export interface EtherscanTokenTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

interface UseEtherscanTransactionsResult {
  tokenTransactions: EtherscanTokenTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useEtherscanTransactions = (): UseEtherscanTransactionsResult => {
  const { address } = useAccount();
  const [tokenTransactions, setTokenTransactions] = useState<EtherscanTokenTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!address) {
      console.log('No wallet address connected');
      setTokenTransactions([]);
      return;
    }

    // If there's no API key configured, bail early with a helpful error
    if (!API_KEY) {
      const msg =
        'Missing Etherscan API key. Add VITE_ETHERSCAN_API_KEY to .env.local (see ETHERSCAN_API_SETUP.md)';
      console.warn(msg);
      setError(msg);
      setTokenTransactions([]);
      return;
    }

    console.log('Fetching transactions for address:', address);
    setLoading(true);
    setError(null);

    try {
      // Fetch ERC20 token transfer events only
      const tokenTxResponse = await axios.get(SEPOLIA_API_URL, {
        params: {
          module: 'account',
          action: 'tokentx',
          address: address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 200, // Get up to last 200 token transactions
          sort: 'desc', // Most recent first
          apikey: API_KEY,
        },
      });

      console.log('Token TX Response:', tokenTxResponse.data);

      if (tokenTxResponse.data.status === '1') {
        const txs = tokenTxResponse.data.result || [];
        console.log(`Found ${txs.length} token transactions`);
        setTokenTransactions(txs);
      } else if (
        tokenTxResponse.data.status === '0' &&
        tokenTxResponse.data.message === 'No transactions found'
      ) {
        // This is OK - just means no transactions yet
        console.log('No token transactions found for this address');
        setTokenTransactions([]);
      } else {
        console.warn('Token transactions API returned:', tokenTxResponse.data.message);
        setTokenTransactions([]);
        if (typeof tokenTxResponse.data.message === 'string') {
          const m = tokenTxResponse.data.message;
          if (
            m.includes('Invalid API Key') ||
            m.includes('Missing/Invalid API Key') ||
            m.includes('Too many invalid api key attempts')
          ) {
            setError(
              `Etherscan API error: ${m}. Please verify VITE_ETHERSCAN_API_KEY in .env.local`,
            );
            setStopPolling(true);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching Etherscan transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      setTokenTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Stop polling if we detect an invalid key to avoid repeated rate-limit errors
  const [stopPolling, setStopPolling] = useState(false);

  useEffect(() => {
    // If polling has been stopped (invalid key), skip fetch
    if (stopPolling) return;

    // Fetch once when the address (or stopPolling) changes. Manual refetch is
    // still available via the returned refetch function.
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, stopPolling]);

  return {
    tokenTransactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
};
