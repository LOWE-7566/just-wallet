import {ethers} from "ethers";
import Transaction from "./Transaction.js";
const BigNumber:any = ethers.BigNumber;

  export class StaticGasFormat {
    #estimatedGas:any;
    estimatedGasInEther:string;
    estimatedGasInWei:string;
    toSpend:string;
    transactionInfo:any;
    totalEthers:string;
    totalWei:string;
    
    
  constructor(tx:any,estimatedGas:any){
    this.#estimatedGas = estimatedGas;
    this.estimatedGasInEther = ethers.utils.formatEther(this.#estimatedGas.toString()).toString();
    this.estimatedGasInWei = ethers.utils.parseEther(this.estimatedGasInEther).toString();
    this.toSpend = tx.value.toString();
    this.transactionInfo = tx ;
    this.totalEthers = ethers.utils.formatEther(this.total.toString());
    this.totalWei = this.total.toString()
    }
    get total(){
      return BigNumber.from(this.estimatedGas).add(this.toSpend).toString();
    }
    get estimatedGas(){
      return this.#estimatedGas ;
    }
  
    
  }
  export class GasFormat extends StaticGasFormat {
    #Wallet:any;
    constructor(tx:any,estimatedGas:any,wallet:any){
      super(tx,estimatedGas);
      this.#Wallet = wallet;
    }
    send(){
    const tx = this.transactionInfo;
      tx.gasLimit = BigNumber.from(this.estimatedGasInWei) ;
    const Wallet = this.#Wallet ;
    return new Promise((resolves,rejects) => {
      Wallet.sendTransaction(tx).then((res:any) =>{ 
        res.Transaction = new Transaction(tx.value,18);
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