"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class Transaction {
    constructor(value, dec) {
        this.amount = value;
        this.stringify = value.toString();
        this.eth = ethers_1.ethers.utils.formatUnits(value, dec).toString();
        this.wei = ethers_1.ethers.utils.parseUnits(this.eth, dec).toString();
        this.decimals = dec;
        this.done = true;
    }
}
exports.default = Transaction;
