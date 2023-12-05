import { WalletTransactionalNumber,Walletish,ITransactionConfig, IWalletish } from "./types";
import Transaction from "./Transaction";
import Format from "./Format";
import addressValidator from "./checkAddress";
import { ArgurmentError, ExecutionError } from "./utils/Error";
import { BigNumber, Transaction as ETHtransaction} from "ethers";
import ToSendAndRecipient from "./utils/ToSendAndRecipient";



export interface SendTransaction extends ETHtransaction{
   Transaction : Transaction
}

async function send(amount:WalletTransactionalNumber,to:Walletish,data:any,config?:string|ITransactionConfig):Promise<SendTransaction>{
   
   const wallet = data.Wallet || data.signer;
   if(!to){
      throw new ArgurmentError("FETHWallet.send",undefined, "to", to,"a ethers wallet address or an onject that has \".address\" property");
   }
   if(!amount){
      throw new ArgurmentError("FETHWallet.send",undefined, "amount", amount,"a number string, ethers.BigNumber or BN, or a Format", );
   }
   return new Promise(async (resolve,reject) => {
      // check balance 
      const balance:any = await data.balance;
      const factory = Format.Factory(data.decimals);
      const tokenAmount = factory(amount);
      const enoughBalance = BigInt(balance.wei) >= BigInt(tokenAmount);
      const { recipient, amountToSend } = ToSendAndRecipient(amount,to);
      const isValidAddress = addressValidator(recipient);
      const address = data.address;
      var tx:ITransactionConfig = {value : "", to : ""}
      
      if(typeof config === "string"){
         tx.gasLimit = config ;
      }
      
      if(typeof config === "object"){
         tx = {...tx, ...config};
      }
      
      tx.to = recipient;
      tx.value = amountToSend; 
      // check if address provided is valid;
      if(!isValidAddress.valid){
         throw new ArgurmentError("FETHWallet.send",isValidAddress, "to", tx.to,"A ethers Wallet, Mnemonic Wallet, PrivateKey, an new ethers.Wallet or new FETHWallet", "Providing A Valid Ptovider");
         return;
      } 
      // if account has enough balance 
      if(!enoughBalance){
         // if transaction exeeds balance
         throw new ExecutionError("FETHWallet.send",{balance : balance.wei, error: `not enough balance`, amount : tx.value }, "Send tokens that is lesser or equal to your  balance ")
      }
      
      //sending transaction.... promise
      wallet.sendTransaction(tx)
      .then(async (result:any) => {
         try {
            const wait = await result.wait()
            wait.Transaction = new Transaction(tx.value|| "",18,address,tx.to);
            resolve(wait);
         } catch(err:any){
            const error =  new ExecutionError("FETHWallet.send", {...err}, "Sendp tokens that is lesser or equal to your tken balance ")
            reject(error);
         }
         
      }).catch((err:any) => {
         const error =  new ExecutionError("FETHWallet.send", {...err}, "Send tokens that is lesser or equal to your tken balance ")
            reject(error);
      })
   })
}

export default send;