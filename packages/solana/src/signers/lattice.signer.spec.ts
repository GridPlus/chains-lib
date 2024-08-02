import { Msg } from '@xdefi-tech/chains-core';
import fetch from 'cross-fetch';
import XMLHttpRequest from 'xhr2';

import { SolanaProvider } from '../chain.provider';
import { IndexerDataSource } from '../datasource';
import { SOLANA_MANIFEST } from '../manifests';
import { ChainMsg, MsgBody } from '../msg';

import LatticeSigner from './lattice.signer';

global.XMLHttpRequest = XMLHttpRequest;
globalThis.fetch = fetch;

/**
 * Update this config to match your Lattice device
 *
 * TODO: Update this to use environment variables
 */
const CONFIG = {
  deviceId: '',
  password: '',
  name: '',
};

jest.mock('@solana/web3.js', () => {
  const original = jest.requireActual('@solana/web3.js');
  return {
    ...original,
    Transaction: {
      ...original.Transaction,
      prototype: {
        ...original.Transaction.prototype,
        serialize: jest
          .fn()
          .mockReturnValue(Buffer.from('serialized_transaction')),
      },
    },
  };
});

describe('lattice.signer', () => {
  let signer: LatticeSigner;
  let derivationPath: string;
  let provider: SolanaProvider;
  let txInput: MsgBody;
  let message: Msg;

  beforeAll(async () => {
    signer = await LatticeSigner.create(CONFIG);
    if (!signer.isPaired) {
      throw new Error('Failed to pair with Lattice device');
    }
  });

  beforeEach(async () => {
    provider = new SolanaProvider(new IndexerDataSource(SOLANA_MANIFEST));
    derivationPath = "m/44'/501'/0'/0'";

    txInput = {
      from: 'DiVUanvgbgG6VsLU2Dmoom2NNJ7cYUzrdz2WLUi3J8Nn',
      to: 'DiVUanvgbgG6VsLU2Dmoom2NNJ7cYUzrdz2WLUi3J8Nn',
      amount: 0.000001,
      gasPrice: 100,
      priorityFeeAmount: 10000,
    };

    message = provider.createMsg(txInput);
  });

  it('should get an address from the lattice device', async () => {
    const address = await signer.getAddress(derivationPath);
    expect(address).toBe(txInput.from);
  }, 15000);

  it('should sign a transaction using a lattice device', async () => {
    await signer.sign(message as ChainMsg, derivationPath);
    expect(message.signedTransaction).toBeTruthy();
  }, 15000);

  it('should return false when verifying an invalid address', async () => {
    expect(signer.verifyAddress('invalid_address')).toBe(false);
  }, 15000);

  it('should validate a correct address', async () => {
    expect(signer.verifyAddress(txInput.from)).toBe(true);
  }, 15000);

  it('should fail if private key is requested', async () => {
    await expect(signer.getPrivateKey(derivationPath)).rejects.toThrow();
  }, 15000);
});
