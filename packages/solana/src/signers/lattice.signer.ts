import { PublicKey, Transaction as SolanaTransaction } from '@solana/web3.js';
import { Signer, SignerDecorator } from '@xdefi-tech/chains-core';
import { fetchAddresses, signSolanaTx } from 'gridplus-sdk';

import { ChainMsg } from '../msg';

interface SolanaTransactionData {
  transaction: Buffer;
  signerPath: number[];
}

@SignerDecorator(Signer.SignerType.LATTICE)
export class LatticeSigner extends Signer.LatticeProvider {
  verifyAddress(address: string): boolean {
    try {
      const publicKey = new PublicKey(address);
      return publicKey.toBase58() === address;
    } catch (error) {
      return false;
    }
  }

  async getPrivateKey(_derivation: string) {
    throw new Error('Cannot extract private key from Lattice device');
  }

  async getAddress(derivation: string): Promise<string> {
    const addresses = await fetchAddresses({
      startPath:
        Signer.LatticeProvider.convertDerivationPathToArray(derivation),
      n: 1,
      flag: 0x04,
    });
    return addresses[0];
  }

  async sign(msg: ChainMsg, derivation: string): Promise<void> {
    const tx = await msg.buildTx();
    const payload = this.convertToSolanaTransactionData(tx as any, derivation);
    const signedTx = await this.signSolanaTransaction(payload);
    msg.sign(signedTx.serialize());
  }

  private convertToSolanaTransactionData(
    transaction: SolanaTransaction,
    derivation: string
  ): SolanaTransactionData {
    const signerPath =
      Signer.LatticeProvider.convertDerivationPathToArray(derivation);
    return {
      transaction: Buffer.from(transaction.serializeMessage()),
      signerPath,
    };
  }

  private async signSolanaTransaction(
    payload: SolanaTransactionData
  ): Promise<SolanaTransaction> {
    const { transaction, signerPath } = payload;

    const signedTx = await signSolanaTx(transaction, {
      signerPath,
    });

    return signedTx;
  }
}

export default LatticeSigner;
