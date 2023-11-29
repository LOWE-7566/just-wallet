const ethers = require("ethers");
const Wallet = require("./dist/Wallet").default;
const Provider = new ethers.providers.JsonRpcProvider(" http://127.0.0.1:8545/");
const wallet =  new Wallet("0x0d395330a915e49c9e3810c8ccca2ecd55c103955719310a1f62403874c4e4c9", Provider);
async function main() {
  console.log(wallet)
  console.log(await wallet.balance)
  const transaction = await wallet.send("1", "0x71bE63f3384f5fb98995898A86B02Fb2426c5788");
  console.log(transaction);
}

main()