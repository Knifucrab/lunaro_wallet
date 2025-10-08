import React from 'react';
import { Box } from '@mui/material';

interface TokenIconProps {
  symbol: string;
  size?: number;
}

const TokenIcon: React.FC<TokenIconProps> = ({ symbol, size = 24 }) => {
  // Token icon URLs from cryptocurrency-icons
  const getTokenIcon = (token: string) => {
    const tokenLower = token.toLowerCase();

    const iconMap: Record<string, string> = {
      dai: '/dai.svg',
      usdc: '/usdc.svg',
    };

    return iconMap[tokenLower] || iconMap.dai;
  };

  return (
    <Box
      component="img"
      src={getTokenIcon(symbol)}
      alt={`${symbol} icon`}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
      }}
      onError={(e) => {
        // Fallback to a colored circle with symbol if image fails
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.parentElement!.innerHTML = `
          <div style="
            width: ${size}px; 
            height: ${size}px; 
            border-radius: 50%; 
            background: linear-gradient(135deg, #1976d2, #42a5f5);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${size * 0.4}px;
            font-weight: 600;
          ">
            ${symbol}
          </div>
        `;
      }}
    />
  );
};

export default TokenIcon;
