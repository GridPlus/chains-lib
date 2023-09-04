import { Signer, SignerDecorator } from '@xdefi-tech/chains-core';
import { KeyPair, utils, transactions } from 'near-api-js';
import BN from 'bn.js';
import borsh from 'borsh';

import { ChainMsg } from '../msg';

@SignerDecorator(Signer.SignerType.PRIVATE_KEY)
export class PrivateKeySigner extends Signer.Provider {
  verifyAddress(_address: string): boolean {
    throw new Error('Method not implemented.');
  }

  async getAddress(privateKey: string): Promise<string> {
    if (!this.verifyAddress(privateKey)) {
      throw new Error('Invalid address');
    }
    throw new Error('Method not implemented.');
  }

  async sign(privateKey: string, msg: ChainMsg): Promise<void> {
    const keyPair = KeyPair.fromString(privateKey);
    const publicKey = keyPair.getPublicKey();
    const accountId = Buffer.from(
      utils.PublicKey.fromString(publicKey.toString()).data
    ).toString('hex');
    const client = msg.provider.rpcProvider;
    client.config.keyStore.setKey(
      msg.provider.manifest.chainId,
      accountId,
      keyPair
    );
    await msg.provider.checkStorageBalance(msg); // need to add before calculate nonce but after setting key to provider

    const txData = await msg.buildTx();
    const receiverId = txData.contractAddress || txData.to;
    const [_txHash, signedTx] = await transactions.signTransaction(
      receiverId,
      new BN(txData.nonce).add(new BN(1)),
      txData.actions,
      borsh.baseDecode(txData.blockHash),
      client.connection.signer,
      accountId,
      msg.provider.manifest.chainId
    );
    const buffer = signedTx.encode();
    msg.sign(Buffer.from(buffer).toString('base64'));
  }
}

export default PrivateKeySigner;
