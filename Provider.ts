import { ethers } from "ethers";
import Wallet from "./Wallet"
const JsonRpcProvider = ethers.providers.JsonRpcProvider;
class Provider extends JsonRpcProvider {
  constructor(provider:string){
    super(provider);
  }
}

export default Provider;