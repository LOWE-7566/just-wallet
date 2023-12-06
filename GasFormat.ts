import {ethers} from "ethers";
import Format from "./Format";
import { ITransactionConfig } from "./types";
import { BigNumberish } from "./types";
const BigNumber:any = ethers.BigNumber;


  /**
   * A Gas Format that is used to display the gas used when sending tokens or ethers 
   */
export class GasFormat extends Format.Wei{
    _estimatedGas:number|BigNumberish|BigInt; // the input value
    estimatedGasInEther:string; // thes estimated gas in ether
    estimatedGasInWei:string; // estimated gas in wei 
    toSpend:string; // the amount spend in the transaction 
    transactionInfo:ITransactionConfig; // the transaction information 
    totalEthers:string; // the total value of ethers ethers spent  + gas fee 
    totalWei:string; // the total value of wei spent  + gas fee s
    
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
    // calculate the total spent amount + fee  
    get total(){
      return BigNumber.from(this.estimatedGas).add(this.toSpend).toString();
  }
  // get the total gas spent 
    get estimatedGas():BigNumberish{
      return BigInt(this._estimatedGas.toString()) ;
    }
  
    
  }
  


export default GasFormat ;