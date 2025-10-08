import { describe, it, expect } from 'vitest';

// Helper function to format addresses - extracted for testing
export const formatAddress = (addr: string) => {
  if (!addr) return 'Unknown';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

// Helper to format amounts
export const formatAmount = (amount: string, token: string, type: string) => {
  const prefix = type === 'incoming' ? '+' : type === 'outgoing' ? '-' : '';
  return `${prefix}${parseFloat(amount).toFixed(2)} ${token}`;
};

describe('Utility Functions', () => {
  describe('formatAddress', () => {
    it('formats valid address correctly', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      expect(formatAddress(address)).toBe('0x1234...5678');
    });

    it('handles empty address', () => {
      expect(formatAddress('')).toBe('Unknown');
    });

    it('handles undefined address', () => {
      expect(formatAddress(null as unknown as string)).toBe('Unknown');
    });
  });

  describe('formatAmount', () => {
    it('formats incoming amount with plus', () => {
      expect(formatAmount('100.5', 'USDC', 'incoming')).toBe('+100.50 USDC');
    });

    it('formats outgoing amount with minus', () => {
      expect(formatAmount('50.75', 'DAI', 'outgoing')).toBe('-50.75 DAI');
    });

    it('formats approval without prefix', () => {
      expect(formatAmount('1000', 'DAI', 'approval')).toBe('1000.00 DAI');
    });

    it('handles decimal formatting', () => {
      expect(formatAmount('1.1', 'USDC', 'incoming')).toBe('+1.10 USDC');
    });
  });
});
