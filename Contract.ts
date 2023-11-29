import {ethers} from "ethers";
import Wallet from "./Wallet.js"
import ContractDeployer from "./ContractDeployer.js";
import { type ContractInterface, } from "ethers";
import { type Provider, type Signer } from "./types";
const EthContract = ethers.Contract;
class Contract {
  #contract:any;
  interface:any;
  signer:Signer|undefined;
  callStatic:any;
  estimateGas:any;
  functions:any;
  populate:any;
  filters:any;
  _runningEvents:any;
  _wrappedEmits:any;
  address:any;
  resolvedAddress:any;
  call:any;
  constructor(address:string,abi:ContractInterface|string,signer:any){
    const contract = new EthContract(address,abi,signer);
    this.#contract = contract;
    const Keys:any[]  = Object.keys(contract);
    Keys.forEach((key:keyof Contract) => {
      const value = contract[key];
      if(key != "signer"){
        this[key] = value;
      }
    })
    this.interface = contract.interface;
    this.signer = new Wallet(signer.provider || signer, signer.privateKey);
    this.callStatic = contract.callStatic;
    this.estimateGas = contract.estimateGas;
    this.functions = contract.functions;
    this.populate = contract.populateTransaction;
    this.filters = contract.filters;
    this._runningEvents = contract._runningEvents;
    this._wrappedEmits = contract._wrappedEmits;
    this.address = contract.address;
    this.resolvedAddress = contract.resolvedAddress;
    const keys = Object.keys(contract.functions);
    this.call = {};
    for(var i = 0; i <  keys.length; i++){
      const functions = contract.functions;
      const key: typeof keys[0]  = keys[i];
      this.call[key] = contract[key];
    }
  }
  static get Deployer(){
    return ContractDeployer;
  }
  
}


export default Contract;

