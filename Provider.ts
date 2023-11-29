import { ethers } from "ethers";
import Wallet from "./Wallet"
const JsonRpcProvider = ethers.providers.JsonRpcProvider;
const Web3Provider = ethers.providers.Web3Provider;
class Provider extends JsonRpcProvider {
  constructor(provider?:string){
    super(provider || "http://127.0.0.1:8545");
  }
  get isReady(){
    return new Promise<boolean>(async (resolve, reject) => {
      const ready = await this.ready;
      if(ready){
      resolve(true);
      return;
      } 
      reject(false)
    })
  }
  
  
  // ethers
  Ethers(provider:any){
    if(provider._isProvider){
      throw new Error("Provider is not ethers.Provider")
    }
    return provider;
  }
  
  // Web3Provider
  static get Web3(){
    return Web3Provider;
  }
  
  
}

export default Provider;