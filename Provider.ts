import { ethers } from "ethers";
import Wallet from "./Wallet"
const JsonRpcProvider = ethers.providers.JsonRpcProvider;
class Provider extends JsonRpcProvider {
  constructor(provider:string){
    super(provider);
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
}

export default Provider;