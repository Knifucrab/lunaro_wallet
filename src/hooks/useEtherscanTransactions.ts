import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount } from 'wagmi';

// Etherscan V2 API base URL (multichain API)
const ETHERSCAN_V2_API_URL = 'https://api.etherscan.io/v2/api';

// Mainnet chain ID
const MAINNET_CHAIN_ID = 1;

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

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useEtherscanTransactions = (): UseEtherscanTransactionsResult => {
  const { address } = useAccount();
  const [tokenTransactions, setTokenTransactions] = useState<EtherscanTokenTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithRetry = async (params: Record<string, unknown>, retries = 5) => {
    let attempt = 0;
    let backoff = 500; // start 500ms
    while (attempt < retries) {
      try {
        console.log('[useEtherscanTransactions] request params:', params);
        const resp = await axios.get(ETHERSCAN_V2_API_URL, { params });
        console.log('[useEtherscanTransactions] response:', resp.data);
        // If rate limit message, wait and retry
        const msg = resp.data?.message || '';
        if (typeof msg === 'string' && msg.toLowerCase().includes('rate limit')) {
          console.warn('[useEtherscanTransactions] rate limited, backing off', backoff);
          await delay(backoff);
          backoff *= 2;
          attempt += 1;
          continue;
        }
        return resp.data;
      } catch (err: unknown) {
        const e = err as { message?: string; response?: { data?: { message?: string } } };
        const maybeMsg = e?.response?.data?.message;
        const isRate = typeof maybeMsg === 'string' && maybeMsg.toLowerCase().includes('rate');
        console.error(
          '[useEtherscanTransactions] fetch error:',
          e?.message || err,
          e?.response?.data,
        );
        if (isRate) {
          await delay(backoff);
          backoff *= 2;
          attempt += 1;
          continue;
        }
        throw err;
      }
    }
    throw new Error('Exceeded retries for Etherscan');
  };

  const fetchTransactions = async () => {
    if (!address) {
      console.log('No wallet address connected');
      setTokenTransactions([]);
      return;
    }

    if (!API_KEY) {
      const msg =
        'Missing Etherscan API key. Add VITE_ETHERSCAN_API_KEY to .env.local (see ETHERSCAN_API_SETUP.md)';
      console.warn(msg);
      setError(msg);
      setTokenTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching transactions (txlist + tokentx) for address:', address);

      // 1) fetch normal transactions (txlist)
      const txlistParams = {
        chainid: MAINNET_CHAIN_ID,
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 200,
        sort: 'desc',
        apikey: API_KEY,
      };

      const txlistData = await fetchWithRetry(txlistParams).catch((e) => {
        console.warn('txlist fetch failed:', e.message || e);
        return null;
      });

      // 2) fetch ERC20 token transfers (tokentx)
      const tokenTxParams = {
        chainid: MAINNET_CHAIN_ID,
        module: 'account',
        action: 'tokentx',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 200,
        sort: 'desc',
        apikey: API_KEY,
      };

      const tokenTxData = await fetchWithRetry(tokenTxParams).catch((e) => {
        console.warn('tokentx fetch failed:', e.message || e);
        return null;
      });

      // Normalize results: token transfers keep their fields; normal txs are converted to token-like objects with ETH
      const normalTxs = Array.isArray(txlistData?.result) ? txlistData.result : [];
      const tokenTxs = Array.isArray(tokenTxData?.result) ? tokenTxData.result : [];

      // Convert normal txs to EtherscanTokenTransaction-shaped entries representing ETH transfers
      const convertedNormal = normalTxs.map((tx: unknown) => {
        const t = tx as Record<string, unknown>;
        return {
          blockNumber: (t.blockNumber as string) ?? '',
          timeStamp: (t.timeStamp as string) ?? '',
          hash: (t.hash as string) ?? '',
          nonce: (t.nonce as string) ?? '0',
          blockHash: (t.blockHash as string) ?? '',
          from: (t.from as string) ?? '',
          contractAddress: '',
          to: (t.to as string) ?? '',
          value: (t.value as string) ?? '0',
          tokenName: 'Ether',
          tokenSymbol: 'ETH',
          tokenDecimal: '18',
          transactionIndex: (t.transactionIndex as string) ?? '0',
          gas: (t.gas as string) ?? '0',
          gasPrice: (t.gasPrice as string) ?? '0',
          gasUsed: (t.gasUsed as string) ?? '0',
          cumulativeGasUsed: (t.cumulativeGasUsed as string) ?? '0',
          input: (t.input as string) ?? '0x',
          confirmations: (t.confirmations as string) ?? '0',
        };
      });

      // Merge and sort by timestamp desc
      const merged = (
        [
          ...convertedNormal,
          ...(tokenTxs as EtherscanTokenTransaction[]),
        ] as EtherscanTokenTransaction[]
      ).sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp));

      // If both are empty, handle no transactions
      if (merged.length === 0) {
        console.log('No transactions found for this address');
        setTokenTransactions([]);
      } else {
        console.log(`Found ${merged.length} transactions (normal + token)`);
        setTokenTransactions(merged as EtherscanTokenTransaction[]);
      }
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { data?: unknown } };
      console.error('Error fetching Etherscan transactions:', e?.message || err, e?.response?.data);
      setError(e instanceof Error ? e.message : 'Failed to fetch transactions');
      setTokenTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch once when the address changes
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return {
    tokenTransactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
};
