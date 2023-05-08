import { ethers, Signer}  from "ethers";
import TokenWallet from "./Token.js";
import Format  from "./Format.js";
import GasFormat from "./GasFormat.js";
import Transaction from "./Transaction.js";
import Provider from "./Provider.js";
import addressValidator from "./checkAddress";
import send from "./Send";
import estimateGas from "./EstimateGas"
import ErrorLogger, { ArgurmentError } from "./utils/Error";
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`
import { Walletish,WalletTransactionalNumber,ITransactionConfig,Contract} from "./types";
const privatekeyRegExp =  /^0x[0-9a-fA-F]/g;
export class FromSignerWallet {
   #mnemonic:any;
   #signerInput:any;
   decimals:number;
   // Token:any;
   constructor(signer:any){
      if(!signer){
          throw new ArgurmentError("FETHWallet.FromSigner.constructor",undefined, "signer", signer, "Ethers signer ", "Providing A Valid signer.");
      } else if(!signer._isSigner){
         throw new ArgurmentError("FETHWallet.FromSigner.constructor",undefined, "signer", signer, "Ethers signer ", "Providing A Valid signer.");
      }
      
      this.#signerInput = signer;
      this.decimals = 18;
   }
   
   
   // promis => get balance of the wallet
   get balance(){
      return new Promise(async (resolve,reject) => {
         this.signer.getBalance().then((bal:Format) => resolve(new Format.Wei(bal.toString(), 18)));
      })
      
   }
   
   get signer() {
      const __signer =  this.#signerInput._isSigner ? this.#signerInput : undefined;
      if(!__signer){
         throw new Error("Invalid signer");
      }
      return __signer;
   }
   
   get address(){
      return new Promise(async (resolve,reject) => {
         this.signer.getAddress().then((_addr:string) => resolve(_addr));
      })
   }
   
   switchSigner(signer:any){
      this.#signerInput = signer;
   }
   
   useAs(signer:any){
      return new FromSignerWallet(signer);
   }
   
   
   
   // send 
   // @params amount is an ethers string or an object used to send ethers 
   async send(amount:WalletTransactionalNumber,to:Walletish,config?:string|ITransactionConfig){
      return send(amount,to,this,config);
   
   } 
   
   // estimate gas... 
   estimateGas(amount:WalletTransactionalNumber,to:Walletish){
      return estimateGas(amount,to,this);
   }
   
   // using the ERC20 Wallet
   Token(addr:any){
      const address = addr.address || addr
      return new TokenWallet(this.signer, address);
   }
   
   static isValidAddress(address:string){
      return addressValidator(address);
   }
   
}

// /*Documentation 
// Wallet is A class that has methods to interact to an ethers Wallet
// Wallet {
//     Wallet: new ether.Walllet; 
//     decimals:number;

//     get address:string = wallet address 
//     get privateKey:string = private Key 
//     get balance:Promise<Format> = Formated balance

//     methods // 

//     send:Promise<ethers tx> = send tokens 
//     estimateBeforeSend:Promiss = estemites gas before sending them
//     estimateGas:Promise<GasFormat> estimating gas 
//     Token:TokenWallet

// }

// */



export default FromSignerWallet;
