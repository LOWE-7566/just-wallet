import { describe, it, expect} from "vitest";
import  Wallet from "../Wallet";
import { ethers } from "ethers";
import {abi, bin} from "./tokenBin";

const provider = new Wallet.Provider("http://127.0.0.1:8545");

const wallet0 = new ethers.Wallet("0x4694ced5709eb2202071ee6bbce0477507319b96c1e82b387b27b28ebc765666",provider);
const wallet1 = new ethers.Wallet("0xf8cd5984daf93e18847b7cd636277c0f200e9b60c4081e680e0cd52572cba9ba",provider);
const wallet = new Wallet(wallet0,provider);

describe("Test Wallet", async () => {
   
   it("Wallet Metadatadata", async () => {
      expect(wallet.address).toBe("0x674cA9774d1e59B6c1BbE8AE6E3c3c4e15058c7F");
      expect(wallet.address.length).toBe(42);
      expect(wallet.privateKey).toBe("0x4694ced5709eb2202071ee6bbce0477507319b96c1e82b387b27b28ebc765666");
      expect(wallet.privateKey.length).toBe(66);
   })
   
   it("Test Wallet UseAs and useAt", () => {
      const walletOriginal = new Wallet(wallet0, provider);
      // new Wallet 
      const newWallet = walletOriginal.useAs(wallet1)
      const sameWalletNewProvider = walletOriginal.useAt("http://localhost:8000");
      // expect wallet to be not equal
      expect(newWallet.privateKey).not.toBe(walletOriginal.privateKey);
      // expect sameWalletNewProvider to have deferent Provider 
      expect(sameWalletNewProvider.provider.connection.url).toBe("http://localhost:8000");
   })
   
   it("Change Wallet and Provider", () => {
      const wallet = new Wallet(wallet0, provider);
      // make a copy of the original
      const original = wallet;
      // switch account
      wallet.switchAccount("0xf8cd5984daf93e18847b7cd636277c0f200e9b60c4081e680e0cd52572cba9ba");
      expect(wallet.address).toBe(wallet1.address);
      wallet.switchNetwork("http://localhost:8000");
      expect(wallet.provider.connection.url).toBe("http://localhost:8000");
   })
   
   
})



describe("Real Transaction  of Wallet", async () => {
   const provider = new Wallet.Provider();
   const amountFormat = new Wallet.Format("0.000-000-0001");
   it("Send Ether with generic types ", async () => {
      const transaction =  await wallet.send("0.000-000-0001",wallet1.address);
     expect(transaction.Transaction.amount).toBe(amountFormat.wei);
     expect(transaction.Transaction.done).toBe(true);
   })
   
   it("send Ether with complex types", async () => {
      const transaction = await wallet.send(new Wallet.Format("0.000-000-0001"),wallet1);
     expect(transaction.Transaction.amount).toBe(amountFormat.wei);
     expect(transaction.Transaction.done).toBe(true);
   })
   
   it("send Ether using BigNumber", async () => {
      const amountFormat = new Wallet.Format.Wei("1000000");
      const transaction = await wallet.send(ethers.BigNumber.from('1000000'),wallet1);
      expect(transaction.Transaction.amount).toBe(amountFormat.wei);
     expect(transaction.Transaction.done).toBe(true);
   })
})

describe("Estimate Gas", async () => {
   const provider = new Wallet.Provider();
   
   it('Estimate Gas using generic types',async () => {
      const gasFee = await wallet.estimateGas("0.0001",wallet1.address);
      const estimatedGas =  gasFee.estimatedGas;
      const toSpend = gasFee.toSpend;
      
      const total = Wallet.utils.BN(toSpend).add(estimatedGas).toString();
      expect(total).toBe(gasFee.totalWei);
   })
   
   it("test estimate gas using complex types", async () => {
      const gasFee = await wallet.estimateGas(new Wallet.Format("0.000-000-0001"),wallet1);
      const estimatedGas =  gasFee.estimatedGas;
      const toSpend = gasFee.toSpend;
      
      const total = Wallet.utils.BN(toSpend).add(estimatedGas).toString();
      expect(total).toBe(gasFee.totalWei);
   })
   
   it("test estimate gas using BigNumber", async () => {
      const gasFee = await wallet.estimateGas(Wallet.utils.BN("1000000"),wallet1);
      const estimatedGas =  gasFee.estimatedGas;
      const toSpend = gasFee.toSpend;
      
      const total = Wallet.utils.BN(toSpend).add(estimatedGas).toString();
      expect(total).toBe(gasFee.totalWei);
   })
   
})


describe("Transfer Token", async () => {
   const tokenFactory = new ethers.ContractFactory(abi,bin,wallet0);
   const _token = await tokenFactory.deploy();
   const token = wallet.Token(_token);
   
   
   // send token 
   it("send token using generic types", async () => {
      const amountFormat = new Wallet.Format("0.000-000-0001");
      const transferToken = await token.send("0.000-000-0001", wallet1.address);
      // expect the amount to transfer is 0.0000000001
      expect(transferToken.Transaction.amount).toBe(amountFormat.wei);
      // expect transaction value is 0.0000000001
      expect(transferToken.Transaction.done).toBe(true);
   })
   // uaing complex type
   it("send token using complex types", async () => {
      const amountFormat = new Wallet.Format("0.000-000-0001");
      const transferToken = await token.send(new Wallet.Format("0.000-000-0001"), wallet1);
      // expect the amount to transfer is 0.0000000001
      expect(transferToken.Transaction.amount).toBe(amountFormat.wei);
      // expect transaction value is 0.0000000001
      expect(transferToken.Transaction.done).toBe(true);
   })
   // using BigNumber
   it("send token using complex types with BigNumber", async () => {
      const amountFormat = new Wallet.Format.Wei('100000000');
      const transferToken = await token.send(ethers.BigNumber.from("100000000"), wallet1.address);
      // expect the amount to transfer is 0.0000000001
      expect(transferToken.Transaction.amount).toBe(amountFormat.wei);
      // expect transaction value is 0.0000000001
      expect(transferToken.Transaction.done).toBe(true);
   })
   
   it('Estimate Token Gas using generic types',async () => {
      const gasFee = await token.estimateGas("0.0001",wallet1.address);
      const estimatedGas =  gasFee.estimatedGas;
      const toSpend = gasFee.toSpend;
      const total = Wallet.utils.BN(toSpend).add(estimatedGas).toString();
      expect(total).toBe(gasFee.totalWei);
   })
   
});