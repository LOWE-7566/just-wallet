import {ethers} from "ethers";
import Format from "./Format";
class Transaction extends Format.Wei{
   amount:number|string;
   stringify:string;
   from:string;
   to:string;
   done:boolean;
   constructor(value:string|number ,decimals:number, from:string,to:string){
      super(value.toString(),decimals)
      this.amount = value ;
      this.stringify = value.toString() ;
      this.done = true;
      this.from = from;
      this.to = to;
   }
}

export default Transaction ;