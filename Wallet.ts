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
  Wallet:any;
  provider:any
  decimals:number;
  // Token:any;
  
  
  
  constructor(wallet:any,provider?:any){
    if(wallet === undefined){
      throw new Error("Wallet is Emty");
    }
    this.Wallet = wallet;
    const walletLength = 66 ;
    // provider 
    let __provider:any;
    if(typeof provider === "string"){
      __provider = new Provider(provider || `http://localhost:8545`);
    } else {
      __provider = provider;
    }
    
    this.provider = __provider ;
    this.decimals = 18 ;
    
    // if wallet provided mnemonic key or privateKey
    if(typeof wallet === "string"){
      const isPrivate:any =  wallet.match(privatekeyRegExp);
      const isValidPrivateKey = !!isPrivate;
      const splitted = wallet.trim().split(" ");
      
      // if private key is provided
      if(isValidPrivateKey && wallet?.length === walletLength){
        this.Wallet = new ethers.Wallet(wallet,provider);
        
      } /*mnemonic phrase*/else if(splitted.length >= 12) {
        const fromMnemonicWallet =  ethers.Wallet.fromMnemonic(wallet);
        const __privateKey = fromMnemonicWallet.privateKey;
        this.Wallet = new ethers.Wallet(__privateKey,provider);
        this.#mnemonic = wallet ;
      }
    }
    /* wallet params will be the wallet*/ else if(wallet._isSigner === true){
      this.Wallet = wallet;
    }

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
