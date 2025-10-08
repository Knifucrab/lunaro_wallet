import { useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { useAppContext } from '../context/useAppContext';

const TOKENS = [
  {
    symbol: 'DAI',
    address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    address: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47',
    decimals: 6,
  },
];

export function useTokenBalances() {
  const { address } = useAccount();
  const { setBalances } = useAppContext();

  const dai = useReadContract({
    address: TOKENS[0].address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
  });
  const usdc = useReadContract({
    address: TOKENS[1].address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  useEffect(() => {
    if (address && dai.data !== undefined && usdc.data !== undefined) {
      setBalances([
        {
          symbol: 'DAI',
          balance: (Number(dai.data) / Math.pow(10, TOKENS[0].decimals)).toLocaleString(),
        },
        {
          symbol: 'USDC',
          balance: (Number(usdc.data) / Math.pow(10, TOKENS[1].decimals)).toLocaleString(),
        },
      ]);
    }
  }, [address, dai.data, usdc.data, setBalances]);
}
