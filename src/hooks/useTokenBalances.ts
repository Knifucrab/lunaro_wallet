import { useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import type { TokenBalance } from '../context/AppContext';
import { erc20Abi, formatUnits } from 'viem';
import { useAppContext } from '../context/useAppContext';
import { useTokenPrices } from './useTokenPrices';
import useDetectedTokens from './useDetectedTokens';

export function useTokenBalances() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { setBalances } = useAppContext();
  const { prices } = useTokenPrices();
  const detected = useDetectedTokens();

  useEffect(() => {
    if (!address) {
      setBalances([]);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        if (!publicClient) return;

        // Always fetch native ETH balance so users see their ETH even if no ERC-20 tokens detected
        const nativeRaw = await publicClient.getBalance({ address: address as `0x${string}` });
        const nativeNumber = Number(formatUnits(nativeRaw as bigint, 18));
        console.log('[useTokenBalances] nativeRaw:', nativeRaw, 'nativeNumber:', nativeNumber);

        const ethPrice = prices?.ETH;
        const ethUsd = ethPrice?.usd || 0;
        const results: TokenBalance[] = [
          {
            symbol: 'ETH',
            balance: nativeNumber.toLocaleString(),
            balanceRaw: nativeNumber,
            priceRaw: Number((nativeNumber * ethUsd).toFixed(6)),
            price: ethPrice ? `$${(nativeNumber * ethUsd).toFixed(6)} USD` : undefined,
            priceChange: ethPrice ? Number(ethPrice.usd_24h_change.toFixed(2)) : undefined,
            priceChangeAmount: ethPrice
              ? `${ethPrice.usd_24h_change >= 0 ? '+' : ''}$${(
                  ethPrice.usd *
                  (ethPrice.usd_24h_change / 100) *
                  nativeNumber
                ).toFixed(6)}`
              : undefined,
          },
        ];

        // If detected tokens exist, fetch ERC-20 balances and append
        if (detected && detected.length > 0) {
          console.log('[useTokenBalances] detected tokens:', detected);
          const tokenResults = await Promise.all(
            detected.map(async (t) => {
              try {
                const raw = await publicClient.readContract({
                  address: t.address,
                  abi: erc20Abi,
                  functionName: 'balanceOf',
                  args: [address as `0x${string}`],
                });
                const balanceNum = Number(raw) / Math.pow(10, t.decimals);
                console.log(
                  '[useTokenBalances] readContract',
                  t.symbol,
                  t.address,
                  'raw:',
                  raw,
                  'balanceNum:',
                  balanceNum,
                );
                const tokenPrice = prices?.[t.symbol as string];
                return {
                  symbol: t.symbol,
                  balance: balanceNum.toLocaleString(),
                  price: tokenPrice ? `$${tokenPrice.usd.toFixed(4)} USD` : undefined,
                  priceChange: tokenPrice ? Number(tokenPrice.usd_24h_change.toFixed(2)) : 0,
                  priceChangeAmount: tokenPrice
                    ? `${tokenPrice.usd_24h_change >= 0 ? '+' : ''}$${(
                        tokenPrice.usd *
                        (tokenPrice.usd_24h_change / 100)
                      ).toFixed(4)}`
                    : undefined,
                };
              } catch (err) {
                console.error('readContract error', err);
                return {
                  symbol: t.symbol,
                  balance: '0',
                } as TokenBalance;
              }
            }),
          );

          results.push(...(tokenResults as TokenBalance[]));
        }

        if (mounted) setBalances(results as TokenBalance[]);
      } catch (err) {
        console.error('Failed to fetch dynamic token balances', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [address, detected, publicClient, setBalances, prices]);
}
