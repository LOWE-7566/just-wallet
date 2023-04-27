import {it, expect, fail, describe} from "vitest";
import Wallet  from  "./Wallet";
import Format  from "./Format";
import {privateKey, privateKey1,address,address1}  from "./test-declaration";
describe("Wallet address", async () => {
   it("wallet should be undefined not privateKey or Mnemonic", () => {
      const wallet = new Wallet("jfjdidkdkdkdkkdkdld odkdkd ofood");
      console.log(wallet);
      console.log({ provider : wallet.provider});
      expect(wallet.Wallet).toBeUndefined();
      const fromSigner = new Wallet.FromSigner({a : 'LL'});
      expect(fromSigner.signer).toBeUndefined();
      
      
   })
})