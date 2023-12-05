import { WalletTransactionalNumber,Walletish,ITransactionConfig } from "./types";
import addressValidator from "./checkAddress.js";
import GasFormat from "./GasFormat.js";
import Format from "./Format.js";
import { ArgurmentError, ExecutionError } from "./utils/Error.js";
import ToSendAndRecipient from "./utils/ToSendAndRecipient";

/**
 * This Functions calculate the gas of a send transaction 
 * @param amount the amount to be sent 
 * @param to the reciever wallet or address
 * @param data tx configuration 
 * @returns a formated gas estimation 
 */
async function estimateGas (amount:WalletTransactionalNumber,to:Walletish,data:any):Promise<GasFormat>{
   const factory = Format.Factory(data.decimals);
   let tx: ITransactionConfig = { to: "", value: "" };
   const { recipient, amountToSend } = ToSendAndRecipient(amount, to);
   
   tx.to = recipient;
   tx.value = amountToSend;
   const Wallet = data.Wallet || data.signer;
   return new Promise((resolve,reject) => {
      const isValidAddress = addressValidator(tx.to);
      // if Address Provided is not valid 
      if(!isValidAddress){
         throw new ArgurmentError("FETHWallet.estimateGas",isValidAddress, "to", tx.to,"A ethers Wallet, Mnemonic Wallet, PrivateKey, an new ethers.Wallet or new FETHWallet", "Providing A Valid Ptovider");
         
      } 
      Wallet.estimateGas(tx).then((res:any) => {
         resolve(new GasFormat(tx,res))
      }).catch((err:any) => {
         const error =  new ExecutionError("FETHWallet.estimateGas", {...err}, "Send tokens that is lesser or equal to your tken balance ")
         reject(error);
      })
      
   })
}

export default estimateGas;