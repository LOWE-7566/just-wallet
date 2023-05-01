import {ethers} from "ethers";
import Transaction from "./Transaction";
import Format from "./Format";
import GasFormat from "./GasFormat"
import { ITransactionConfig, BigNumberish } from "./types";



export class TokenStaticGasFormat extends GasFormat.Static {
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
    
    get total() {
        return `${this._estimatedGas.toString()} ${this.toSpend}`;
      }
      
    get estimatedGas() {
      return this._estimatedGas ;
    }
  }
  
export class TokenGasFormat extends TokenStaticGasFormat {
  #methods:any;
  _estimatedGas:string;
  constructor(tx:any,contract:any,estimatedGas:any,dec:any){
    super(tx,estimatedGas,dec);
    this._estimatedGas = estimatedGas;
     this.#methods =  contract ;
  }
  send(){
      const gas = this.estimatedGasInWei;
      const Gas:any = ethers.BigNumber.from(gas);
      const gasLimit:string = Gas.toString();
      const transactionInfo:any = this.transactionInfo ;
      const methods = this.#methods;
      if(gas){
          return new Promise((resolves,rejects) => {
            methods.transfer(transactionInfo.to,transactionInfo?.value, {gasLimit : `${gasLimit}`}).then(function(res:any) { 
              res.Transaction = new Transaction(transactionInfo.value,18,methods.address,transactionInfo.to);
              resolves(res)})
            .catch(function(err:any){rejects(err)})
          })
      } else {
      return new Promise((resolves,rejects) => {
        const tx = transactionInfo;
      methods.transfer(tx.to,tx.value).then(function(res:any) { 
        res.Transaction = new Transaction(tx.value,18,methods.address, tx.to);
        resolves(res)})
      .catch(function(err:any){ rejects(err)})
    })
    }
      
    }
  static get Static(){
    return TokenStaticGasFormat ;
  }
}

export default TokenGasFormat;
