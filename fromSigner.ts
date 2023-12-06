import TokenWallet from "./Token.js";
import Format  from "./Format.js";
import addressValidator from "./checkAddress.js";
import SendTransaction  from "./Send.js";
import estimateGas from "./EstimateGas.js"
import  { ArgurmentError } from "./utils/Error.js";
import { Walletish,WalletTransactionalNumber,ITransactionConfig, IFormat, Token} from "./types.js";
import { Signer } from "ethers";
import GasFormat from "./GasFormat.js";

/**
 * A separate class that accepts a signer as a wallet 
 */
export class FromSignerWallet {
   #signerInput:any;
   decimals: number;
   invalids: any;
   // Token:any;
   constructor(signer:any){
           this.decimals = 18;
      this.invalids = {
         signer:  new ArgurmentError("JustWallet.Fromsigner.constructor",undefined, "signer", signer, "Ethers signer ", "Providing A Valid signer.")
      }
      
      if (!signer) throw this.invalids.signer;
      this.#signerInput = signer;
 
   }
   
   
   // get the balance of the address
   get balance():Promise<IFormat>{
      return new Promise(async (resolve,reject) => {
         this.signer.getBalance().then((bal:Format) => resolve(new Format.Wei(bal.toString(), 18)));
      })
      
   }
   
   // get the actual signer 
   get signer():any {
      const __signer =  this.#signerInput._isSigner ? this.#signerInput : undefined;
      if(!__signer){
         throw this.invalids.signer
      }
      return __signer;
   }
   
   // get the address unlike the JustWallet class it is asynchronous 
   get address():Promise<string>{
      return new Promise(async (resolve,reject) => {
         this.signer.getAddress().then((_addr:string) => resolve(_addr));
      })
   }
   
   // switch signers 
   switchSigner(signer:any):void{
      this.#signerInput = signer;
   }
   
   // create a new wallet but with different signer
   useAs(signer:any):FromSignerWallet {
      return new FromSignerWallet(signer);
   }
   
   
   // @params amount is an ethers string or an object used to send ethers 
   async send(amount:WalletTransactionalNumber,to:Walletish,config?:string|ITransactionConfig):ReturnType<typeof SendTransaction>{
      return SendTransaction(amount,to,this,config);
   
   } 
   
   // estimate gas... 
   estimateGas(amount:WalletTransactionalNumber,to:Walletish):Promise<GasFormat>{
      return estimateGas(amount,to,this);
   }
   
   // using the ERC20 Wallet
   Token(addr:any):TokenWallet{
      const address = addr.address || addr
      return new TokenWallet(this.signer, address);
   }
   
   // a address validator 
   static isValidAddress(address:string):ReturnType<typeof addressValidator> {
      return addressValidator(address);
   }
   
}




export default FromSignerWallet;
