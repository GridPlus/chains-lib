import React from 'react';
import { ChainController } from '@xdefi/chains-core';
import {
  EVM_MANIFESTS,
  EvmProvider,
  IndexerDataSource as EvmDataSource,
} from '@xdefi/chains-evm';
import {
  CosmosProvider,
  ChainDataSource,
  COSMOS_MANIFESTS,
} from '@xdefi/chains-cosmos';

export const ChainsContextDefaultValue = new ChainController();

ChainsContextDefaultValue.addProvider(
  new CosmosProvider(new ChainDataSource(COSMOS_MANIFESTS.cosmoshub))
);

// init all needed providers
ChainsContextDefaultValue.addProvider(
  new EvmProvider(new EvmDataSource(EVM_MANIFESTS.ethereum))
);
// ChainsContextDefaultValue.addProvider(
//   new SolanaProvider(new SolanaDataSource(SolanaManifest))
// )
ChainsContextDefaultValue.addProvider(
  new EvmProvider(new EvmDataSource(EVM_MANIFESTS.binancesmartchain))
);
ChainsContextDefaultValue.addProvider(
  new EvmProvider(new EvmDataSource(EVM_MANIFESTS.polygon))
);
ChainsContextDefaultValue.addProvider(
  new EvmProvider(new EvmDataSource(EVM_MANIFESTS.avalanche))
);
ChainsContextDefaultValue.addProvider(
  new EvmProvider(new EvmDataSource(EVM_MANIFESTS.fantom))
);
ChainsContextDefaultValue.addProvider(
  new EvmProvider(new EvmDataSource(EVM_MANIFESTS.arbitrum))
);
ChainsContextDefaultValue.addProvider(
  new EvmProvider(new EvmDataSource(EVM_MANIFESTS.aurora))
);
ChainsContextDefaultValue.addProvider(
  new EvmProvider(new EvmDataSource(EVM_MANIFESTS.aurora))
);

export const ChainsContext = React.createContext<ChainController>(
  ChainsContextDefaultValue
);
