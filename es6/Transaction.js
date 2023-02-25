import { ethers } from "ethers";
class Transaction {
    constructor(value, dec) {
        this.amount = value;
        this.stringify = value.toString();
        this.eth = ethers.utils.formatUnits(value, dec).toString();
        this.wei = ethers.utils.parseUnits(this.eth, dec).toString();
        this.decimals = dec;
    }
}
export default Transaction;
