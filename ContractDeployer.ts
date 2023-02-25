import {ethers } from "ethers";
const Wallet = ethers.Wallet
const EthContract = ethers.ContractFactory
class ContractDeployer extends EthContract  {
  constructor(abi:any,bin:string,signer:any){
    super(abi,bin,signer);
  }
  get Deploy():any{
    return this.deploy;
  }
  
}

export default ContractDeployer;