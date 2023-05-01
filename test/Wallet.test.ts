import { describe, it, expect} from "vitest";
import Wallet from "./Wallet";
import { ethers } from "ethers";

describe("Test Wallet", async () => {
   const provider = new Wallet.Provider();
   const wallet0 = new ethers.Wallet("0x20f6b3e0228e35d7d75188259a3b468bf4c006602b8c3d2fdd3408409dd52052",provider);
   const wallet1 = new ethers.Wallet("0x75d65b3f43b5a97104270f05d61fb18c767169848d82d59d5e320e47e3f69738",provider);
   it("Wallet Metadatadata", async () => {
      const wallet = new Wallet(wallet0, provider);
      expect(wallet.address).toBe("0xCca5969eF9abE5F281763D547b1255278E72b980");
      expect(wallet.address.length).toBe(42);
      expect(wallet.privateKey).toBe("0x20f6b3e0228e35d7d75188259a3b468bf4c006602b8c3d2fdd3408409dd52052");
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
      wallet.switchAccount("0x75d65b3f43b5a97104270f05d61fb18c767169848d82d59d5e320e47e3f69738");
      expect(wallet.address).toBe(wallet1.address);
      wallet.switchNetwork("http://localhost:8000");
      expect(wallet.provider.connection.url).toBe("http://localhost:8000");
   })
   
   
})

describe("Real Transaction  of Wallet", async () => {
  const provider = new Wallet.Provider();
   const wallet0 = new ethers.Wallet("0x20f6b3e0228e35d7d75188259a3b468bf4c006602b8c3d2fdd3408409dd52052",provider);
   const wallet1 = new ethers.Wallet("0x75d65b3f43b5a97104270f05d61fb18c767169848d82d59d5e320e47e3f69738",provider);
   const wallet = new Wallet(wallet0,provider);
   
   it("Send Ether with generic types ", async () => {
      const transaction =  await wallet.send("0.000-000-0001",wallet1.address);
      console.log(transaction);
   })
   
   it("send Ether with complex types", async () => {
      const sendFormated = await wallet.send(new Wallet.Format("0.000-000-0001"),wallet1);
      console.log(sendFormated);
   })
})

describe("Estimate Gas", async () => {
   const provider = new Wallet.Provider();
   const wallet0 = new ethers.Wallet("0x20f6b3e0228e35d7d75188259a3b468bf4c006602b8c3d2fdd3408409dd52052",provider);
   const wallet1 = new ethers.Wallet("0x75d65b3f43b5a97104270f05d61fb18c767169848d82d59d5e320e47e3f69738",provider);
   const wallet = new Wallet(wallet0,provider);
   it('Estimate Gas using generic types',async () => {
      const gasFee = await wallet.estimateGas("00001",wallet1.address);
      expect(gasFee).toBeDefined();
   })
})