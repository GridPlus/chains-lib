import {
  FeeEstimation,
  GasFeeSpeed,
  Msg as BasMsg,
  MsgEncoding,
  NumberIsh,
} from '@xdefi-tech/chains-core';
import BigNumber from 'bignumber.js';
import {
  PublicKey,
  SystemProgram,
  Transaction as SolanaTransaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
  ComputeBudgetProgram,
  TransactionMessage,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getMint,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';

import type { SolanaProvider } from './chain.provider';
import { DEFAULT_FEE } from './constants';

export interface MsgBody {
  amount: NumberIsh;
  to: string;
  from: string;
  gasPrice?: NumberIsh;
  decimals?: number;
  contractAddress?: string;
  memo?: string;
  data?: string; // for swaps when encoded is base64a
  priorityFeeAmount?: number;
}

export interface TxBody {
  tx: SolanaTransaction | VersionedTransaction;
  value: number; // in lamports
  to: string;
  from: string;
  gasPrice: number;
  decimals: number;
  programId?: PublicKey;
  contractAddress?: string;
  toTokenAddress?: string;
  fromTokenAddress?: string;
  memo?: string;
  encoding?: MsgEncoding;
}

export class ChainMsg extends BasMsg<MsgBody, TxBody> {
  declare signedTransaction: Buffer;
  declare provider: SolanaProvider;

  constructor(data: MsgBody, provider: SolanaProvider, encoding: MsgEncoding) {
    super(data, provider, encoding);
  }

  public toData() {
    return this.data;
  }

  async buildTx(): Promise<TxBody> {
    const msgData = this.toData();
    let decimals = msgData.decimals || 9; // 9 - lamports in SOL
    let gasPrice = msgData.gasPrice;
    let programId;

    if (this.encoding === MsgEncoding.base64) {
      const versionedTransaction = VersionedTransaction.deserialize(
        Buffer.from(msgData.data, 'base64')
      );

      return {
        tx: versionedTransaction,
        value: 0,
        to: msgData.to,
        from: msgData.from,
        gasPrice: 0,
        decimals: msgData.decimals || this.provider.manifest.decimals,
        encoding: this.encoding,
      };
    }

    const senderPublicKey = new PublicKey(msgData.from);
    const recipientPublicKey = new PublicKey(msgData.to);
    let value;
    const contractInfo: any = {};
    const { blockhash } = await this.provider.rpcProvider.getLatestBlockhash();

    const instructions = [];

    if (msgData.contractAddress) {
      const mintPublicKey = new PublicKey(msgData.contractAddress);

      const mint = await getMint(
        this.provider.rpcProvider,
        mintPublicKey,
        'confirmed',
        TOKEN_PROGRAM_ID
      );
      programId = TOKEN_PROGRAM_ID;
      value = new BigNumber(msgData.amount)
        .multipliedBy(10 ** mint.decimals)
        .toNumber();
      const [fromTokenAcc, toTokenAcc] = await Promise.all([
        getAssociatedTokenAddress(mint.address, senderPublicKey),
        getAssociatedTokenAddress(mint.address, recipientPublicKey),
      ]);
      contractInfo.contractAddress = msgData.contractAddress;
      contractInfo.toTokenAddress = toTokenAcc.toBase58();
      contractInfo.fromTokenAddress = fromTokenAcc.toBase58();

      instructions.push(
        createTransferInstruction(
          fromTokenAcc,
          toTokenAcc,
          senderPublicKey,
          value
        )
      );
      decimals = mint.decimals;
    } else {
      value = new BigNumber(msgData.amount)
        .multipliedBy(LAMPORTS_PER_SOL)
        .toNumber();
      instructions.push(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientPublicKey,
          lamports: value,
        })
      );
      programId = SystemProgram.programId;
    }

    if (msgData.priorityFeeAmount) {
      instructions.unshift(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: msgData.priorityFeeAmount,
        })
      );
    }

    if (msgData.memo) {
      instructions.push(
        new TransactionInstruction({
          keys: [{ pubkey: senderPublicKey, isSigner: true, isWritable: true }],
          programId: new PublicKey(
            'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
          ),
          data: Buffer.from(msgData.memo, 'utf-8'),
        })
      );
    }

    if (!gasPrice) {
      const options = await this.provider.gasFeeOptions();
      gasPrice = options
        ? (options[GasFeeSpeed.medium] as number)
        : DEFAULT_FEE;
    }

    const messageV0 = new TransactionMessage({
      payerKey: senderPublicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    return {
      tx: transaction,
      value: value,
      to: msgData.to,
      from: msgData.from,
      gasPrice: gasPrice,
      memo: msgData.data,
      decimals,
      programId,
      memoProgramId: new PublicKey(
        'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
      ),
      encoding: this.encoding,
      ...contractInfo,
    };
  }

  async getFee(speed?: GasFeeSpeed): Promise<FeeEstimation> {
    const result: FeeEstimation = {
      fee: null,
      maxFee: null,
    };
    const msgData = this.toData();

    if (msgData.gasPrice) {
      result.fee = new BigNumber(msgData.gasPrice)
        .dividedBy(LAMPORTS_PER_SOL)
        .toString();
    } else {
      const options = await this.provider.gasFeeOptions();
      result.fee = new BigNumber(
        options ? (options[speed || GasFeeSpeed.medium] as number) : DEFAULT_FEE
      )
        .dividedBy(LAMPORTS_PER_SOL)
        .toString();
    }

    return result;
  }
}
