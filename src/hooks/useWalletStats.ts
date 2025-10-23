import { useEffect, useState } from 'react';
import { useTokenPrices } from './useTokenPrices';
import { useAppContext } from '../context/useAppContext';

// (Token list removed; totals are now computed from AppContext balances)

export interface WalletStats {
  totalAssets: number;
  totalDeposits: number;
  apy: number;
  totalBalance: number;
  priceChange24h: number;
}

export function useWalletStats() {
  const { prices } = useTokenPrices();
  const { balances } = useAppContext();
  const [stats, setStats] = useState<WalletStats>({
    totalAssets: 0,
    totalDeposits: 0,
    apy: 8.6,
    totalBalance: 0,
    priceChange24h: 2.34,
  });

  useEffect(() => {
    // Compute totals from AppContext balances, which include priceRaw
    const totalUSD = balances.reduce((acc, b) => acc + (b.priceRaw || 0), 0);
    const totalAssets = totalUSD;
    const totalDeposits = totalUSD * 0.65;

    // Compute weighted price change if available
    const weightedChange = (() => {
      const totalValue = balances.reduce((acc, b) => acc + (b.priceRaw || 0), 0);
      if (totalValue <= 0) return 0;
      return (
        balances.reduce((acc, b) => {
          const val = b.priceRaw || 0;
          const change = b.priceChange || 0;
          return acc + (val / totalValue) * change;
        }, 0) || 0
      );
    })();

    console.log(
      '[useWalletStats] balances:',
      balances,
      'totalUSD:',
      totalUSD,
      'weightedChange:',
      weightedChange,
    );

    setStats({
      totalAssets,
      totalDeposits,
      apy: 8.6,
      totalBalance: totalUSD,
      priceChange24h: weightedChange,
    });
  }, [balances, prices]);

  return stats;
}
