import {ethers} from "ethers";
import Format from "./Format.js";
import TransactionLogger from "./Transaction.js";
import GasFormat from "./TokenGasFormat.js";
import addressValidator from "./checkAddress";

interface Methods{
  allowance:any;
  approve: any;
  balanceOf: any;
  decimals: any;
  name: any;
  symbol: any;
  totalSupply: any;
  getMetadata : any;
  address:string;
}


const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]` 
interface ERCTokenManegerConfig {
  provider:any;
  wallet:any; 
  address:string;
  isSigner:boolean;
}


class ERCTokenManeger {
  #wallet:any;
  #contract:any
  defaultMethods:Methods;
  getMetadata:any;
  
  
  constructor(walletOrProvider:any,address:string){
    this.#wallet = walletOrProvider.Wallet || walletOrProvider;
    this.#contract = new ethers.Contract(address,abi, this.#wallet);
    this.defaultMethods = {
      address : this.#contract.address,
      allowance: this.#contract.allowance,
      approve: this.#contract.approve,
      balanceOf: this.#contract.balanceOf,
      decimals: this.#contract.decimals,
      name: this.#contract.name,
      symbol: this.#contract.symbol,
      totalSupply: this.#contract.totalSupply,
      getMetadata : async () => {
        const name = await this.#contract.name();
        const symbol = await this.#contract.symbol();
        const decimals = await this.#contract.decimals();
        const __totalSupply = await this.#contract.totalSupply();
        const totalSupply = new Format.Wei(__totalSupply.toString(), decimals.toString());
        return {name,symbol,decimals,totalSupply}
      }
      
    }
    
    
  }
  
  // account address;
  // return metadata => Promise {name,symbol,decimals,totalSupply}
  get metadata() {
    return new Promise((resolve,reject) => {
      this.defaultMethods.getMetadata().then((data:any) => {
        resolve(data);
      })
    })
  }
  
  // get balance in Format form 
  get balance():Promise<any>{
    const wallet = this.#wallet;
    const decimals = this.defaultMethods.decimals ;
    const balanceOf = this.defaultMethods.balanceOf ;
    return new Promise(async (resolve:any,reject:any) => {
      try{
        const __address:any = wallet.address || await wallet.getAddress();
        const address =__address.toString();
        decimals().then((decimal:any) => {
          balanceOf(address).then((bal:any) => resolve(
            new Format.Wei(bal.toString(),decimal.toString())));
        })
      } catch (e:any){
        throw e ;
      }
    })
  }
  
  // send tokens :Promise
  async send(amount:string|number,to:string,gasLimit?:string){
    const decimals = await this.#contract.decimals();
    const factory = Format.Factory(parseInt(decimals));
    var tx:Object = {};
    amount = factory(amount);
    return new  Promise(async (resolve,reject) => {
      const balance:any = await this.balance;
      const tokenAmount = factory(amount);
      const enoughBalance = balance.wei >= tokenAmount.toString();
      const isValidAddress = addressValidator(to);
      if(!isValidAddress.valid){
        reject({msg : "Address Provided is not valid", data : isValidAddress});
        return;
      }
      // if account has enough balance 
      if(!enoughBalance){
        // if transaction exeeds balance
        reject({msg: "Not enough balance to contineu this transaction", transaction : tx, balance  : balance});
        return;
      }
      this.#contract.transfer(to,amount,{gasLimit : gasLimit}).then((c:any) => {
        const Transaction:any = new TransactionLogger(amount,decimals);
        resolve({...c, Transaction : Transaction});
      }).catch((err:any) => reject(err))
      
    })
    
  }
  
  // estimateGas:promise
  async estimateGas (amount:string|number,to:string){
    const decimals:string = await this.#contract.decimals();
    const factory = Format.Factory(parseInt(decimals));
    const isValidAddress = addressValidator(to);
    const tx:any = {
      to : to,
      value : factory(amount)
    }
    return new Promise((resolve,reject) => {
      if(!isValidAddress.valid){
        reject({msg : "Address Provided is not valid", data : isValidAddress});
        return;
      }
      this.#contract.estimateGas.transfer(tx.to,tx.value)
      .then((res:any) => {
        resolve(new GasFormat.Static(tx,res,decimals));
      })
    });
  }
  
  
}

export default ERCTokenManeger;