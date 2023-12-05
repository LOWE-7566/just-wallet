import TokenWallet from "./Token.js";
import Format  from "./Format.js";
import addressValidator from "./checkAddress";
import SendTransaction from "./Send";
import estimateGas from "./EstimateGas"
import  { ArgurmentError } from "./utils/Error";
import { Walletish,WalletTransactionalNumber,ITransactionConfig} from "./types";

/**
 * A separate class that accepts a signer as a wallet 
 */
export class FromSignerWallet {
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
   
   
   // get the balance of the address
   get balance(){
      return new Promise(async (resolve,reject) => {
         this.signer.getBalance().then((bal:Format) => resolve(new Format.Wei(bal.toString(), 18)));
      })
      
   }
   
   // get the actual signer 
   get signer() {
      const __signer =  this.#signerInput._isSigner ? this.#signerInput : undefined;
      if(!__signer){
         throw new Error("Invalid signer");
      }
      return __signer;
   }
   
   // get the address unlike the FETHWallet class it is asynchronous 
   get address(){
      return new Promise(async (resolve,reject) => {
         this.signer.getAddress().then((_addr:string) => resolve(_addr));
      })
   }
   
   // switch signers 
   switchSigner(signer:any){
      this.#signerInput = signer;
   }
   
   // create a new wallet but with different signer
   useAs(signer:any){
      return new FromSignerWallet(signer);
   }
   
   
   // @params amount is an ethers string or an object used to send ethers 
   async send(amount:WalletTransactionalNumber,to:Walletish,config?:string|ITransactionConfig){
      return SendTransaction(amount,to,this,config);
   
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
   
   // a address validator 
   static isValidAddress(address:string){
      return addressValidator(address);
   }
   
}




export default FromSignerWallet;
