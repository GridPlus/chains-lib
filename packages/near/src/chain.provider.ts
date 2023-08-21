import {
  Balance,
  Chain,
  ChainDecorator,
  Coin,
  DataSource,
  FeeData,
  FeeOptions,
  GasFeeSpeed,
  Msg,
  MsgData,
  Response,
  Transaction,
  TransactionData,
  TransactionStatus,
} from '@xdefi-tech/chains-core';
import { some } from 'lodash';
import Near, { keyStores } from 'near-api-js';
import { SignedTransaction } from 'near-api-js/lib/transaction';

import { ChainMsg } from './msg';
import { NearManifest } from './manifests';

@ChainDecorator('NearProvider', {
  deps: [],
  providerType: 'Near',
})
export class NearProvider extends Chain.Provider {
  declare rpcProvider: Near.Near;

  constructor(dataSource: DataSource, options?: Chain.IOptions) {
    super(dataSource, options);
    const manifest = this.manifest as NearManifest;
    Near.connect({
      networkId: manifest.chainId,
      keyStore: new keyStores.InMemoryKeyStore(),
      nodeUrl: manifest.rpcURL,
      walletUrl: manifest.walletUrl,
      helperUrl: manifest.helperUrl,
    }).then((provider) => {
      this.rpcProvider = provider;
    });
  }

  createMsg(data: MsgData): Msg {
    return new ChainMsg(data, this);
  }

  async getTransactions(
    address: string,
    afterBlock?: number | string
  ): Promise<Response<Transaction[], Transaction>> {
    return new Response(
      () => this.dataSource.getTransactions({ address, afterBlock }),
      () => this.dataSource.subscribeTransactions({ address })
    );
  }

  async estimateFee(
    msgs: Msg[],
    speed: GasFeeSpeed = GasFeeSpeed.medium
  ): Promise<FeeData[]> {
    return this.dataSource.estimateFee(msgs, speed);
  }

  async getBalance(address: string): Promise<Response<Coin[], Balance[]>> {
    return new Response(
      () => this.dataSource.getBalance({ address }),
      () => this.dataSource.subscribeBalance({ address })
    );
  }

  async gasFeeOptions(): Promise<FeeOptions | null> {
    return this.dataSource.gasFeeOptions();
  }

  async getNonce(_address: string): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async broadcast(msgs: ChainMsg[]): Promise<Transaction[]> {
    if (some(msgs, (msg) => !msg.hasSignature)) {
      throw new Error('Some message do not have signature, sign it first');
    }
    const transactions: Transaction[] = [];
    for (const msg of msgs) {
      const response =
        await this.rpcProvider.connection.provider.sendTransaction(
          SignedTransaction.decode(
            Buffer.from(msg.signedTransaction!, 'base64')
          )
        );
      transactions.push(
        Transaction.fromData({ hash: response.transaction.hash })
      );
    }

    return transactions;
  }

  async getTransaction(txHash: string): Promise<TransactionData | null> {
    try {
      const tx = await this.rpcProvider.connection.provider.txStatus(
        txHash,
        '132073ac670f80cccf1ebe37a9bd1c94c2f6f98aba241185a582ab8759c83081'
      );
      let status = TransactionStatus.pending;
      const isSuccess = tx.status.hasOwnProperty('SuccessValue');
      const isFailure = tx.status.hasOwnProperty('Failure');
      if (isSuccess) {
        status = TransactionStatus.success;
      } else if (isFailure) {
        status = TransactionStatus.failure;
      }
      return {
        hash: tx.transaction.hash,
        to: tx.transaction.receiver_id,
        from: tx.transaction.signer_id,
        status,
      };
    } catch (err) {
      console.error('Error while getting tx');
      console.error(err);
      return null;
    }
  }
}
