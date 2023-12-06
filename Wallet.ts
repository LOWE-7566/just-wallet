import {  ethers }  from "ethers";
import Format  from "./Format.js";
import JustWalletProvider from "./Provider.js";
import Contract from "./Contract.js";
import FromSigner from "./FromSigner.js";
import addressValidator from "./checkAddress.js";
import TokenWallet  from "./Token.js";
import { WalletTransactionalNumber,Walletish,Providerish, IFormat, ITransactionConfig} from "./types";
import SendTransaction from "./Send.js";
import estimateGas from "./EstimateGas.js"
import BN from "./utils/BN.js";
import { ArgurmentError } from "./utils/Error.js";



const utils = {
   BN
}


/** 
 * Error list
  */



/**
 * A class that will serve as the main backbone of the  Wallet 
 * This will hold all of the basic functionality which includes using ethers for sending, estimating gas,
 * and other helpers but it's main use is to handle tokens and eth of the wallet and how you will going to display them 
 */
export class JustWallet {
   mnemonic:any;
   #providerInput:any
   #walletInput:any;
   decimals:number;
   _isWallet: boolean;
   invalid?: any;
   
   /**
    * 
    * @param wallet  is iether a privatekey, mnemonic pharse that will indicate that it is an account 
    * @param provider is the provider it can be any other ethers provider but if not provided then it will use 127.0.0.1:8545 
    */   
   constructor(wallet:Walletish, provider:Providerish){
      this.invalid = {
         wallet: new ArgurmentError("JustWallet.constructor", undefined, "wallet", wallet, "Require any wallets and accounts"),
         provider: new ArgurmentError("JustWallet.constructor",undefined, "provider", provider,"Require any ethers or web3Providers")};
      
      // check if the provider and wallet is provided 
      if(!wallet){
         throw this.invalid.wallet;
      } 
      if(!provider){
         throw this.invalid.provider;
      }
      // set the important propeties
      this.#providerInput = provider; 
      this.#walletInput = wallet;
      this.decimals = 18 ; // ethers has 18 decimals 
      this._isWallet = true;
   }

   /**
    * get the private key in an input
    */
   getPrivatekey(candidate: string):string|void {
      const privatekeyRegExp = /(^0x)[0-9a-fA-F]{66}|[0-9a-fA-F]{64}/g;
      const match = candidate.trim().match(privatekeyRegExp);
      return match ? match[0] : undefined;
   }

   /**
    * check if the privatekey is valid 
    */
   validPrivatekey(candidate: string):boolean {
      const privatekey = this.getPrivatekey(candidate);
      return privatekey !== undefined;
   }

   // provider 
   get provider():JustWalletProvider{
      let __provider:any;
      if(!this.#providerInput){
         throw this.invalid.provider
      } else if(typeof this.#providerInput === "string"){
         __provider = new JustWalletProvider(this.#providerInput);
      } else if(this.#providerInput._isProvider){
         __provider = this.#providerInput;
      } else {
         __provider = new JustWalletProvider(); /** use the defaults */
      }
      return __provider;
   }
   
   
   /**
    * This will get the main ethers wallet created because JustWallet class only serves as a wrapper
    */
   get Wallet():ethers.Wallet{
      let __wallet;
      
      // if wallet provided mnemonic key or privateKey
      if (typeof this.#walletInput === "string") {
         const validPrivatekey = this.getPrivatekey(this.#walletInput) || false;
         // if private key is provided
         if(validPrivatekey){
            __wallet = new ethers.Wallet(validPrivatekey,this.provider);
            // check if it is a valid mnemonic 
         } else if(ethers.utils.isValidMnemonic(this.#walletInput)) {
            const fromMnemonicWallet =  ethers.Wallet.fromMnemonic(this.#walletInput);
            const __privateKey = fromMnemonicWallet.privateKey;
            __wallet = new ethers.Wallet(__privateKey,this.provider);
            this.mnemonic = this.#walletInput ;
         }
      }
      // if it is an ethers wallet
      else if(this.#walletInput._isSigner === true){
         __wallet =  this.#walletInput;
         // if it is another instance of JustWallet
      } else if(this.#walletInput._isWallet){
         __wallet = this.#walletInput.Wallet;
      }

      // if there is not wallet
      if (!__wallet) {
         throw this.invalid.wallet;
      }
      // return wallet
      return __wallet;

   }
   
   // getter for address
   get address():string{
      return  this.Wallet.address ;
   }
   
   // getter for private key
   get privateKey(){
      return this.Wallet.privateKey;
   }
   
   /**
    * getter for the nalance that is returneed not as a BigNumber or but a format 
    */
   get balance():Promise<IFormat>{
      
      return new Promise((resolve,reject) => {
         this.provider.getBalance(this.address).then((bal:any) => {
            resolve(new Format.Wei(bal.toString(), 18))
         })
         
      })
      
   }
   
   /**
    * Somethimes the same wallet used may like to switch wallets so to switch wallets 
    * @param wallet is an ethers wallet, mnemonic or FETH wallet class 
    */ 
   switchAccount(wallet:Walletish):void{
      this.#walletInput = wallet;
   }
   
   // switch network  
   switchNetwork(providerStringOrProvider:string):void{
      this.#providerInput = providerStringOrProvider;
   }
   
   // use as a different wallet, this feature does not affect the original wallet
   useAs(wallet:Walletish):JustWallet{
      return new JustWallet(wallet,this.provider);
   }
   
   // use different provider either new network or other provider like infura, alchemy or just the JSONRPCProvider 
   useAt(provider:string|Providerish):JustWallet{
      return new JustWallet(this.#walletInput,provider);
   }
   // send 
   // @params amount is an ethers string or an object used to send ethers 
   async send(amount:WalletTransactionalNumber,to:Walletish,config?:string|ITransactionConfig):ReturnType<typeof SendTransaction>{
      return SendTransaction(amount,to,this,config);
   } 
   
   
   // estimate gas... 
   estimateGas (amount:WalletTransactionalNumber,to:Walletish):ReturnType<typeof estimateGas>{
      return estimateGas(amount,to,this);
   }
   
   
   // using the ERC20 Wallet
   Token(addr:Contract|ethers.Contract):TokenWallet{
      const address = addr.address || addr
      return new TokenWallet(this.Wallet,address);
   }
   
   
   // Format Format
   static get Format():typeof Format{
      return Format;
   }


   /**
    * sometimes user does not have an access to the private key but able to use as a signer, like in browser providers (metamask) 
    * or in hardhat wher you can get all of the signers availble to a test networks either ganache or the hardhat node, 
    * but still it still has the same functionality as usign privatekeys or mnemonic to manage a wallet
    */
   static get FromSigner():typeof FromSigner {
      return FromSigner;
   }
   
   // a static getter pointing to a provider note it is a JSONRPCProvider 
   static get Provider():typeof JustWalletProvider{
      return JustWalletProvider;
   }
   
   // a function that validates if the @param address is a valid address
   static isValidAddress(address:string){
      return addressValidator(address);
   }
   
   // get the ethers instance 
   get ethers(){
      return ethers;
   } 
   // get the ethers.utils 
   static get utils(){
      return utils;
   }
}




export default JustWallet;
