import { Chain } from '@xdefi-tech/chains-core';

export enum CosmosHubChains {
  cosmoshub = 'cosmoshub',
  osmosis = 'osmosis',
  axelar = 'axelar',
  juno = 'juno',
  crescent = 'crescent',
  kava = 'kava',
  stargaze = 'stargaze',
  akash = 'akash',
  cronos = 'cronos',
  kujira = 'kujira',
  stride = 'stride',
  mars = 'mars',
}

export const COSMOS_MANIFESTS: { [key in CosmosHubChains]: Chain.Manifest } = {
  [CosmosHubChains.cosmoshub]: {
    name: 'Cosmos Hub',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/cosmos/lcd/mainnet',
    chainSymbol: 'ATOM',
    blockExplorerURL: 'https://www.mintscan.io/cosmos/account',
    chainId: 'cosmoshub-4',
    chain: 'cosmos',
  },
  [CosmosHubChains.osmosis]: {
    name: 'Osmosis',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/osmosis/lcd/mainnet',
    chainSymbol: 'OSMO',
    blockExplorerURL: 'https://www.mintscan.io/osmosis/account',
    chainId: 'osmosis-1',
    chain: 'osmosis',
  },
  [CosmosHubChains.axelar]: {
    name: 'Axelar',
    description: '',
    rpcURL: 'https://www.mintscan.io/axelar/txs',
    chainSymbol: 'AXL',
    blockExplorerURL: 'https://www.mintscan.io/axelar/account',
    chainId: 'axelar-dojo-1',
    chain: 'alexar',
  },
  [CosmosHubChains.juno]: {
    name: 'JUNO',
    description: '',
    rpcURL: 'https://www.mintscan.io/juno/txs',
    chainSymbol: 'JUNO',
    blockExplorerURL: 'https://www.mintscan.io/juno/account',
    chainId: 'juno-1',
    chain: 'juno',
  },
  [CosmosHubChains.crescent]: {
    name: 'Crescent',
    description: '',
    rpcURL: 'https://www.mintscan.io/crescent/txs',
    chainSymbol: 'CRE',
    blockExplorerURL: 'https://www.mintscan.io/crescent/account',
    chainId: 'crescent-1',
    chain: 'crescent',
  },
  [CosmosHubChains.kava]: {
    name: 'Kava',
    description: '',
    rpcURL: 'https://www.mintscan.io/kava/txs',
    chainSymbol: 'KAVA',
    blockExplorerURL: 'https://www.mintscan.io/kava/account',
    chainId: 'kava_2222-10',
    chain: 'kava',
  },
  [CosmosHubChains.stargaze]: {
    name: 'Stargaze',
    description: '',
    rpcURL: 'https://www.mintscan.io/stargaze/txs',
    chainSymbol: 'STARS',
    blockExplorerURL: 'https://www.mintscan.io/stargaze/account',
    chainId: 'stargaze-1',
    chain: 'stargaze',
  },
  [CosmosHubChains.akash]: {
    name: 'Akash',
    description: '',
    rpcURL: 'https://www.mintscan.io/akash/txs',
    chainSymbol: 'AKT',
    blockExplorerURL: 'https://www.mintscan.io/akash/account',
    chainId: 'akashnet-2',
    chain: 'akash',
  },
  [CosmosHubChains.cronos]: {
    name: 'Crypto.Org',
    description: '',
    rpcURL: 'https://www.mintscan.io/cronos/txs',
    chainSymbol: 'CRO',
    blockExplorerURL: 'https://www.mintscan.io/cronos/account',
    chainId: 'crypto-org-chain-mainnet-1',
    chain: 'cronos',
  },
  [CosmosHubChains.kujira]: {
    name: 'Kujira',
    description: '',
    rpcURL: 'https://www.mintscan.io/kujira/txs',
    chainSymbol: 'KUJI',
    blockExplorerURL: 'https://www.mintscan.io/kujira/account',
    chainId: 'kaiyo-1',
    chain: 'kujira',
  },
  [CosmosHubChains.stride]: {
    name: 'Stride',
    description: '',
    rpcURL: 'https://www.mintscan.io/stride/txs',
    chainSymbol: 'STRD',
    blockExplorerURL: 'https://www.mintscan.io/stride/account',
    chainId: 'stride-1',
    chain: 'stride',
  },
  [CosmosHubChains.mars]: {
    name: 'Mars',
    description: '',
    rpcURL: 'https://www.mintscan.io/mars-protocol/txs',
    chainSymbol: 'MARS',
    blockExplorerURL: 'https://www.mintscan.io/mars-protocol/account',
    chainId: 'mars-1',
    chain: 'mars',
  },
};
