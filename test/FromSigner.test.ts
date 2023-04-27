import {describe ,it, expect,fail} from "vitest";
import  Wallet from "../Wallet"
import Format from "../Format"
import {address,address1} from "./test-declaration"
import {factory} from "./bin";

const Provider = new Wallet.Provider("http://localhost:8545");
describe("use a signer as a wallet", async () => {
   const signer =  await Provider.getSigner();
   const DToken = await factory(signer);
   const tknAddress = DToken.address;
   it("provider is ready",async () => {
      console.log(await Provider.ready)
      expect(Provider).toBeDefined();
      
   })
   // test Wallet ;
   
   const walletFromSigner = async () => {
      const __wallet = new Wallet.FromSigner(signer);
      return __wallet;
   }
   
   it("wallet balance ", async () => {
      const wallet = await walletFromSigner();
      const balance = await wallet.balance;
      const FormatWei = new Format.Wei(balance.wei, 18)
      console.log(balance);
      expect(balance.fixed).toBe(FormatWei.fixed);
   })
   // transaction
   it("wallet transaction ", async () => {
      const wallet = await walletFromSigner();
      const transact = await wallet.send("1",address1);
      console.log(transact);
      expect(transact.Transaction.done).toBe(true);
      
      
   })
   // gas 
   it("wallet gas ", async () => {
      const wallet = await walletFromSigner();
      const gas = await wallet.estimateGas("1",address1);
      expect(gas).toBeDefined();
   })
   
   it('wallet property',async () => {
      const wallet = await walletFromSigner();
      const __address = await wallet.address
      
      expect(wallet.privateKey).toBe(undefined)
      expect(wallet.signer).toBeDefined();
   })
   

   
   
   //  rejects 
   it("wallet transaction rejected deu to invalid address", async () => {
      const wallet = await walletFromSigner();
      wallet.send("0.0001","address1").catch(err => expect(err.msg).toBe("Address Provided is not valid"))
   })
   // rejects
   it("wallet transaction rejected deu to not enough balance ", async () => {
      const wallet = await walletFromSigner();
      wallet.send("100001",address1).catch((rrr) => expect(rrr.msg).toBe("Not enough balance to contineu this transaction"))
   })
})