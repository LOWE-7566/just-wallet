import {ethers, ContractTransaction } from "ethers";
import Format from "./Format.js";
import Transaction from "./Transaction.js";
import GasFormat from "./TokenGasFormat.js";
import addressValidator from "./checkAddress";
import {IFormat, Walletish,ITransactionConfig,WalletTransactionalNumber, IWalletish} from "./types";
import { ArgurmentError, ExecutionError } from "./utils/Error";
import ToSendAndRecipient from "./utils/ToSendAndRecipient.js";
interface TokenSendTransaction extends ContractTransaction {
   Transaction: Transaction
} 


export interface Methods{
   allowance:any;
   approve: any;
   balanceOf: any;
   decimals: any;
   name: any;
   symbol: any;
   totalSupply: any;
   getMetadata : any;
   address:string;
}
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]` 
interface ERCTokenManegerConfig {
   provider:any;
   wallet:any; 
   address:string;
   isSigner:boolean;
}


class ERCTokenManeger {
   #walletOrProvider:any;
   #contract:any
   defaultMethods:Methods;
   getMetadata:any;
   
   
   constructor(walletOrProvider:any,address:string){
      const adr = address;
      if(!address || !addressValidator(adr).valid ){
         throw new ArgurmentError("FETHWallet.Token.constructor",undefined, "address" ,address,"A valid ethers address.", "Providing a valid address.");
      }
      
      this.#walletOrProvider = walletOrProvider.Wallet || walletOrProvider;
      this.#contract = new ethers.Contract(adr,abi, this.#walletOrProvider);
      this.defaultMethods = {
         address : this.#contract.address,
         allowance: this.#contract.allowance,
         approve: this.#contract.approve,
         balanceOf: this.#contract.balanceOf,
         decimals: this.#contract.decimals,
         name: this.#contract.name,
         symbol: this.#contract.symbol,
         totalSupply: this.#contract.totalSupply,
         getMetadata : async () => {
            const name = await this.#contract.name();
            const symbol = await this.#contract.symbol();
            const decimals = await this.#contract.decimals();
            const __totalSupply = await this.#contract.totalSupply();
            const totalSupply = new Format.Wei(__totalSupply.toString(), decimals.toString());
            return {name,symbol,decimals,totalSupply}
         }
         
      }
      
      
   }
   
   // account address;
   // return metadata => Promise {name,symbol,decimals,totalSupply}
   get metadata() {
      return new Promise((resolve,reject) => {
         this.defaultMethods.getMetadata().then((data:any) => {
            resolve(data);
         })
      })
   }
   
   // get balance in Format form 
   get balance():Promise<any>{
      const wallet = this.#walletOrProvider;
      const decimals = this.defaultMethods.decimals ;
      const balanceOf = this.defaultMethods.balanceOf ;
      return new Promise(async (resolve:any,reject:any) => {
         try{
            const __address:any = wallet.address || await wallet.getAddress();
            const address =__address.toString();
            decimals().then((decimal:any) => {
               balanceOf(address).then((bal:any) => resolve(
                  new Format.Wei(bal.toString(),decimal.toString())));
            })
         } catch (e:any){
            throw e ;
         }
      })
   }
   
   
   // switchSigner
   useAs(walletOrProvider:any){
      return new ERCTokenManeger(walletOrProvider,this.#contract.address);
   }
   
   
   // switch address 
   useAddress(account:Walletish){
      const address = (account as IWalletish).address || account.toString()
      return new ERCTokenManeger(this.#walletOrProvider,address);
   }
   
   // approve
   async approve(amount:string|number,to:string){
      return this.#contract.approve(to,amount);
   }
   
   // send tokens :Promise
   async send(amount:WalletTransactionalNumber,to:Walletish,config?:ITransactionConfig):Promise<TokenSendTransaction>{
      const decimals = await this.#contract.decimals();
      const factory = Format.Factory(parseInt(decimals));

      var tx: ITransactionConfig = { value: "", to: "" }
      const { recipient, amountToSend } = ToSendAndRecipient(amount, to, parseInt(decimals));
      tx.to = recipient;
      tx.value = amountToSend;
      return new  Promise(async (resolve,reject) => {
         const balance:any = await this.balance;
         const enoughBalance = balance.wei >= tx.to.toString();
         const isValidAddress = addressValidator(tx.to);
         if(!isValidAddress.valid){
            throw new ArgurmentError("FETHWallet.Token.send",isValidAddress, "to", tx.to,"A ethers Wallet, Mnemonic Wallet, PrivateKey, an new ethers.Wallet or new FETHWallet", "Providing A Valid Ptovider");
            return;
         }
         // if account has enough balance 
         if(!enoughBalance){
            // if transaction exeeds balance
            throw new ExecutionError("FETHWallet.Token.send",{balance : balance.wei, error: `not enough balance`, amount : tx.value }, "Send tokens that is lesser or equal to your tken balance ")
            
         }
         this.#contract.transfer(tx.to,tx.value,{...config}).then(async (result:any) => {
            try {
               
               const SendTransaction:any = new Transaction(tx.value,decimals,this.#walletOrProvider.address,tx.to);
               const wait = await result.wait();
               wait.Transaction = SendTransaction;
               resolve(wait);
            } catch(err:any){
               const error =  new ExecutionError("FETHWallet.send", {...err}, "Send tokens that is lesser or equal to your tken balance ")
               reject(error);
            }
         }).catch((err:any) => {
            const error =  new ExecutionError("FETHWallet.send", {...err}, "Send tokens that is lesser or equal to your tken balance ")
            reject(error);
         })
         
      })
      
   }
   
   
   // estimateGas:promise
   async estimateGas (amount:WalletTransactionalNumber,to:Walletish):Promise<GasFormat>{
      const decimals:string = await this.#contract.decimals();
      const factory = Format.Factory(parseInt(decimals));
      const tx: any = {}
      const { recipient, amountToSend} = ToSendAndRecipient(amount,to)
      tx.to = recipient;
      tx.value = amountToSend; 
      
      
      const isValidAddress = addressValidator(tx.to);
      return new Promise((resolve,reject) => {
         if(!isValidAddress.valid){
            throw new ArgurmentError("FETHWallet.Token.estimateGas",isValidAddress, "to", tx.to,"A ethers Wallet, Mnemonic Wallet, PrivateKey, an new ethers.Wallet or new FETHWallet", "Providing A Valid Ptovider");
            return;
         }
         
         this.#contract.estimateGas.transfer(tx.to,tx.value)
         .then((res:any) => {
            resolve(new GasFormat(tx,res,parseInt(decimals)));
         }).catch((err:any) => {
            const error =  new ExecutionError("FETHWallet.estimateGas", {...err}, "Send tokens that is lesser or equal to your tken balance ")
            reject(error);
         })
      });
   }
   
}

export default ERCTokenManeger;