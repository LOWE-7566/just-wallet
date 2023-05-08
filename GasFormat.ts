import {ethers} from "ethers";
import Transaction from "./Transaction.js";
import Format from "./Format";
import { ITransactionConfig, BigNumberish } from "./types" ;
const BigNumber:any = ethers.BigNumber;


  export class GasFormat extends Format.Wei{
     
    _estimatedGas:any;
    estimatedGasInEther:string;
    estimatedGasInWei:string;
    toSpend:string;
    transactionInfo:any;
    totalEthers:string;
    totalWei:string;
    
    
  constructor(tx:ITransactionConfig,estimatedGas:BigNumberish,_decimals?:number){
     const decimals:number = _decimals ||18;
    const Formated = new Format.Wei(tx.value?.toString() || "");
     super(estimatedGas.toString(),decimals);
     this.toSpend = Formated.wei;
    this._estimatedGas = estimatedGas;
    this.estimatedGasInEther = ethers.utils.formatEther(this.estimatedGas.toString()).toString();
    this.estimatedGasInWei = ethers.utils.parseEther(this.estimatedGasInEther).toString();
    
    this.transactionInfo = tx;
    this.totalEthers = ethers.utils.formatEther(this.total.toString());
    this.totalWei = this.total.toString()
    }
    get total(){
      return BigNumber.from(this.estimatedGas).add(this.toSpend).toString();
    }
    get estimatedGas(){
      return this._estimatedGas ;
    }
  
    
  }
  
  

  


export default GasFormat ;