const Wallet = require( "../dist/Wallet").default;
const Format = require("../dist/Format").default;
const {privateKey, privateKey1,address,address1} = require("./test-declaration");

test("wallet should be undefined not privateKey or Mnemonic", () => {
  const wallet = new Wallet("jfjdidkdkdkdkkdkdld odkdkd ofood");
  expect(wallet.Wallet).toBeUndefined();
  const fromSigner = new Wallet.FromSigner({a : 'LL'});
  expect(fromSigner.signer).toBeUndefined();
})