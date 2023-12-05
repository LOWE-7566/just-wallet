import {ethers} from "ethers";
import { WalletTransactionalNumber, Walletish } from "./types";
import Format from "./Format";
class Transaction extends Format.Wei{
   amount:number|string;
   stringify:string;
   from:string;
   to:string;
   done:boolean;
   constructor(value:WalletTransactionalNumber ,decimals:number, from:string,to:string){
      super(value.toString(),decimals)
      this.amount = value.toString() ;
      this.stringify = value.toString() ;
      this.done = true;
      this.from = from;
      this.to = to;
   }
}

export default Transaction ;