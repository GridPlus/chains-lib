import BtcOld from '@ledgerhq/hw-app-btc';
import Transport from '@ledgerhq/hw-transport';
import { Signer, SignerDecorator, utils } from '@xdefi-tech/chains-core';
import { UTXO } from '@xdefi-tech/chains-utxo';
import * as Litecoin from 'bitcoinjs-lib';
import { CreateTransactionArg } from '@ledgerhq/hw-app-btc/lib/createTransaction';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';

import { ChainMsg } from '../msg';

@SignerDecorator(Signer.SignerType.LEDGER)
export class LedgerSigner extends Signer.Provider {
  private transport: Transport | null;
  private isInternalTransport: boolean;

  constructor(transport?: Transport) {
    super();
    this.transport = null;

    if (transport) {
      this.transport = transport;
      this.isInternalTransport = false;
    } else {
      this.isInternalTransport = true;
      TransportWebHID.create().then((t) => {
        this.transport = t as Transport;
      });
    }
  }

  async initTransport() {
    this.transport = (await TransportWebHID.create()) as Transport;
    this.isInternalTransport = true;
  }

  network = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
  };

  verifyAddress(address: string): boolean {
    try {
      Litecoin.address.toOutputScript(address, this.network);
      return true;
    } catch (err) {
      return false;
    }
  }

  async getAddress(derivation: string): Promise<string> {
    try {
      if (!this.transport) {
        await this.initTransport();
      }
      const app = new BtcOld({
        transport: this.transport as Transport,
        currency: 'litecoin',
      });

      const { bitcoinAddress } = await app.getWalletPublicKey(derivation);

      if (bitcoinAddress) {
        return bitcoinAddress;
      } else {
        throw new Error('Error getting Litecoin address');
      }
    } catch (e) {
      throw e;
    } finally {
      if (this.isInternalTransport && this.transport) {
        this.transport.close();
        this.transport = null;
      }
    }
  }

  async sign(msg: ChainMsg, derivation: string) {
    try {
      if (!this.transport) {
        await this.initTransport();
      }
      const app = new BtcOld({
        transport: this.transport as Transport,
        currency: 'litecoin',
      });
      const { inputs, outputs, from } = await msg.buildTx();
      const psbt = new Litecoin.Psbt({ network: this.network });

      inputs.forEach((utxo: UTXO) => {
        psbt.addInput({
          hash: utxo.hash,
          index: utxo.index,
          witnessUtxo: utxo.witnessUtxo,
        } as any);
      });

      outputs.forEach((output: any) => {
        if (!output.address) {
          output.address = from;
        }

        psbt.addOutput({
          script: Litecoin.address.toOutputScript(output.address, this.network),
          value: output.value,
        });
      });

      const outputWriter = new utils.BufferWriter();

      outputWriter.writeVarInt(psbt.txOutputs.length);

      psbt.txOutputs.forEach((output: any) => {
        outputWriter.writeUInt64(output.value);
        outputWriter.writeVarSlice(output.script);
      });

      const outputScriptHex = outputWriter.buffer().toString('hex');

      const data: CreateTransactionArg = {
        inputs: inputs.map((utxo: UTXO) => [
          app.splitTransaction(utxo.txHex, true),
          utxo.index,
          utxo.witnessUtxo.script.toString('hex'),
        ]),
        associatedKeysets: [derivation],
        outputScriptHex,
        additionals: [],
      };

      const signedTx = await app.createPaymentTransaction(data);

      msg.sign(signedTx);
    } catch (e) {
      throw e;
    } finally {
      if (this.isInternalTransport && this.transport) {
        this.transport.close();
        this.transport = null;
      }
    }
  }
}

export default LedgerSigner;
