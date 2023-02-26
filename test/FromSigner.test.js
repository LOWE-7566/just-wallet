
const Wallet = require( "../dist/Wallet").default;
const Format = require("../dist/Format").default;
const {address,address1} = require("./test-declaration");



const Provider = new Wallet.Provider("http://localhost:8545");
test("provider is ready",async () => {
  console.log(await Provider.ready)
  expect(Provider).toBeDefined();
  
})
// test Wallet ;
const _signer = async () => await Provider.getSigner();
const walletFromSigner = async () => {
  const signer = await _signer();
  const __wallet = new Wallet.FromSigner(signer);
  return __wallet;
}

test("wallet balance ", async () => {
  const wallet = await walletFromSigner();
  const balance = await wallet.balance;
  const FormatWei = new Format.Wei(balance.wei, 18)
  console.log(balance);
  expect(balance.fixed).toBe(FormatWei.fixed);
})
// transaction
test("wallet transaction ", async () => {
  const wallet = await walletFromSigner();
  const transact = await wallet.send("1",address1);
  console.log(transact);
  expect(transact.Transaction.done).toBe(true);


})
// gas 
test("wallet gas ", async () => {
  const wallet = await walletFromSigner();
  const gas = await wallet.estimateGas("1",address1);
  expect(gas).toBeDefined();
})

test('wallet property',async () => {
  const wallet = await walletFromSigner();
  const __address = await wallet.address
  expect(__address).toBe(address);
  expect(wallet.privateKey).toBe(undefined)
  expect(wallet.signer).toBeDefined();
})

var tknAddress = "0xb5022316Ee8725c06900dDB16033433c8620e0B9"

test("Token is Working", async () => {
  const wallet = await walletFromSigner();
  const token = wallet.Token(tknAddress);
  balance = await token.balance;
  console.log(balance);
})

test("token metadata",async () => {
  const wallet = await walletFromSigner();
  const token = wallet.Token(tknAddress);
  const metadata = await token.metadata;
  console.log(metadata);
  expect(metadata).toBeDefined;
})

test("send token", async () => {
  const wallet = await walletFromSigner();
  const token = wallet.Token(tknAddress);
  const transaction = await token.send("0.0001", address1);
  console.log(transaction);
  expect(transaction).toBeDefined();
})
// gas
test("estimateGas token", async () => {
  const wallet = await walletFromSigner();
  const token = wallet.Token(tknAddress);
  const gas = await token.estimateGas("0.0001", address1);
  console.log(gas);
  expect(gas).toBeDefined();
})


// all thst should reject;

// reject because address is not valid
test("send token reject because address is not valid", async () => {
  const wallet = await walletFromSigner();
  const token = wallet.Token(tknAddress);
  token.send("0.0001","address1").catch(err => {
    expect(err.msg).toBe("Address Provided is not valid")}
    )
})

test("send token reject because dont  have any balance", async () => {
  const wallet = await walletFromSigner();
  const token = wallet.Token(tknAddress);
    token.send("9999999099990999999909999099999990999909999999099990",address1).catch((rrr) => expect(rrr.msg).toBe("Not enough balance to contineu this transaction"))
})


//  rejects 
test("wallet transaction rejected deu to invalid address", async () => {
  const wallet = await walletFromSigner();
  wallet.send("0.0001","address1").catch(err => expect(err.msg).toBe("Address Provided is not valid"))
})
// rejects
test("wallet transaction rejected deu to not enough balance ", async () => {
  const wallet = await walletFromSigner();
  wallet.send("100001",address1).catch((rrr) => expect(rrr.msg).toBe("Not enough balance to contineu this transaction"))
})
