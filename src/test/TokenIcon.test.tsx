import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TokenIcon from '../components/TokenIcon';

describe('TokenIcon Component', () => {
  it('renders DAI icon correctly', () => {
    render(<TokenIcon symbol="DAI" size={24} />);

    const icon = screen.getByAltText('DAI icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/dai.svg');
  });

  it('renders USDC icon correctly', () => {
    render(<TokenIcon symbol="USDC" size={24} />);

    const icon = screen.getByAltText('USDC icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/usdc.svg');
  });

  it('falls back to DAI for unknown tokens', () => {
    render(<TokenIcon symbol="UNKNOWN" size={24} />);

    const icon = screen.getByAltText('UNKNOWN icon');
    expect(icon).toHaveAttribute('src', '/dai.svg');
  });

  it('applies correct size', () => {
    render(<TokenIcon symbol="DAI" size={32} />);

    const icon = screen.getByAltText('DAI icon');
    expect(icon).toHaveStyle({ width: '32px', height: '32px' });
  });
});
