import { ethers }  from "ethers";
import Format  from "./Format.js";
import GasFormat from "./GasFormat.js";
import Transaction from "./Transaction.js";
import FETHProvider from "./Provider.js";
import Contract from "./Contract.js";
import FromSigner from "./fromSigner";
import addressValidator from "./checkAddress";
import TokenWallet  from "./Token";
import { WalletTransactionalNumber, TypeWallet,Walletish,Providerish, EthersWallet,Wallet, Provider, ITransactionConfig} from "./types";
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`



const privatekeyRegExp =  /^0x[0-9a-fA-F]/g;
export class FETHWallet {
   mnemonic:any;
   #providerInput:any
   #walletInput:any;
   decimals:number;
   _isWallet:boolean;
   
   
   constructor(wallet:Walletish, provider:Providerish){
      this.#providerInput = provider;
      this.#walletInput = wallet;
      this.decimals = 18 ;
      this._isWallet = true;
   }
   
   // provider 
   get provider(){
      let __provider:any;
      if(typeof this.#providerInput === "string"){
         __provider = new FETHProvider(this.#providerInput || `http://localhost:8545`);
      } else if(this.#providerInput?._isProvider){
         __provider = this.#providerInput;
      } else {
         __provider = new FETHProvider(`http://localhost:8545`);
      }
      return __provider;
   }
   
   
   
   get Wallet(){
      let __wallet;
      if(this.#walletInput === undefined){
         throw new Error("Wallet is Emty");
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
   get address(){
      return  this.Wallet.address ;
   }
   
   // getter for private key
   get privateKey(){
      return this.Wallet.privateKey;
   }
   
   get balance():Promise<Format>{
      
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
      
      const wallet = this.Wallet;
      if(!to || !amount){
         throw new Error("Wallet: Address or Amount is undefined")
      }
      return new Promise(async (resolve,reject) => {
         // check balance 
         const balance:any = await this.balance;
         const factory = Format.Factory(this.decimals);
         const tokenAmount = factory(amount);
         const enoughBalance = BigInt(balance.wei) >= BigInt(tokenAmount);
         const isValidAddress = addressValidator(to.address||to);
         const address = this.address;
         var tx:ITransactionConfig = {}
         
         if(typeof config === "string"){
            tx.gasLimit = config ;
         }
         
         if(typeof config === "object"){
            tx = {...tx, ...config};
         }
         
         tx.to = to.address || to;
         tx.value = amount.wei ||  factory(amount.toString());
         // check if address provided is valid;
         if(!isValidAddress.valid){
            reject({msg : "Address Provided is not valid", data : isValidAddress});
            return;
         } 
         // if account has enough balance 
         if(!enoughBalance){
            // if transaction exeeds balance
            reject({msg: "Not enough balance to contineu this transaction", transaction : tx, balance  : balance});
            return;
         }
         
         //sending transaction.... promise
         wallet.sendTransaction(tx)
         .then(async (result:any) => {
            const wait = await result.wait()
            wait.Transaction = new Transaction(tx.value,18,address,tx.to);
            resolve(wait);
         }).catch((err:any) => reject(err))
      })
   } 
   
   
   // estimate gas... 
   estimateGas (amount:ITransactionConfig,to:Walletish){
      const factory = Format.Factory(this.decimals);
      const tx:ITransactionConfig = {};
      
      tx.to = to.address || to;
      tx.value = amount.wei ||  factory(amount.toString());
      return new Promise((resolve,reject) => {
         const isValidAddress = addressValidator(to);
         // if Address Provided is not valid 
         if(!isValidAddress){
            reject({msg : "Address Provided is not valid", data : isValidAddress});
            return;
         } 
         this.Wallet.estimateGas(tx).then((res:any) => {
            resolve(new GasFormat.Static(tx,res))
         })
         
      })
   }
   
   
   // using the ERC20 Wallet
   Token(addr:string){
      return new TokenWallet(this.Wallet,addr);
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
