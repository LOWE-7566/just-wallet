import { ethers, type BigNumberish as BN } from "ethers";
import Format from "./Format";
import FETHWallet from "./Wallet";
import FETHToken from "./Token.js";
import FromSigner from "./fromSigner"
 import {type Signer as EthSigner, type ContractInterface} from "ethers";
import FETHContract from "./Contract"
import FETHProvider from "./Provider";
 
 
 const ETHProvider = ethers.providers.Provider
export type WalletTransactionalNumber = IWalletTransactionalNumber;
export type Walletish = IWalletish;
export type AnyWallet = typeof ethers.Wallet|Wallet;
type EthersProvider = typeof ETHProvider;
export type Providerish = string| FETHProvider| EthersProvider;
export type BigNumberish = BN|string;
export type Wallet = FETHWallet;
export type Provider= FETHProvider| EthersProvider;
export type EthersWallet = typeof ethers.Wallet;
export type Token = FETHToken;
export type Signer = Wallet|EthSigner|Provider;
export type Contract = typeof ethers.Contract|FETHContract;

export type Address = string|IWalletish;
export interface IWalletTransactionalNumber extends String{
   _isFormat?:boolean;
   _isBigNumber?:boolean;
   wei?:string;
   
}

export interface ITransactionConfig {
   to:string;
   nonce?:number;
   gasLimit?:WalletTransactionalNumber
   maxFeePerGas?:WalletTransactionalNumber;
   maxPriorityFeePerGas?:WalletTransactionalNumber;
   value:string;
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
 BN():  ethers.BigNumber;
 FixedBN():  ethers.BigNumber;
 set value(value:any);
 get value():BigInt;

 }


interface IWalletish  {
     address:string;
     privateKey:string;
     provider:Provider
 }


export interface isValidAddressInterface {
  valid:boolean;
  value:string;
  address?:string;
}


interface IWallet{
   mnemonic:any;
   decimals:number;
   _isWallet:boolean;
   get provider():Provider;
   get Wallet():EthersWallet;
   get balance():Promise<IFormat>;
   switchAccount(wallet:Walletish):never;
   switchNetwork(providerStringOrProvider:string):never;
   useAs(wallet:Walletish):Wallet;
   useAt(provider:string|Providerish):Wallet;
   send(amount:WalletTransactionalNumber,to:Walletish,config?:string|ITransactionConfig):Promise<any>;
   estimateGas (amount:WalletTransactionalNumber,to:Walletish):Promise<any>;
   Format():IFormat;
   FromSigner():FromSigner;
   Provider():Provider;
   isValidAddress(address:string):isValidAddressInterface;
   ethers:typeof ethers;
   utils:any;
   
}