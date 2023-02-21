"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const Wallet = ethers_1.ethers.Wallet;
const EthContract = ethers_1.ethers.ContractFactory;
class ContractDeployer extends EthContract {
    constructor(abi, bin, signer) {
        super(abi, bin, signer);
    }
    get Deploy() {
        return this.deploy;
    }
}
exports.default = ContractDeployer;
