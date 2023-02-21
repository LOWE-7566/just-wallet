import {ethers} from "ethers";
import Transaction from "./Transaction";
export class TokenStaticGasFormat {
    estimatedGasInEther:string;
    estimatedGasInWei:string;
    toSpend:string;
    toSpendEtherFormat:string;
    transactionInfo:any;
    totalToken:string;
    totalTokenWei:string;
    totalEthers:string;
    totalWei:string;
    #estimatedGas:any;

    
    constructor(tx:any,estimatedGas:any,dec:any){
      this.#estimatedGas = estimatedGas;
      this.estimatedGasInEther= ethers.utils.formatUnits(this.estimatedGas.toString(),dec).toString();
      this.estimatedGasInWei = ethers.utils.parseUnits(this.estimatedGasInEther,dec).toString()
      this.toSpend = tx.value.toString();
      this.toSpendEtherFormat = ethers.utils.formatUnits(this.toSpend,dec).toString();
      this.transactionInfo = tx ;
      this.totalToken = ethers.utils.formatUnits(this.toSpend,dec).toString(),
      this.totalTokenWei = ethers.utils.parseUnits(ethers.utils.formatUnits(this.toSpend,dec).toString()).toString();
      this.totalEthers = ethers.utils.formatEther(this.estimatedGas.toString()).toString();
      this.totalWei = ethers.utils.parseEther(ethers.utils.formatEther(this.estimatedGas.toString()).toString()).toString()
      
    }
    get total() {
        return `${this.estimatedGas.toString()} ${this.toSpend}`;
      }
    get estimatedGas() {
      return this.#estimatedGas ;
    }
  }
  
export class TokenGasFormat extends TokenStaticGasFormat {
  #methods:any;
  constructor(tx:any,contract:any,estimatedGas:any,dec:any){
    super(tx,estimatedGas,dec);
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
              res.Transaction = new Transaction(transactionInfo.value,18);
              resolves(res)})
            .catch(function(err:any){rejects(err)})
          })
      } else {
      return new Promise((resolves,rejects) => {
        const tx = transactionInfo;
      methods.transfer(tx.to,tx.value).then(function(res:any) { 
        res.Transaction = new Transaction(tx.value,18);
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
