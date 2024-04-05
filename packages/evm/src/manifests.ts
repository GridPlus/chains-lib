import { Chain } from '@xdefi-tech/chains-core';

export enum EVMChains {
  ethereum = 'ethereum',
  smartchain = 'smartchain',
  polygon = 'polygon',
  avalanche = 'avalanche',
  fantom = 'fantom',
  arbitrum = 'arbitrum',
  aurora = 'aurora',
  cantoevm = 'cantoevm',
  optimism = 'optimism',
  klaytn = 'klaytn',
  cronos = 'cronos',
}

export const EVM_MANIFESTS: { [key in EVMChains]: Chain.Manifest } = {
  [EVMChains.ethereum]: {
    name: 'Ethereum',
    description: '',
    rpcURL: 'https://ethereum-mainnet.xdefiservices.com',
    chainSymbol: 'ETH',
    blockExplorerURL: 'https://etherscan.io',
    chainId: '1',
    chain: 'ethereum',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
    multicallContractAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [EVMChains.smartchain]: {
    name: 'BNB Smart Chain',
    description: '',
    rpcURL: 'https://bsc-dataseed1.defibit.io',
    chainSymbol: 'BNB',
    blockExplorerURL: 'https://bscscan.com',
    chainId: '56',
    chain: 'smartchain',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.polygon]: {
    name: 'Polygon',
    description: '',
    rpcURL: 'https://polygon-mainnet.xdefiservices.com',
    chainSymbol: 'MATIC',
    blockExplorerURL: 'https://polygonscan.com',
    chainId: '137',
    chain: 'polygon',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.avalanche]: {
    name: 'Avalanche',
    description: '',
    rpcURL: 'https://avax-rpcs.xdefiservices.com',
    chainSymbol: 'AVAX',
    blockExplorerURL: 'https://snowtrace.io',
    chainId: '43114',
    chain: 'avalanche',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.fantom]: {
    name: 'Fantom',
    description: '',
    rpcURL: 'https://fantom-mainnet.xdefiservices.com',
    chainSymbol: 'FTM',
    blockExplorerURL: 'https://ftmscan.com',
    chainId: '250',
    chain: 'fantom',
    decimals: 18,
    feeGasStep: {
      high: 3,
      medium: 3,
      low: 3,
    },
  },
  [EVMChains.arbitrum]: {
    name: 'Arbitrum',
    description: '',
    rpcURL: 'https://arbitrum-rpcs.xdefiservices.com',
    chainSymbol: 'ETH',
    blockExplorerURL: 'https://arbiscan.io',
    chainId: '42161',
    chain: 'arbitrum',
    decimals: 18,
    feeGasStep: {
      high: 1,
      medium: 1,
      low: 1,
    },
  },
  [EVMChains.aurora]: {
    name: 'Aurora',
    description: '',
    rpcURL: 'https://aurora-rpc.xdefiservices.com',
    chainSymbol: 'ETH',
    blockExplorerURL: 'https://aurorascan.dev',
    chainId: '1313161554',
    chain: 'aurora',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.cantoevm]: {
    name: 'Canto EVM',
    description: '',
    rpcURL: 'https://canto-rpc.xdefiservices.com',
    chainSymbol: 'CANTO',
    blockExplorerURL: 'https://cantoscan.com',
    chainId: '7700',
    chain: 'cantoevm',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.optimism]: {
    name: 'Optimism',
    description: '',
    rpcURL: 'https://optimistic-scan.xdefiservices.com',
    chainSymbol: 'ETH',
    blockExplorerURL: 'https://optimistic.etherscan.io',
    chainId: '10',
    chain: 'optimism',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.klaytn]: {
    name: 'Klaytn',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/klaytn',
    chainSymbol: 'KLAY',
    blockExplorerURL: 'https://klaytnscope.com',
    chainId: '8217',
    chain: 'klaytn',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
  [EVMChains.cronos]: {
    name: 'Cronos',
    description: '',
    rpcURL: 'https://cronoscan-rpc.xdefiservices.com',
    chainSymbol: 'CRO',
    blockExplorerURL: 'https://cronoscan.com/',
    chainId: '25',
    chain: 'cronos',
    decimals: 18,
    feeGasStep: {
      high: 1.5,
      medium: 1.25,
      low: 1,
    },
  },
};
