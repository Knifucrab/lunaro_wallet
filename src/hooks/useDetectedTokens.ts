import { useMemo } from 'react';
import { useEtherscanTransactions } from './useEtherscanTransactions';

export type DetectedToken = {
  symbol: string;
  address: `0x${string}`;
  decimals: number;
};

export function useDetectedTokens() {
  const { tokenTransactions } = useEtherscanTransactions();

  const tokens = useMemo(() => {
    const map = new Map<string, DetectedToken>();
    tokenTransactions.forEach((tx) => {
      if (!tx.contractAddress) return;
      const addr = tx.contractAddress as `0x${string}`;
      if (!map.has(addr.toLowerCase())) {
        const decimals = Number(tx.tokenDecimal) || 18;
        const symbol = tx.tokenSymbol || 'UNKNOWN';
        map.set(addr.toLowerCase(), { symbol, address: addr, decimals });
      }
    });
    return Array.from(map.values());
  }, [tokenTransactions]);

  return tokens;
}

export default useDetectedTokens;
