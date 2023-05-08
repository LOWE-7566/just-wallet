import {ethers,type ContractInterface, type BytesLike } from "ethers";
const Wallet = ethers.Wallet
const EthContract = ethers.ContractFactory
class ContractDeployer extends EthContract  {
  constructor(abi:BytesLike|string,bin:ContractInterface|string,signer:any){
    super(bin,abi,signer);
  }
  get Deploy():any{
    return this.deploy;
  }
  
}

export default ContractDeployer;