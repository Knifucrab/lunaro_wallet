import { useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { useAppContext } from '../context/useAppContext';
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

export function useTokenBalances() {
  const { address } = useAccount();
  const { setBalances } = useAppContext();
  const { prices } = useTokenPrices();

  const dai = useReadContract({
    address: TOKENS[0].address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
  const usdc = useReadContract({
    address: TOKENS[1].address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (address && dai.data !== undefined && usdc.data !== undefined) {
      const daiPrice = prices?.DAI;
      const usdcPrice = prices?.USDC;

      setBalances([
        {
          symbol: 'DAI',
          balance: (Number(dai.data) / Math.pow(10, TOKENS[0].decimals)).toLocaleString(),
          price: daiPrice ? `$${daiPrice.usd.toFixed(4)} USD` : '$1.00 USD',
          priceChange: daiPrice ? Number(daiPrice.usd_24h_change.toFixed(2)) : 0,
          priceChangeAmount: daiPrice
            ? `${daiPrice.usd_24h_change >= 0 ? '+' : ''}$${(
                daiPrice.usd *
                (daiPrice.usd_24h_change / 100)
              ).toFixed(4)}`
            : '+$0.00',
        },
        {
          symbol: 'USDC',
          balance: (Number(usdc.data) / Math.pow(10, TOKENS[1].decimals)).toLocaleString(),
          price: usdcPrice ? `$${usdcPrice.usd.toFixed(4)} USD` : '$1.00 USD',
          priceChange: usdcPrice ? Number(usdcPrice.usd_24h_change.toFixed(2)) : 0,
          priceChangeAmount: usdcPrice
            ? `${usdcPrice.usd_24h_change >= 0 ? '+' : ''}$${(
                usdcPrice.usd *
                (usdcPrice.usd_24h_change / 100)
              ).toFixed(4)}`
            : '+$0.00',
        },
      ]);
    }
  }, [address, dai.data, usdc.data, setBalances, prices]);
}
