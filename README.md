# Wonderland Wallet

A simple React dApp for managing ERC-20 tokens on Sepolia testnet. Enjoy your trip was fun to develop it!

## Features

- View token balances (DAI/USDC)
- Approve token spending
- Transfer tokens
- Mint test tokens
- Transaction history

## Tech Stack

- **Framework**: Vite + React + TypeScript
- **UI**: Material-UI
- **State Management**: React Context
- **Blockchain**: Wagmi + RainbowKit
- **Code Quality**: ESLint + Prettier

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Usage

1. Connect your wallet (MetaMask recommended)
2. Switch to Sepolia testnet
3. Get test ETH from [Sepolia faucet](https://sepoliafaucet.com/)

## Key Decisions

- **Sepolia testnet only** - Safe for testing
- **Material-UI** - Fast prototyping with good defaults
- **wagmi/RainbowKit** - Standard web3 React toolkit
- **Context API** - Simple state management for small app
- **Vite** - Fast development experience

## Contract Addresses

- DAI: `0x1D70D57ccD2798323232B2dD027B3aBcA5C00091`
- USDC: `0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47`
