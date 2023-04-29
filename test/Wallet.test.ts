import {factory} from "./bin";
import Wallet from "./Wallet"
import Format from"./Format";
import {privateKey, privateKey1,address,address1} from "./test-declaration";
import {it,describe,expect} from "vitest";
const Provider = new Wallet.Provider();
// test Wallet ;
const wallet = new Wallet(privateKey,Provider);
const wallet1 = new Wallet(privateKey1,Provider);
const _signer = async () => await Provider.getSigner();
const walletFromSigner = async () => {
  const signer = await _signer();
  const __wallet = new Wallet.FromSigner(signer);
  return __wallet;
}



describe("test if wallet works", async () => {
   
   const signer =  await Provider.getSigner();
   const DToken = await factory(signer);
   const tknAddress = DToken.address;
   
// balance
it("wallet balance ", async () => {
  const balance = await wallet.balance;
  const FormatWei = new Format.Wei(balance.wei, 18)
  console.log(balance);
  expect(balance.fixed).toBe(FormatWei.fixed);
})


// transaction
it("wallet transaction ", async () => {
  const transact = await wallet.send("0.0001",address1);
  console.log(transact);
  expect(transact.Transaction.done).toBe(true);
})
// gas 
it("wallet gas ", async () => {
  const gas = await wallet.estimateGas("1",address1);
  expect(gas).toBe();
})

it('wallet property',() => {
  expect(wallet.address).toBe(address);
  expect(wallet.privateKey).toBe(privateKey)
})


//  rejects 
it("wallet transaction rejected deu to invalid address", async () => {
  wallet.send("0.0001","address1").catch(err => {
    expect(err.msg).toBe("Address Provided is not valid.")})
})
// rejects
it("wallet transaction rejected deu to not enough balance ", async () => {
  wallet.send("100001",address1).catch((rrr) => { console.log(rrr)
  expect(rrr.msg).toBe("Not enough balance to contineu this transaction")})
})

const token = wallet.Token(tknAddress);
const token1 = wallet1.Token(tknAddress);
it("Token is Working", async () => {
  balance = await token.balance;
  
})

it("token metadata",async () => {
  const metadata = await token.metadata;
  console.log(metadata);
  expect(metadata).toBeDefined;
})

it("send token", async () => {
  const transaction = await token.send("0", "0x7C1650D9a62f51c8420A91aF4D939b7568909a07");
  console.log(transaction);
  expect(transaction).toBeDefined();
})

// reject because address is not valid
it("send token reject because address is not valid", async () => {
  token.send("0.0001","address1").catch(err => {
    console.log(err);
    expect(err.msg).toBe("Address Provided is not valid.")}
    )
})

it("send token reject because dont  have any balance", async () => {
    token1.send("100001",address1).catch((rrr) => { console.log(rrr)
  expect(rrr.msg).toBe("Not enough balance to contineu this transaction")})
})
// gas
it("estimateGas token", async () => {
  const gas = await token.estimateGas("0.000000000001", address1);
  console.log(gas);
  expect(gas).toBeDefined();
})
})
