import { ethers }  from "ethers";
import Format  from "./Format.js";
import FETHProvider from "./Provider.js";
import Contract from "./Contract.js";
import FromSigner from "./fromSigner.js";
import addressValidator from "./checkAddress.js";
import TokenWallet  from "./Token.js";
import { WalletTransactionalNumber,Walletish,Providerish, EthersWallet,Wallet,IFormat,Provider, ITransactionConfig, Address} from "./types";
import send from "./Send.js";
import estimateGas from "./EstimateGas.js"
import BN from "./utils/BN.js";
import { ArgurmentError } from "./utils/Error.js";


const utils = {
   BN
}
const privatekeyRegExp =  /^0x[0-9a-fA-F]/g;

/**
 * A class that will serve as the main backbone of the  Wallet 
 * This will hold all of the basic functionality which includes using ethers for sending, estimating gas,
 * and other helpers but it's main use is to handle tokens and eth of the wallet and how you will going to display them 
 */
export class FETHWallet {
   mnemonic:any;
   #providerInput:any
   #walletInput:any;
   decimals:number;
   _isWallet:boolean;
   
   /**
    * 
    * @param wallet  is iether a privatekey, mnemonic pharse that will indicate that it is an account 
    * @param provider is the provider it can be any other ethers provider but if not provided then it will use 127.0.0.1:8545 
    */   
   constructor(wallet:Walletish, provider:Providerish){
      
      if(!wallet){
         throw new ArgurmentError("FETHWallet.constructor",undefined, "wallet", wallet,"A ethers Wallet, Mnemonic Wallet, PrivateKey, an new ethers.prototype.Wallet or new FETHWallet", "Providing A Valid Ptovider");
      } 
      if(!provider){
         throw new ArgurmentError("FETHWallet.constructor",undefined, "provider", this.#providerInput,"A ethers provider or FETHWallet.prototype.Provider.", "Providing A Valid Provider");
      }
      
      this.#providerInput = provider; 
      this.#walletInput = wallet;
      this.decimals = 18 ; // ethers has 18 decimals 
      this._isWallet = true;
   }


   // provider 
   get provider(){
      let __provider:any;
      if(!this.#providerInput){
         throw new ArgurmentError("FETHWallet.constructor",undefined, "provider", this.#providerInput,"A ethers provider or FETHWallet.prototype.Provider.", "Providing A Valid Provider");
      } else if(typeof this.#providerInput === "string"){
         __provider = new FETHProvider(this.#providerInput || `http:127.0.0.1:8545`);
      } else if(this.#providerInput._isProvider){
         __provider = this.#providerInput;
      } else {
         __provider = new FETHProvider(`http:127.0.0.1:8545`);
      }
      return __provider;
   }
   
   
   /**
    * This will get the main ethers wallet created because FETHWallet class only serves as a wrapper
    */
   get Wallet(){
      let __wallet;
      if(this.#walletInput === undefined){
         throw new ArgurmentError("FETHWallet.constructor",undefined, "wallet", this.#walletInput,"A ethers Wallet, Mnemonic Wallet, PrivateKey, an new ethers.prototype.Wallet or new FETHWallet", "Providing A Valid Ptovider");
      }
      
      const walletLength = 66 ;
      
      
      // if wallet provided mnemonic key or privateKey
      if (typeof this.#walletInput === "string") {
         const isPrivate:any =  this.#walletInput.match(privatekeyRegExp);
         const isValidPrivateKey = !!isPrivate;
         
         // if private key is provided
         if(isValidPrivateKey && this.#walletInput?.length === walletLength){
            __wallet = new ethers.Wallet(this.#walletInput,this.provider);
            
            // chech if it is a valid mnemonic 
         } else if(ethers.utils.isValidMnemonic(this.#walletInput)) {
            const fromMnemonicWallet =  ethers.Wallet.fromMnemonic(this.#walletInput);
            const __privateKey = fromMnemonicWallet.privateKey;
            __wallet = new ethers.Wallet(__privateKey,this.provider);
            this.mnemonic = this.#walletInput ;
         }
      }
      
      else if(this.#walletInput._isSigner === true){
         __wallet =  this.#walletInput;
         
      } else if(this.#walletInput._isWallet){
         __wallet = this.#walletInput.Wallet;
      }
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
   switchAccount(wallet:Walletish){
      this.#walletInput = wallet;
   }
   
   // switch network  
   switchNetwork(providerStringOrProvider:string){
      this.#providerInput = providerStringOrProvider;
   }
   
   // use as a different wallet, this feature does not affect the original wallet
   useAs(wallet:Walletish){
      return new FETHWallet(wallet,this.provider);
   }
   
   // use different provider either new network or other provider like infura, alchemy or just the JSONRPCProvider 
   useAt(provider:string|Providerish){
      return new FETHWallet(this.#walletInput,provider);
   }
   // send 
   // @params amount is an ethers string or an object used to send ethers 
   async send(amount:WalletTransactionalNumber,to:Walletish,config?:string|ITransactionConfig){
      return send(amount,to,this,config);
   } 
   
   
   // estimate gas... 
   estimateGas (amount:WalletTransactionalNumber,to:Walletish){
      return estimateGas(amount,to,this);
   }
   
   
   // using the ERC20 Wallet
   Token(addr:Contract|ethers.Contract){
      const address = addr.address || addr
      return new TokenWallet(this.Wallet,address);
   }
   
   
   // Format Format
   static get Format(){
      return Format;
   }


   /**
    * sometimes user does not have an access to the private key but able to use as a signer, like in browser providers (metamask) 
    * or in hardhat wher you can get all of the signers availble to a test networks either ganache or the hardhat node, 
    * but still it still has the same functionality as usign privatekeys or mnemonic to manage a wallet
    */
   static get FromSigner() {
      return FromSigner;
   }
   
   // a static getter pointing to a provider note it is a JSONRPCProvider 
   static get Provider(){
      return FETHProvider;
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




export default FETHWallet;
