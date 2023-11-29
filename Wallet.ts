import { ethers }  from "ethers";
import Format  from "./Format.js";
import GasFormat from "./GasFormat.js";
import Transaction from "./Transaction.js";
import FETHProvider from "./Provider.js";
import Contract from "./Contract.js";
import FromSigner from "./fromSigner.js";
import addressValidator from "./checkAddress.js";
import TokenWallet  from "./Token.js";
import { WalletTransactionalNumber,Walletish,Providerish, EthersWallet,Wallet,IFormat,Provider, ITransactionConfig, Address} from "./types";
import send from "./Send.js";
import estimateGas from "./EstimateGas.js"
import BN from "./utils/BN.js";
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`
import { ArgurmentError } from "./utils/Error.js";

const utils = {
   BN
}
const privatekeyRegExp =  /^0x[0-9a-fA-F]/g;
export class FETHWallet {
   mnemonic:any;
   #providerInput:any
   #walletInput:any;
   decimals:number;
   _isWallet:boolean;
   
   
   constructor(wallet:Walletish, provider:Providerish){
      
      if(!wallet){
         throw new ArgurmentError("FETHWallet.constructor",undefined, "wallet", wallet,"A ethers Wallet, Mnemonic Wallet, PrivateKey, an new ethers.prototype.Wallet or new FETHWallet", "Providing A Valid Ptovider");
      } 
      
      if(!provider){
         throw new ArgurmentError("FETHWallet.constructor",undefined, "provider", this.#providerInput,"A ethers provider or FETHWallet.prototype.Provider.", "Providing A Valid Provider");
      }
      
      this.#providerInput = provider;
      this.#walletInput = wallet;
      this.decimals = 18 ;
      this._isWallet = true;
   }
   
   // provider 
   get provider(){
      let __provider:any;
      if(!this.#providerInput){
         throw new ArgurmentError("FETHWallet.constructor",undefined, "provider", this.#providerInput,"A ethers provider or FETHWallet.prototype.Provider.", "Providing A Valid Provider");
      } else if(typeof this.#providerInput === "string"){
         __provider = new FETHProvider(this.#providerInput || `http://localhost:8545`);
      } else if(this.#providerInput._isProvider){
         __provider = this.#providerInput;
      } else {
         __provider = new FETHProvider(`http://localhost:8545`);
      }
      return __provider;
   }
   
   
   
   get Wallet(){
      let __wallet;
      if(this.#walletInput === undefined){
         throw new ArgurmentError("FETHWallet.constructor",undefined, "wallet", this.#walletInput,"A ethers Wallet, Mnemonic Wallet, PrivateKey, an new ethers.prototype.Wallet or new FETHWallet", "Providing A Valid Ptovider");
      }
      
      const walletLength = 66 ;
      
      
      
      // if wallet provided mnemonic key or privateKey
      if(typeof this.#walletInput === "string"){
         const isPrivate:any =  this.#walletInput.match(privatekeyRegExp);
         const isValidPrivateKey = !!isPrivate;
         
         // if private key is provided
         if(isValidPrivateKey && this.#walletInput?.length === walletLength){
            __wallet = new ethers.Wallet(this.#walletInput,this.provider);
            
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
   
   get balance():Promise<IFormat>{
      
      return new Promise((resolve,reject) => {
         this.provider.getBalance(this.address).then((bal:any) => {
            resolve(new Format.Wei(bal.toString(), 18))
         })
         
      })
      
   }
   
   // switch account 
   switchAccount(wallet:Walletish){
      this.#walletInput = wallet;
   }
   
   // switch network  
   switchNetwork(providerStringOrProvider:string){
      this.#providerInput = providerStringOrProvider;
   }
   
   // useAs
   useAs(wallet:Walletish){
      return new FETHWallet(wallet,this.provider);
   }
   
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
   // from signer 
   static get FromSigner() {
      return FromSigner;
   }
   
   static get Provider(){
      return FETHProvider;
   }
   
   static isValidAddress(address:string){
      return addressValidator(address);
   }
   
   get ethers(){
      return ethers;
   } 
   static get utils(){
      return utils;
   }
}

/*Documentation 
Wallet is A class that has methods to interact to an ethers Wallet
Wallet {
Wallet: new ether.Walllet; 
provider: JsonRpcProvider
decimals:number;

get address:string = wallet address 
get privateKey:string = private Key 
get balance:Promise<Format> = Formated balance

methods // 

send:Promise<ethers tx> = send tokens 
estimateBeforeSend:Promiss = estemites gas before sending them
estimateGas:Promise<GasFormat> estimating gas 
Token:TokenWallet

}

*/



export default FETHWallet;
