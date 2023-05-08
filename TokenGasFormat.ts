import {ethers} from "ethers";
import Transaction from "./Transaction";
import Format from "./Format";
import GasFormat from "./GasFormat"
import { ITransactionConfig, BigNumberish } from "./types";



export class TokenGasFormat extends GasFormat {
    toSpendEtherFormat:string;
    totalToken:string;
    totalTokenWei:string;
    _estimatedGas:any;

    constructor(tx:ITransactionConfig,estimatedGas:BigNumberish,decimals:number){
      super(tx,estimatedGas,decimals);
      this.toSpendEtherFormat = ethers.utils.formatUnits(this.toSpend,decimals).toString();
      this.totalToken = ethers.utils.formatUnits(this.toSpend,decimals).toString(),
      this.totalTokenWei = ethers.utils.parseUnits(ethers.utils.formatUnits(this.toSpend,decimals).toString()).toString();
      
    }
    
  }
  

export default TokenGasFormat;
