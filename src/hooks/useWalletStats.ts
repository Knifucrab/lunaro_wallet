import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { useTokenPrices } from './useTokenPrices';

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

export interface WalletStats {
  totalAssets: number;
  totalDeposits: number;
  apy: number;
  totalBalance: number;
  priceChange24h: number;
}

export function useWalletStats() {
  const { address } = useAccount();
  const { prices } = useTokenPrices();
  const [stats, setStats] = useState<WalletStats>({
    totalAssets: 0,
    totalDeposits: 0,
    apy: 8.6,
    totalBalance: 0,
    priceChange24h: 2.34,
  });

  const daiBalance = useReadContract({
    address: TOKENS[0].address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const usdcBalance = useReadContract({
    address: TOKENS[1].address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (address && daiBalance.data !== undefined && usdcBalance.data !== undefined && prices) {
      // Calculate actual balances in tokens
      const daiAmount = Number(daiBalance.data) / Math.pow(10, TOKENS[0].decimals);
      const usdcAmount = Number(usdcBalance.data) / Math.pow(10, TOKENS[1].decimals);

      // Calculate USD values
      const daiPrice = prices.DAI?.usd || 1;
      const usdcPrice = prices.USDC?.usd || 1;

      const daiValue = daiAmount * daiPrice;
      const usdcValue = usdcAmount * usdcPrice;

      const totalBalance = daiValue + usdcValue;

      // Calculate average price change weighted by holdings
      const totalValue = daiValue + usdcValue;
      const weightedChange =
        totalValue > 0
          ? (daiValue / totalValue) * (prices.DAI?.usd_24h_change || 0) +
            (usdcValue / totalValue) * (prices.USDC?.usd_24h_change || 0)
          : 0;

      setStats({
        totalAssets: totalBalance,
        totalDeposits: totalBalance * 0.65, // Assuming 65% is deposited
        apy: 8.6, // This would come from your DeFi protocol
        totalBalance: totalBalance,
        priceChange24h: weightedChange,
      });
    }
    // Re-run when relevant on-chain data or prices change
  }, [address, daiBalance.data, usdcBalance.data, prices]);

  return stats;
}
