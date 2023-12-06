import {ethers,type ContractInterface, type BytesLike } from "ethers";
const Wallet = ethers.Wallet
const EthContract = ethers.ContractFactory
/**
 * A CractFactory Wrapper Class 
 */
class ContractDeployer extends EthContract  { 
  constructor(abi:string,bin:ContractInterface,signer:any){
    super(bin,abi,signer);
  }
  get Deploy():any{
    return this.deploy;
  }
}

export default ContractDeployer;