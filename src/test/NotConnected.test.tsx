import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotConnected from '../components/NotConnected';

// Mock the wallet connect component since it has external dependencies
vi.mock('../components/WalletConnect', () => ({
  default: () => <button>Connect Wallet</button>,
}));

describe('NotConnected Component', () => {
  it('shows the connect wallet message', () => {
    render(<NotConnected />);

    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
    expect(screen.getByText(/please connect your wallet first/i)).toBeInTheDocument();
  });

  it('displays the knifucrab logo', () => {
    render(<NotConnected />);

    const logo = screen.getByAltText('Knifucrab Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/knifucrab.svg');
  });

  it('shows connect button', () => {
    render(<NotConnected />);

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });
});
