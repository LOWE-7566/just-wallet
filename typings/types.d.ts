import { ethers, type BigNumberish as BN, BigNumber } from "ethers";
import Format from "./Format";
import FETHWallet from "./Wallet";
import FETHToken from "./Token.js";
import { type Signer as EthSigner } from "ethers";
import FETHContract from "./Contract";
import FETHProvider from "./Provider";
declare const ETHProvider: typeof ethers.providers.Provider;
export type WalletTransactionalNumber = string | BigNumber | BN | BigNumberish | BigInt | Format;
export type Walletish = IWalletish | Wallet | ethers.Wallet | string;
export type AnyWallet = typeof ethers.Wallet | Wallet;
type EthersProvider = typeof ETHProvider;
export type Providerish = string | FETHProvider | EthersProvider;
export type BigNumberish = BN | string;
export type Wallet = FETHWallet;
export type Provider = FETHProvider | EthersProvider;
export type EthersWallet = typeof ethers.Wallet;
export type Token = FETHToken;
export type Signer = Wallet | EthSigner | Provider;
export type Contract = typeof ethers.Contract | FETHContract;
export type Address = string | IWalletish;
export interface ITransactionConfig {
    to: string;
    nonce?: number;
    gasLimit?: WalletTransactionalNumber;
    maxFeePerGas?: WalletTransactionalNumber;
    maxPriorityFeePerGas?: WalletTransactionalNumber;
    value: string;
}
export interface IFormat {
    _isFormat: boolean;
    decimals: number;
    inputValue: string | number;
    wei: string;
    fixed: string;
    walletReady: string;
    moneyValue: string;
    separated: string;
    moneyValueSeparated: string;
    assetValue: string;
    BN(): ethers.BigNumber;
    FixedBN(): ethers.BigNumber;
    set value(value: any);
    get value(): BigInt;
}
export interface IWalletish {
    address: string;
    privateKey: string;
    provider: Provider;
}
export interface isValidAddressInterface {
    valid: boolean;
    value: string;
    address?: string;
}
export {};
//# sourceMappingURL=types.d.ts.map