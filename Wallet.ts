import { ethers}  from "ethers";
import TokenWallet from "./Token.js";
import Format  from "./Format.js";
import GasFormat from "./GasFormat.js";
import Transaction from "./Transaction.js";
import Provider from "./Provider.js";
import Contract from "./Contract.js";
import FromSigner from "./fromSigner";
import addressValidator from "./checkAddress";
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`


const privatekeyRegExp =  /^0x[0-9a-fA-F]/g;
export class Wallet {
 #mnemonic:any;
 #providerInput:any
 #walletInput:any;
  decimals:number;
  
  
  constructor(wallet:any,provider?:any){
     this.#providerInput = provider;
     this.#walletInput = wallet;
     this.decimals = 18 ;
  }
  
 // provider 
 get provider(){
   let __provider:any;
    if(typeof this.#providerInput === "string"){
      __provider = new Provider(this.#providerInput || `http://localhost:8545`);
    } else if(this.#providerInput?._isProvider){
      __provider = this.#providerInput;
    } else {
       __provider = new Provider(`http://localhost:8545`);
    }
    return __provider;
 }
 
 
 get Wallet(){
    let __wallet;
    if(this.#walletInput === undefined){
      throw new Error("Wallet is Emty");
    }
    const walletLength = 66 ;

    
    
    // if wallet provided mnemonic key or privateKey
    if(typeof __wallet === "string"){
      const isPrivate:any =  __wallet.match(privatekeyRegExp);
      const isValidPrivateKey = !!isPrivate;
      const splitted = this.#walletInput.trim().split(" ");
      
      // if private key is provided
      if(isValidPrivateKey && this.#walletInput?.length === walletLength){
        __wallet = new ethers.Wallet(this.#walletInput,this.provider);
        
      } /*mnemonic phrase*/else if(splitted.length >= 12) {
        const fromMnemonicWallet =  ethers.Wallet.fromMnemonic(this.#walletInput);
        const __privateKey = fromMnemonicWallet.privateKey;
        __wallet = new ethers.Wallet(__privateKey,this.provider);
        this.#mnemonic = this.#walletInput ;
      }
    }
    /* wallet params will be the wallet*/ else if(this.#walletInput._isSigner === true){
    }
    return __wallet;
 }
  
  
  
  
  // getter for address
  get address(){
    return  this.Wallet.address ;
  }
  
  // getter for private key
  get privateKey(){
    return this.Wallet.privateKey;
  }
  
  // promis => get balance of the wallet
  get balance():Promise<Format>{
    
    return new Promise((resolve,reject) => {
      this.provider.getBalance(this.address).then((bal:any) => {
        resolve(new Format.Wei(bal.toString(), 18))
      })
      
    })
    
  }
  
  // switch account 
  switchAccount(wallet:any){
     this.#walletInput = wallet;
  }
  
  // switch network  
  switchNetwork(providerStringOrProvider:string){
   this.#providerInput = providerStringOrProvider;
  }
  
 // useAs
 useAs(wallet:string|ethers.Wallet){
    return new Wallet(wallet,this.provider);
 }
  
  useAt(provider:string|ethers.providers.JsonRpcProvider|ethers.providers.Web3Provider){
    return new Wallet(this.#walletInput,provider);
 }
  // send 
  // @params amount is an ethers string or an object used to send ethers 
  send(amount:any,to:any,gasLimit?:string){
    return new Promise(async (resolve,reject) => {
      // check balance 
      const balance:any = await this.balance;
      const factory = Format.Factory(this.decimals);
      const tokenAmount = factory(amount);
      const enoughBalance = BigInt(balance.wei) >= BigInt(tokenAmount);
      const isValidAddress = addressValidator(to);
      var tx:any = {}
      
      if(gasLimit){
        tx.gasLimit = gasLimit ;
      } 
      tx.to = to ;
      tx.value = factory(amount);
      // check if address provided is valid;
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
      //sending transaction.... promise
      this.Wallet.sendTransaction(tx).then((result:any) => {
        result.Transaction = new Transaction(tx.value,18);
        resolve(result);
      })
      .catch((err:any) => reject(err))
      return ;
    })
  } 
  
  // estimate gas... 
  estimateGas (amount:any,to:any){
    const factory = Format.Factory(this.decimals);
    const tx = {
      to : to,
      value : factory(amount)
    }
    return new Promise((resolve,reject) => {
      const isValidAddress = addressValidator(to);
      // if Address Provided is not valid 
      if(!isValidAddress){
        reject({msg : "Address Provided is not valid", data : isValidAddress});
        return;
      } 
        this.Wallet.estimateGas(tx).then((res:any) => {
          resolve(new GasFormat.Static(tx,res))
        })
      
    })
  }
  
  // using the ERC20 Wallet
  Token(addr:string){
    return new TokenWallet(this.Wallet,addr);
  }
  
  static get Contract(){
    return Contract;
  }
  
  // Format Format
  static get Format(){
    return Format;
  }
  // from signer 
  static get FromSigner() {
    return FromSigner;
  }
  
  static get Provider(){
    return Provider;
  }
  
  static isValidAddress(address:string){
     return addressValidator(address);
  }
}

/*Documentation 
Wallet is A class that has methods to interact to an ethers Wallet
Wallet {
Wallet: new ether.Walllet; 
provider: JsonRpcProvider
decimals:number;

get address:string = wallet address 
get privateKey:string = private Key 
get balance:Promise<Format> = Formated balance

methods // 

send:Promise<ethers tx> = send tokens 
estimateBeforeSend:Promiss = estemites gas before sending them
estimateGas:Promise<GasFormat> estimating gas 
Token:TokenWallet

}

*/



export default Wallet;
