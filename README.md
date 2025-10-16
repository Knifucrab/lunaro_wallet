# Wonderland Wallet
A simple React dApp for managing ERC-20 tokens on Sepolia testnet. Enjoy your trip was fun to develop it!

<img width="1898" height="863" alt="{3587B746-DB1C-4E0C-9416-D5E51FD9D7D9}" src="https://github.com/user-attachments/assets/de6d2536-7d7a-425d-9a40-96328ec7133f" />
<img width="1920" height="862" alt="{909B93CB-DD78-48DE-9D1D-E3C15A34AE7E}" src="https://github.com/user-attachments/assets/36cbd140-ff2a-476a-a80a-a54c735bdc1a" />
<img width="386" height="580" alt="{3394688F-FF9D-4906-8B59-ABA1EB033F0A}" src="https://github.com/user-attachments/assets/bee1a4a1-b976-4314-bf04-c3750c9ee8e0" />
<img width="391" height="669" alt="{AB83F1B6-43B1-4955-99F1-2C4F5D9FA693}" src="https://github.com/user-attachments/assets/fae8c47e-3846-4c02-8afb-b0017e8c0170" />
<img width="391" height="656" alt="{07817790-FDB5-455D-B9E2-75911DB93861}" src="https://github.com/user-attachments/assets/50e0cb58-c778-474d-9cca-fe3f347b81e2" />



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
