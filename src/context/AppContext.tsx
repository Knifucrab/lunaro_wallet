import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Token = string;

export interface TokenBalance {
  symbol: string;
  balance: string; // string representation of the balance for the user
  price?: string; // USD price
  priceChange?: number; // percentage change (e.g., 1.68 for +1.68%)
  priceChangeAmount?: string; // dollar change amount (e.g., "+$12.08")
  // Additional numeric fields for calculations (optional)
  balanceRaw?: number; // raw numeric balance (e.g., 0.00106377)
  priceRaw?: number; // total USD value for this holding (e.g., 4.15)
}

interface AppState {
  balances: TokenBalance[];
  setBalances: (balances: TokenBalance[]) => void;
}

export const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [balances, setBalances] = useState<TokenBalance[]>([]);

  return <AppContext.Provider value={{ balances, setBalances }}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
