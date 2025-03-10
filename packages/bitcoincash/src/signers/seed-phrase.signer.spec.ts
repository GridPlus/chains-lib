import { Msg } from '@xdefi-tech/chains-core';

import { BitcoinCashProvider } from '../chain.provider';
import { BITCOINCASH_MANIFEST } from '../manifests';
import { ChainMsg, MsgBody } from '../msg';

import { SeedPhraseSigner } from './seed-phrase.signer';

jest.mock('../datasource/indexer/queries/balances.query', () => ({
  getBalance: () => {
    return [];
  },
}));

describe('seed-phrase.signer', () => {
  let privateKey: string;
  let derivation: string;
  let seedPhrase: string;
  let signer: SeedPhraseSigner;
  let provider: BitcoinCashProvider;
  let txInput: MsgBody;
  let message: Msg;

  beforeEach(() => {
    seedPhrase =
      'question unusual episode tree fresh lawn enforce vocal attitude quarter solution shove early arch topic';
    privateKey = 'Kz1YMmxrFVd2uyCnEHT546Bjw3Wime47AoTQeYATUCSsuirJczu5';
    derivation = "m/44'/145'/0'/0/0";
    signer = new SeedPhraseSigner(seedPhrase);

    provider = new BitcoinCashProvider(
      new BitcoinCashProvider.dataSourceList.IndexerDataSource(
        BITCOINCASH_MANIFEST
      )
    );

    txInput = {
      from: 'qq8s9kmuyl9avm5ef7jlgsnv9x80ygj7scyzcr6vad',
      to: 'qq8s9kmuyl9avm5ef7jlgsnv9x80ygj7scyzcr6vad',
      amount: 0.000001,
    };

    message = provider.createMsg(txInput);
  });

  it('should get an address from the seed phrase', async () => {
    expect(await signer.getAddress(derivation)).toBe(txInput.from);
  });

  it('should sign a transaction using the seed phrase', async () => {
    await signer.sign(message as ChainMsg, derivation);

    expect(message.signedTransaction).toBeTruthy();
  });

  it('should sign a raw transaction using a seed phrase', async () => {
    const txHex =
      '70736274ff01007e020000000286339733afada6e9c280ed345dba8c67388066e3a0cd887edbc4c4eff3a436950000000000ffffffff2edfa5e79ee84fb3ee8e4e3ecb6e0b48e1fcb2efbe4eb316b6df615a8ef4921f0000000000ffffffff0101000000000000001976a9140f02db7c27cbd66e994fa5f4426c298ef2225e8688ac00000000000100e20100000001a0f1ebe12602a226d5fd7407b5aceece2ad220c9121222cb0e800e97eec27c2a000000006b483045022100fb8e3eee81f80107de496f21635c35e86063947363f735ba30fc28b153f7629102204d899df15b0410c6dbab3149c58c7eceb7a1aec05a6e2b215ebf6a4697a9867541210340b6f9fa321f12bab6dcf264f44e2a644fd1d3cc7512a57ca3d2c99ee3bfa7d4ffffffff0210270000000000001976a9140f02db7c27cbd66e994fa5f4426c298ef2225e8688accc5d0100000000001976a914e26ef4edfcff06b0ad42ed42efa8af1ee5684b7b88ac00000000000100e20100000001c07daebf83cf9164494c63f26e399d25202c7f2407fd62a5050812feaf8ae461010000006b4830450221009d07e0e1b465d494d73e4deecda2fe3552d75bd28975f0f2c548c1d0e6616f0202205fd9afcb792a78470873fe224e642c86855a1e0d305590cdd5310fb8bd0e7cfb412103712c13f60c49c5211ebec518a17f4648112b4c0b2628a4fd787649002cdbe8b0000000000210270000000000001976a9140f02db7c27cbd66e994fa5f4426c298ef2225e8688acea910d00000000001976a914f2b1d800f92299c107a366ff4ac62eb70ea597e488ac000000000000';
    const signedTx = await signer.signRawTransaction(txHex, derivation);

    expect(signedTx).toEqual(
      '020000000286339733afada6e9c280ed345dba8c67388066e3a0cd887edbc4c4eff3a43695000000006b483045022100ba78402d80d3c5304ea933812e13b4ebf576032fc6bd6332d82a14020904708202203d6356a15222440b65390ec298a6b716188c33d2df23af89755ab652338b2f4901210398c7d1ac211564fa1243fa250debac08f822a0e98490ac365d528918b019da1bffffffff2edfa5e79ee84fb3ee8e4e3ecb6e0b48e1fcb2efbe4eb316b6df615a8ef4921f000000006b483045022100aa0aeb88fb072938e59855c247a9ec8a13fde940f767de605e26a5e3e508598302200730b3a722e448765f2a97da5e49772cd40d7cd1b39c511bf403c19b7e84413201210398c7d1ac211564fa1243fa250debac08f822a0e98490ac365d528918b019da1bffffffff0101000000000000001976a9140f02db7c27cbd66e994fa5f4426c298ef2225e8688ac00000000'
    );
  });

  it('should return false when verifing an invalid address', async () => {
    expect(signer.verifyAddress('0xDEADBEEF')).toBe(false);
  });

  it('should validate an address', async () => {
    expect(signer.verifyAddress(txInput.from)).toBe(true);
  });

  it('should get a private key from a seed phrase', async () => {
    expect(await signer.getPrivateKey(derivation)).toEqual(privateKey);
  });
});

describe('seed-phase.addressGeneration', () => {
  let derivation: (index: number) => string;
  let seedPhrase: string;
  let signer: SeedPhraseSigner;
  let firstAddress: string;
  let secondAddress: string;

  beforeEach(() => {
    seedPhrase =
      'access before split cram spoon snap secret month sphere fog embark donor';
    derivation = (index) => `m/44'/145'/0'/0/${index}`;
    signer = new SeedPhraseSigner(seedPhrase);

    firstAddress = 'qp02q64reu5z594wah4kmdajxel5dc0rgg3cd8tu0c';
    secondAddress = 'qqvxlytmvhgpj752jfmm42d5qarx224d35uhllujvl';
  });

  it('should get an address from the seed phrase', async () => {
    expect(await signer.getAddress(derivation(0))).toBe(firstAddress);
  });

  it('should get the second address form the seed phrase', async () => {
    expect(await signer.getAddress(derivation(1))).toBe(secondAddress);
  });
});
