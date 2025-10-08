import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box } from '@mui/material';

const WalletConnect: React.FC = () => {
  return (
    <Box sx={{ '& button': { borderRadius: 2 } }}>
      <ConnectButton />
    </Box>
  );
};

export default WalletConnect;
