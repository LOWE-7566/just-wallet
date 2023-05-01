import { ethers, type BigNumberish as BN } from "ethers";
import FETHWallet from "./Wallet";
import FETHToken from "./Token.js";
 import {type Signer as EthSigner, type ContractInterface} from "./ethers";
import FETHContract from "./Contract"
export type WalletTransactionalNumber = string|IFormat|number|typeof ethers.BigNumber;
export type Walletish = Wallet|typeof ethers.Wallet|string;
export type AnyWallet = typeof ethers.Wallet|Wallet;
export type Providerish = string|Wallet.Provider|typeof ethers.providers.Provider;
export type AnyProvider = Wallet.Provider|typeof ethers.providers.Provider;
export type BigNumberish = BN|string;
export type Wallet = FETHWallet;
export type Provider= FETHWallet.Provider|typeof ethers.Provider;
export type EthersWallet = typeof ethers.Wallet;
export type Token = FETHToken;

export type Signer = Wallet|EthSigner|Provider;
export type Contract = typeof ethers.Contract|FETHContract;

export interface ITransactionConfig {
   to?:string;
   nonce?:number;
   gasLimit?:WalletTransactionalNumber
   maxFeePerGas?:WalletTransactionalNumber;
   maxPriorityFeePerGas?:WalletTransactionalNumber;
   value?:WalletTransactionalNumber;
}

export interface IFormat {
   _isFormat:boolean;
  decimals:number; // decimal count 
  inputValue:string|number; // value provided
  wei:string; // wei the smallest value
  fixed:string; // this is the whole value
  walletReady:string;
  moneyValue:string;
  separated:string;
  moneyValueSeparated:string;
  assetValue:string;
  get BN(): typeof ethers.BigNumber;
  get FixedBN(): typeof ethers.BigNumber;
  Factory:Function;
  set value(value:any);
  get value():BigInt;
}