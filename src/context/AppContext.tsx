import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Token = 'DAI' | 'USDC';

export interface TokenBalance {
  symbol: Token;
  balance: string; // string representation of the balance for the user
}

export interface EventLog {
  id: string;
  type: 'transfer' | 'approval';
  token: Token;
  amount: string;
  from: string;
  to: string;
  txHash: string;
  timestamp: number;
}

interface AppState {
  balances: TokenBalance[];
  setBalances: (balances: TokenBalance[]) => void;
  events: EventLog[];
  addEvent: (event: EventLog) => void;
  setEvents: (events: EventLog[]) => void;
}

export const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [events, setEvents] = useState<EventLog[]>([]);

  const addEvent = (event: EventLog) => setEvents((prev) => [event, ...prev]);

  return (
    <AppContext.Provider value={{ balances, setBalances, events, addEvent, setEvents }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
