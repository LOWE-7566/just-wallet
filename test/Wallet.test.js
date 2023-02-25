
const Wallet = require( "../dist/Wallet").default;
const Format = require("../dist/Format").default;



const privateKey = "0x7d9d9d91e81087ab0cc47bc1c25772d09e5faaceba74d40e287ccdd4adb3023b";
const address = "0x7C1650D9a62f51c8420A91aF4D939b7568909a07";
const privateKey1 = "0x2460f3f3339ba7ee8aefee28a98772654f9ee699c5d6153e8196f50342a79156";
const address1 = "0x6196439e2CFD8b605Ad2Cb0904F0D6239655baeD";
const Provider = new Wallet.Provider();
// test Wallet ;
const wallet = new Wallet(privateKey,Provider);
const wallet1 = new Wallet(privateKey1,Provider);
const walletInMnemonic = new Wallet(mnemonicPhrase,Provider);
const _signer = async () => await Provider.getSigner();
const walletFromSigner = async () => {
  const signer = await _signer();
  const __wallet = new Wallet.FromSigner(signer);
  return __wallet;
}

// test("wallet balance ", async () => {
//   const balance = await wallet.balance;
//   const FormatWei = new Format.Wei(balance.wei, 18)
//   console.log(balance);
//   const transact = await wallet.send("1",address1);
//   const gas = await wallet.estimateGas("1",address1);
//   console.log(transact);
//   console.log(gas);
//   expect(transact.Transaction.done).toBe(true);
//   expect(transact.Transaction.done).toBeDefined();
//   expect(wallet.address).toBe(address);
//   expect(wallet.privateKey).toBe(privateKey);
//   expect(balance.fixed).toBe(FormatWei.fixed);
  
  
// })
// balance
test("wallet balance ", async () => {
  const balance = await wallet.balance;
  const FormatWei = new Format.Wei(balance.wei, 18)
  console.log(balance);
  expect(balance.fixed).toBe(FormatWei.fixed);
})
// transaction
test("wallet transaction ", async () => {
  const transact = await wallet.send("1",address1);
  console.log(transact);
  expect(transact.Transaction.done).toBe(true);
  
  
})
// gas 
test("wallet gas ", async () => {
  const gas = await wallet.estimateGas("1",address1);
  expect(gas).toBeDefined();
})

test('wallet property',() => {
  expect(wallet.address).toBe(address);
  expect(wallet.privateKey).toBe(privateKey)
})


 