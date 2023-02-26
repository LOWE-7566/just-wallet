"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _FromSignerWallet_mnemonic;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromSignerWallet = void 0;
const Token_js_1 = __importDefault(require("./Token.js"));
const Format_js_1 = __importDefault(require("./Format.js"));
const GasFormat_js_1 = __importDefault(require("./GasFormat.js"));
const Transaction_js_1 = __importDefault(require("./Transaction.js"));
const checkAddress_1 = __importDefault(require("./checkAddress"));
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`;
const privatekeyRegExp = /^0x[0-9a-fA-F]/g;
class FromSignerWallet {
    constructor(signer) {
        _FromSignerWallet_mnemonic.set(this, void 0);
        if (!signer) {
            throw new Error("Signer is not provided");
        }
        this.signer = signer._isSigner ? signer : undefined;
        this.decimals = 18;
    }
    get balance() {
        return new Promise(async (resolve, reject) => {
            this.signer.getBalance().then((bal) => resolve(new Format_js_1.default.Wei(bal.toString(), 18)));
        });
    }
    get address() {
        return new Promise(async (resolve, reject) => {
            this.signer.getAddress().then((_addr) => resolve(_addr));
        });
    }
    send(amount, to, gasLimit) {
        const factory = Format_js_1.default.Factory(this.decimals);
        return new Promise(async (resolve, reject) => {
            const balance = await this.balance;
            const tokenAmount = factory(amount);
            const enoughBalance = BigInt(balance.wei) >= BigInt(tokenAmount);
            const isValidAddress = (0, checkAddress_1.default)(to);
            var tx = {};
            tx.to = to;
            tx.value = factory(amount);
            if (gasLimit) {
                tx.gasLimit = gasLimit;
            }
            if (!isValidAddress.valid) {
                reject({ msg: "Address Provided is not valid", data: isValidAddress });
                return;
            }
            if (!enoughBalance) {
                reject({ msg: "Not enough balance to contineu this transaction", transaction: tx, balance: balance });
                return;
            }
            this.signer.sendTransaction(tx).then((result) => {
                result.Transaction = new Transaction_js_1.default(tx.value, 18);
                resolve(result);
            })
                .catch((err) => reject(err));
        });
    }
    estimateGas(amount, to) {
        const factory = Format_js_1.default.Factory(this.decimals);
        const isValidAddress = (0, checkAddress_1.default)(to);
        const tx = {
            to: to,
            value: factory(amount)
        };
        return new Promise((resolve, reject) => {
            if (!isValidAddress.valid) {
                reject({ msg: "Address Provided is not valid", data: isValidAddress });
                return;
            }
            this.signer.estimateGas(tx).then((res) => {
                resolve(new GasFormat_js_1.default.Static(tx, res));
            });
        });
    }
    Token(addr) {
        return new Token_js_1.default(this.signer, addr);
    }
}
exports.FromSignerWallet = FromSignerWallet;
_FromSignerWallet_mnemonic = new WeakMap();
exports.default = FromSignerWallet;
