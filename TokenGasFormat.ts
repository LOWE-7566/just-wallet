import {ethers} from "ethers";
import Transaction from "./Transaction";
import Format from "./Format";
import GasFormat from "./GasFormat"
import { ITransactionConfig, BigNumberish } from "./types";


/**
 * A GasFormat Spicified to be just for tokens
 */
export class TokenGasFormat extends GasFormat {
    toSpendEtherFormat:string; // the total tokens to spend as wei
    totalToken:string; // the total total tokesn same as total ethers
    totalTokenWei:string; // the tatal amount of tokens in wei spent 
    declare _estimatedGas:any; // the gas input 

    constructor(tx:ITransactionConfig,estimatedGas:BigNumberish,decimals:number){
      super(tx,estimatedGas,decimals);
      this.toSpendEtherFormat = ethers.utils.formatUnits(this.toSpend,decimals).toString();
      this.totalToken = ethers.utils.formatUnits(this.toSpend,decimals).toString(),
      this.totalTokenWei = ethers.utils.parseUnits(ethers.utils.formatUnits(this.toSpend,decimals).toString()).toString();
      
    }
    
  }
  

export default TokenGasFormat;
