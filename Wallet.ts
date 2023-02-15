import{ ethers}  from "ethers";
import TokenWallet from "./Token.js";
import Format  from "./Format.js";
import GasFormat from "./GasFormat.js";
import Transaction from "./Transaction.js";
import Provider from "./Provider.js";
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`


const _private =  /^0x/g;
  class Wallet {
    #mnemonic:any;
<<<<<<< HEAD
    #Wallet:any;
=======
    Wallet:any;
>>>>>>> d3720c8 (7:42)
    provider:any
    decimals:number;
    // Token:any;
    Tokens:any;
    
    
    
<<<<<<< HEAD
    constructor(wallet:any,provider:string){
      if(!wallet){
=======
    constructor(wallet:any,provider:any){
      if(wallet === undefined){
        console.log(wallet);
>>>>>>> d3720c8 (7:42)
        throw new Error("Wallet is Emty");
      }
     this.Wallet = wallet;
      const walletLength = 66 ;
      // provider 
        provider = new Provider(provider || `http://localhost:8545`);
      // const contract = new ethers.Contract(abi,contract,thisWallet || provider);
      this.provider = provider ;
      this.decimals = 18 ;
      this.Tokens = [];
      if(typeof wallet === "string"){
        const isPrivate:any =  wallet.match(_private);
        if(isPrivate?.length > 0 && wallet?.length === walletLength){
          this.Wallet = new ethers.Wallet(wallet,provider);
        } else {
          console.log('mnimonic');
          this.Wallet = ethers.Wallet.fromMnemonic(wallet);
          this.#mnemonic = wallet ;
        }
      } else {
        this.Wallet = wallet ;
        console.log("exact");
      }
    }
    
    
    get address(){
      return  this.Wallet.address ;
    }
    
    get #prvateKey(){
      return this.Wallet.privateKey;
    }
     get balance(){
      return new Promise((resolve,reject) => {
        this.provider.getBalance(this.address).then((bal:any) => {
          resolve(new Format.Wei(bal.toString(), 18))
        })
        
      })
      
    } // working;
    // send 
     send(amount:any,to:any){
    return new Promise((resolve,reject) => {
      
      const factory = Format.Factory(this.decimals);
      var tx:any = {
        
      }
      if(typeof amount === "object"){
        amount.amount = factory(amount);
        tx.to = amount.to ;
      } else {
        tx.to = to ;
        tx.value = factory(amount) ;
      }
      
      
      this.Wallet.sendTransaction(tx).then((result:any) => {
        result.Transaction = new Transaction(tx.value,18);
        resolve(result);
      })
        .catch((err:any) => reject(err))
    })
    } // working
    // estimateGas before sending a transaction 
    estimateBeforeSend(amount:any,to:any){
      const wallet = this.Wallet ;
      return new Promise((resolve,reject) => {
        const factory = Format.Factory(18);
        const tx = {
          to : to,
          value : factory(amount)
        }
        this.Wallet.estimateGas(tx).then((c:any) => {
          const estimatedGas = new Promise((resolve1,reject1) => {
          resolve1(new GasFormat(tx,c,wallet));
          });
          resolve(estimatedGas)
        })
      })
    } // pending 
    // gas estimation methods 
    estimateGas (amount:any,to:any){
      const factory = Format.Factory(this.decimals);
        const tx = {
          to : to,
          value : factory(amount)
        }
        return new Promise((resolve,reject) => {
          this.Wallet.estimateGas(tx).then((res:any) => {
            resolve(new GasFormat.Static(tx,res))
          })
        })
    }
    Token(addr:string){
      return new TokenWallet(this.provider,this.Wallet,addr);
    }
    // add Tokens 
    async addToken(addr:string) {
      const Token = this.Token(addr);
      this.Tokens.push(Token);
    }
    static get Format(){
      return Format;
    }
   }



export default Wallet;


