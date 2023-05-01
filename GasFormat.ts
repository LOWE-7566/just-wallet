import {ethers} from "ethers";
import Transaction from "./Transaction.js";
import Format from "./Format";
import { ITransactionConfig, BigNumberish } from "./types" ;
const BigNumber:any = ethers.BigNumber;

  export class StaticGasFormat extends Format.Wei{
    _estimatedGas:any;
    estimatedGasInEther:string;
    estimatedGasInWei:string;
    toSpend:string;
    transactionInfo:any;
    totalEthers:string;
    totalWei:string;
    
    
  constructor(tx:ITransactionConfig,estimatedGas:BigNumberish,decimals:number){
     super(estimatedGas.toString(),decimals);
    this._estimatedGas = estimatedGas;
    this.estimatedGasInEther = ethers.utils.formatEther(this.estimatedGas.toString()).toString();
    this.estimatedGasInWei = ethers.utils.parseEther(this.estimatedGasInEther).toString();
    this.toSpend = tx.value ? tx.value.toString(): "0";
    this.transactionInfo = tx ;
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
  
  export class GasFormat extends StaticGasFormat {
    #Wallet:any;
    constructor(tx:any,estimatedGas:any,decimals:number,wallet:any){
      super(tx,estimatedGas,decimals);
      this.#Wallet = wallet;
    }
    send(){
    const tx = this.transactionInfo;
      tx.gasLimit = BigNumber.from(this.estimatedGasInWei) ;
    const Wallet = this.#Wallet ;
    return new Promise((resolves,rejects) => {
      Wallet.sendTransaction(tx).then((res:any) =>{ 
        res.Transaction = new Transaction(tx.value,18,Wallet.address,tx.to);
        resolves(res)})
      .catch((err:any) => rejects(err))
    });
  }
    static get Static(){
      return StaticGasFormat;
    }
}
  
  
  // GasFormat No methods 

  


export default GasFormat ;