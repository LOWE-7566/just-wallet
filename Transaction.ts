import {ethers} from "ethers";
class Transaction {
  amount:number|string;
  stringify:string;
  eth:string;
  wei:string;
  decimals:number;
  done:boolean;
  constructor(value:string|number ,dec:number){
  this.amount = value ;
  this.stringify = value.toString() ;
  this.eth = ethers.utils.formatUnits(value,dec).toString();
  this.wei = ethers.utils.parseUnits(this.eth,dec).toString();
  this.decimals = dec ;
  this.done = true;
}
}

export default Transaction ;