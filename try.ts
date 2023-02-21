import Wallet from "./Wallet"; 
// const __address = "";
const __mnemonic = "0x0c60e2298cdc4eacadaf0a70cac44512695cd9262fd753652f64035b96d99034";
const __address = "0x0c60e2298cdc4eacadaf0a70cac44512695cd9262fd753652f64035b96d99034";

const wallet =  new Wallet(__address);
wallet.balance.then(console.log)
// wallet.send(1.19999389393,"0x47a65e402fDA2CCB59A123fA51Ee6289D432443b").then(console.log)
