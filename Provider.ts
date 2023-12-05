import { ethers } from "ethers";

/**
 * A class that extends the JsonRpcProvider 
 */
const JsonRpcProvider = ethers.providers.JsonRpcProvider;
const Web3Provider = ethers.providers.Web3Provider;

class Provider extends JsonRpcProvider {
  constructor(provider?:string){
    super(provider || "http://127.0.0.1:8545");
  }
  /**
   * indicate that the provider is ready 
   */
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
  
  
  // identify ir it is an ethers provider 
  Ethers(provider:any){
    if(provider._isProvider){
      throw new Error("Provider is not ethers.Provider")
    }
    return provider;
  }
  
  // Web3Provider
  /**
   * A Static getter that resolve for web3Provider like metatmask 
   */
  static get Browser(){
    return Web3Provider;
  }
  
  
}

export default Provider;