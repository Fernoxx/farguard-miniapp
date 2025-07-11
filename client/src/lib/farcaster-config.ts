import { createConfig } from 'wagmi';
import { mainnet, base, arbitrum, celo } from 'wagmi/chains';
import { http } from 'viem';
import { injected } from 'wagmi/connectors';

const chains = [mainnet, base, arbitrum, celo] as const;

export const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [celo.id]: http(),
  },
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
});

export const chainMapping = {
  [mainnet.id]: 'ethereum',
  [base.id]: 'base', 
  [arbitrum.id]: 'arbitrum',
  [celo.id]: 'celo',
};

export const reverseChainMapping = {
  ethereum: mainnet.id,
  base: base.id,
  arbitrum: arbitrum.id,
  celo: celo.id,
};