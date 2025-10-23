import React from 'react';
import { Box } from '@mui/material';

// Import PNG icons from the cryptocurrency-icons package
import ethPng from 'cryptocurrency-icons/32/color/eth.png';
import btcPng from 'cryptocurrency-icons/32/color/btc.png';
import daiPng from 'cryptocurrency-icons/32/color/dai.png';
import usdcPng from 'cryptocurrency-icons/32/color/usdc.png';

interface TokenIconProps {
  symbol: string;
  size?: number;
}

const TokenIcon: React.FC<TokenIconProps> = ({ symbol, size = 24 }) => {
  const tokenLower = (symbol || '').toLowerCase();

  const aliasMap: Record<string, string> = {
    wt6: 'usdc',
    wt18: 'dai',
  };

  const resolved = aliasMap[tokenLower] || tokenLower;

  const iconMap: Record<string, string> = {
    dai: '/dai.svg',
    usdc: '/usdc.svg',
    eth: '/eth.svg',
    ethereum: '/eth.svg',
    btc: '/btc.svg',
    bitcoin: '/btc.svg',
  };

  const candidates = [
    // prefer package icons
    resolved === 'eth' || resolved === 'ethereum' ? ethPng : undefined,
    resolved === 'btc' || resolved === 'bitcoin' ? btcPng : undefined,
    resolved === 'dai' ? daiPng : undefined,
    resolved === 'usdc' ? usdcPng : undefined,
    // fallback to public assets (if present)
    iconMap[resolved],
  ].filter(Boolean) as string[];

  const [srcIndex, setSrcIndex] = React.useState(0);

  const src = candidates[srcIndex] || '/dai.svg';

  React.useEffect(() => {
    // Reset to first candidate when symbol changes
    setSrcIndex(0);
  }, [resolved]);

  const handleImgError = () => {
    console.warn('[TokenIcon] failed to load', src, 'for symbol', symbol);
    // Try next candidate if available
    setSrcIndex((i) => Math.min(i + 1, candidates.length - 1));
  };

  return (
    <Box
      component="img"
      src={src}
      alt={`${symbol} icon`}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        objectFit: 'cover',
        backgroundColor: 'transparent',
      }}
      onError={handleImgError}
    />
  );
};

export default TokenIcon;
