import {
  Asset,
  DataSource,
  Coin,
  GasFeeSpeed,
  Transaction,
  Injectable,
  Chain,
  TransactionsFilter,
  BalanceFilter,
  Balance,
  FeeOptions,
  FeeData,
} from '@xdefi-tech/chains-core';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import {
  LcdClient,
  setupBankExtension,
  setupAuthExtension,
} from '@cosmjs/launchpad';
import {
  AddressChain,
  getCryptoAssets,
  CryptoAssetArgs,
} from '@xdefi-tech/chains-graphql';
import cosmosclient from '@cosmos-client/core';
import { uniqBy, transform, isArray, camelCase, isObject } from 'lodash';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { QueryClient, setupTxExtension } from '@cosmjs/stargate';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { encodeSecp256k1Pubkey } from '@cosmjs/amino';

import { ChainMsg } from '../../msg';

const nativeDenoms = [
  'uatom',
  'uosmo',
  'uaxl',
  'inj',
  'ujuno',
  'ucre',
  'ukava',
  'ustars',
  'uakt',
  'basecro',
  'ukuji',
  'usei',
  'ustrd',
  'umars',
];

@Injectable()
export class ChainDataSource extends DataSource {
  private readonly cosmosSDK: cosmosclient.CosmosSDK;

  constructor(manifest: Chain.Manifest) {
    super(manifest);
    this.rpcProvider = LcdClient.withExtensions(
      { apiUrl: this.manifest.rpcURL },
      setupBankExtension,
      setupAuthExtension
    );
    this.cosmosSDK = new cosmosclient.CosmosSDK(
      this.manifest.rpcURL,
      this.manifest.chainId
    );
  }

  async getBalance(filter: BalanceFilter): Promise<Coin[]> {
    const { address } = filter;
    const client = LcdClient.withExtensions(
      { apiUrl: this.manifest.rpcURL },
      setupBankExtension,
      setupAuthExtension
    );
    const balances = await client.bank.balances(address);
    const cryptoAssetsInput = balances.result.map<CryptoAssetArgs>(
      ({ denom }) => ({
        chain: this.manifest.chain as AddressChain,
        contract: nativeDenoms.includes(denom) ? null : denom,
      })
    );
    const {
      data: {
        assets: { cryptoAssets: assets },
      },
    } = await getCryptoAssets(cryptoAssetsInput);

    return balances.result.reduce((result: Coin[], { amount }, index) => {
      const asset = assets && assets[index];
      if (!asset) {
        return result;
      }

      const coin = new Coin(
        new Asset({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: asset.id!,
          chainId: this.manifest.chainId,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          name: asset!.name!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          symbol: asset.symbol!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          icon: asset.image,
          native: !Boolean(asset.contract),
          address: asset.contract,
          price: asset.price?.amount,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          decimals: asset.decimals!,
        }),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new BigNumber(amount).dividedBy(10 ** asset.decimals!)
      );

      result.push(coin);
      return result;
    }, []);
  }

  async subscribeBalance(
    _filter: BalanceFilter
  ): Promise<Observable<Balance[]>> {
    throw new Error('Method not implemented.');
  }

  private async _getTransactionEvent(
    event: 'transfer.sender' | 'transfer.recipient',
    address: string
  ) {
    return await cosmosclient.rest.tx.getTxsEvent(
      this.cosmosSDK,
      [`${event}='${address}'`],
      undefined,
      undefined,
      BigInt(10)
    );
  }

  async getTransactions(filter: TransactionsFilter): Promise<Transaction[]> {
    const { address } = filter;
    const [sender, recipient] = await Promise.all([
      this._getTransactionEvent('transfer.recipient', address),
      this._getTransactionEvent('transfer.sender', address),
    ]);
    const formattedTransactions = uniqBy(
      [
        ...(sender?.data?.tx_responses || []),
        ...(recipient?.data?.tx_responses || []),
      ],
      'txhash'
    );
    return formattedTransactions.map((tx: any) => Transaction.fromData(tx));
  }

  async subscribeTransactions(
    _filter: TransactionsFilter
  ): Promise<Observable<Transaction>> {
    throw new Error('Method not implemented.');
  }

  async estimateFee(
    _msgs: ChainMsg[],
    _speed: GasFeeSpeed
  ): Promise<FeeData[]> {
    const client = await Tendermint34Client.connect(
      'https://rpc-proxy.xdefi.services/cosmos/rpc/mainnet'
    );
    const txExtension = setupTxExtension(QueryClient.withExtensions(client));

    const camelize = (obj: object) =>
      transform(obj, (acc: any, value, key, target) => {
        const camelKey = isArray(target) ? key : camelCase(key);

        acc[camelKey] = isObject(value) ? camelize(value) : value;
      });

    const msgs = [
      // msgAny,
      {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: [
          ...JSON.stringify({
            amount: [{ amount: '1', denom: 'uatom' }],
            fromAddress: 'cosmos1vxez2cl456xl96zt6e5sku6e9gcra0gu3j8usr',
            toAddress: 'cosmos1vxez2cl456xl96zt6e5sku6e9gcra0gu3j8usr',
          }),
        ]
          .map((c, i) => c.charCodeAt(i).toString(16))
          .join(''),
      },
    ];

    console.log('LOG msgs', msgs);

    const encodedMsgs: Any[] = msgs.map((m) => Any.fromJSON(camelize(m)));
    const pubKey = Buffer.from(
      'a55c862d9bd97c0597c202f7bc7df32bcfb34d732a538a9e64722e0a1d58514b',
      'hex'
    );
    console.log('LOG pubKey', pubKey.length, pubKey);
    const simResponse = await txExtension.tx.simulate(
      encodedMsgs,
      undefined,
      encodeSecp256k1Pubkey(pubKey.length > 33 ? pubKey.slice(2) : pubKey),
      Number(0)
    );

    // eslint-disable-next-line no-console
    console.log('simResponse', simResponse);
    return [];
  }

  async gasFeeOptions(): Promise<FeeOptions | null> {
    throw new Error('Method not implemented.');
  }

  async getNonce(_address: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
