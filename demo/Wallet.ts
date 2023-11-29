import Wallet from "../Wallet";
function should(data:any) {
  if (data == false) {
    throw new Error(data);
  }
}
async function main() {
  const key1 = "0x4694ced5709eb2202071ee6bbce0477507319b96c1e82b387b27b28ebc765666";
  const key2 = "0xf8cd5984daf93e18847b7cd636277c0f200e9b60c4081e680e0cd52572cba9ba";
  const provider = new Wallet.Provider("http://127.0.0.1:8545");
  // wallets 
  const wallets = [
    new Wallet(key1, provider),
    new Wallet(key2, provider)
  ]
  // transfer tokens using generic types
  const amount = "1.0";
  const to = wallets[1].address;
  
}

main();
