import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { erc20Abi } from 'viem';

// Extended ABI for mint
const erc20WithMintAbi = [
  ...erc20Abi,
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;

type ApproveOrTransferOpts = {
  tokenAddress: `0x${string}`;
  decimals: number;
  recipient: string;
  amount: string;
  balance?: string;
  onSuccess?: () => void;
};

type MintOpts = {
  tokenAddress: `0x${string}`;
  decimals: number;
  mintAmount: string;
  onSuccess?: () => void;
};

export default function useTokenActions() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const validate = (recipient: string, amount: string, balance = '0') => {
    if (!address) return 'Connect your wallet.';
    if (!recipient) return 'Recipient is required.';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return 'Enter a valid amount.';
    if (Number(amount) > Number(String(balance).replace(/,/g, ''))) return 'Not enough funds.';
    return '';
  };

  const approve = async (opts: ApproveOrTransferOpts) => {
    const { tokenAddress, decimals, recipient, amount, balance, onSuccess } = opts;
    setError('');
    setSuccess('');
    const err = validate(recipient, amount, balance);
    if (err) return setError(err);
    setLoading(true);
    try {
      const tx = await writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [recipient as `0x${string}`, BigInt(Number(amount) * 10 ** decimals)],
      });
      queryClient.invalidateQueries();
      setModalTitle('Transaction');
      setModalContent(String(tx));
      setSuccess('Approve success!');
      onSuccess?.();
    } catch (e: unknown) {
      const errorObj = e as Error;
      setModalTitle('Error');
      setModalContent(errorObj.message || 'Approve failed');
      setError('Approve failed. Show the error');
    }
    setLoading(false);
  };

  const transfer = async (opts: ApproveOrTransferOpts) => {
    const { tokenAddress, decimals, recipient, amount, balance, onSuccess } = opts;
    setError('');
    setSuccess('');
    const err = validate(recipient, amount, balance);
    if (err) return setError(err);
    setLoading(true);
    try {
      const tx = await writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, BigInt(Number(amount) * 10 ** decimals)],
      });
      queryClient.invalidateQueries();
      setModalTitle('Transaction');
      setModalContent(String(tx));
      setSuccess('Transfer success. Check details');
      onSuccess?.();
    } catch (e: unknown) {
      const errorObj = e as Error;
      setModalTitle('Error');
      setModalContent(errorObj.message || 'Transfer failed');
      setError('Transfer failed. Show the error');
    }
    setLoading(false);
  };

  const mint = async (opts: MintOpts) => {
    const { tokenAddress, decimals, mintAmount, onSuccess } = opts;
    setError('');
    setSuccess('');
    if (!address) return setError('Connect your wallet.');
    setLoading(true);
    try {
      const tx = await writeContractAsync({
        address: tokenAddress,
        abi: erc20WithMintAbi,
        functionName: 'mint',
        args: [address as `0x${string}`, BigInt(Number(mintAmount) * 10 ** decimals)],
      });
      queryClient.invalidateQueries();
      setModalTitle('Transaction');
      setModalContent(String(tx));
      setSuccess(`Minted ${mintAmount} successfully!`);
      onSuccess?.();
    } catch (e: unknown) {
      const errorObj = e as Error;
      setModalTitle('Error');
      setModalContent(errorObj.message || 'Mint failed. This token may not support minting.');
      setError('Mint failed. Show the error');
    }
    setLoading(false);
  };

  return {
    loading,
    error,
    success,
    modalOpen,
    modalTitle,
    modalContent,
    setModalOpen,
    setError,
    setSuccess,
    validate,
    approve,
    transfer,
    mint,
  } as const;
}
