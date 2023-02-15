import {ethers} from "ethers";
import Format from "./Format.js";
import TransactionLogger from "./Transaction.js";
import GasFormat from "./TokenGasFormat.js";

interface Methods{
  allowance:any;
  approve: any;
  balanceOf: any;
  decimals: any;
  name: any;
  symbol: any;
  totalSupply: any;
  // transfer: any;
  // transferFrom: any;
  getMetadata : any;
}


const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]` 
class ERCTokenManeger {
    #wallet:any;
    #contract:any
    defaultMethods:Methods;
    getMetadata:any;
    constructor(provider:any,wallet:any,address:string){
      this.#wallet = new ethers.Wallet(wallet.privateKey,provider);
      this.#contract = new ethers.Contract(address,abi, this.#wallet || provider);
      this.defaultMethods = {
        allowance: this.#contract.allowance,
        approve: this.#contract.approve,
        balanceOf: this.#contract.balanceOf,
        decimals: this.#contract.decimals,
        name: this.#contract.name,
        symbol: this.#contract.symbol,
        totalSupply: this.#contract.totalSupply,
        // transfer: this.#contract.transfer,
        // transferFrom: this.#contract.transferFrom,
        getMetadata : async () => {
          const name = await this.#contract.name();
          const symbol = await this.#contract.symbol();
          const decimals = await this.#contract.decimals();
          const totalSupply = await this.#contract.totalSupply();
          return {name,symbol,decimals,totalSupply}
        }
        
      }

      
    }
    get metadata() {
      return new Promise((resolve,reject) => {
        this.getMetadata().then((data:any) => {
          resolve(data);
        })
      })
    }
    get balance(){
      const address:any = this.#wallet.address;
      const decimals = this.defaultMethods.decimals ;
      const balanceOf = this.defaultMethods.balanceOf ;
      return new Promise((resolve:any,reject:any) => {
        
        try{
          decimals().then((decimal:any) => {
          balanceOf(address).then((bal:any) => resolve(
            new Format.Wei(bal.toString(),decimal.toString())));
          })
        } catch (e:any){
            throw e ;
        }
      })
    }
    async send(amount:string|number,to:string){
      const decimals = await this.#contract.decimals();
      const factory = Format.Factory(parseInt(decimals));
      var tx:Object = {};
      if(typeof amount === "object"){
        const config:any = amount ;
        amount = factory(config.amount);
        to = config.to;
    } else {
        to = to ;
         amount = factory(amount);
        }
      return new  Promise((resolve,reject) => {
      this.#contract.transfer(to,amount).then((c:any) => {
          const Transaction:any = new TransactionLogger(amount,decimals);
          resolve({...c, Transaction : Transaction});
        }).catch((err:any) => reject(err))
        
      })
        
    }
     async estimateGas (amount:string|number,to:string){
      const decimals:string = await this.#contract.decimals();
      const factory = Format.Factory(parseInt(decimals));
      const tx:any = {
        to : to,
        value : factory(amount)
      }
      return new Promise((resolve,reject) => {
      this.#contract.estimateGas.transfer(tx.to,tx.value)
      .then((res:any) => {
      resolve(new GasFormat.Static(tx,res,decimals));
    })
  });
}
    async estimateBeforeSend(amount:string|number,to:string){
          const decimals:string = await this.#contract.decimals();
          const factory:any = Format.Factory(parseInt(decimals));
          const tx:any = {
            to : to,
            value : factory(amount)
          }
          return new Promise((resolve,reject) => {
            this.#contract.estimateGas.transfer(tx.to,tx.value)
            .then((res:any) => {
              resolve(new GasFormat(tx,this.defaultMethods,res,decimals));
            })
        
          });
        }
  }

export default ERCTokenManeger;