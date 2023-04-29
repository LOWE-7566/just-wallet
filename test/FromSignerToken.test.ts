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
      expect(Provider).toBeDefined();
      
   })
   // test Wallet ;
   
   const walletFromSigner = async () => {
      const __wallet = new Wallet.FromSigner(signer);
      return __wallet;
   }
   

   
   it("token metadata",async () => {
      const wallet = await walletFromSigner();
      const token = wallet.Token(tknAddress);
      const metadata = await token.metadata;
      expect(metadata).toBeDefined();
   })
   
   it("send token", async () => {
      const wallet = await walletFromSigner();
      const token = wallet.Token(tknAddress);
      const transaction = await token.send("0.0001", address1);
      expect(transaction).toBeDefined();
   })
   // gas
   it("estimateGas token", async () => {
      const wallet = await walletFromSigner();
      const token = wallet.Token(tknAddress);
      const gas = await token.estimateGas("0.0001", address1);
      expect(gas).toBeDefined();
   })
   
   
   // all thst should reject;
   
   // reject because address is not valid
   it("send token reject because address is not valid", async () => {
      const wallet = await walletFromSigner();
      const token = wallet.Token(tknAddress);
      token.send("0.0001","address1").then(() => fail("this should fail")).catch(err => {
         expect(err.msg).toBe("Address Provided is not valid")}
         )
   })
   
   it("send token reject because dont  have any balance", async () => {
      const wallet = await walletFromSigner();
      const token = wallet.Token(tknAddress);
      token.send("9999999099990999999909999099999990999909999999999999999999999999999099990",address1).then(() => fail('this should fail')).catch((rrr) => expect(rrr.msg).toBe("Not enoughs balance to contineu this transaction"))
   })
   
})