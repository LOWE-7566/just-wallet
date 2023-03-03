"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Wallet_mnemonic;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const ethers_1 = require("ethers");
const Token_js_1 = __importDefault(require("./Token.js"));
const Format_js_1 = __importDefault(require("./Format.js"));
const GasFormat_js_1 = __importDefault(require("./GasFormat.js"));
const Transaction_js_1 = __importDefault(require("./Transaction.js"));
const Provider_js_1 = __importDefault(require("./Provider.js"));
const Contract_js_1 = __importDefault(require("./Contract.js"));
const fromSigner_1 = __importDefault(require("./fromSigner"));
const checkAddress_1 = __importDefault(require("./checkAddress"));
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`;
const privatekeyRegExp = /^0x[0-9a-fA-F]/g;
class Wallet {
    constructor(wallet, provider) {
        _Wallet_mnemonic.set(this, void 0);
        if (wallet === undefined) {
            throw new Error("Wallet is Emty");
        }
        this.Wallet = wallet;
        const walletLength = 66;
        let __provider;
        if (typeof provider === "string") {
            __provider = new Provider_js_1.default(provider || `http://localhost:8545`);
        }
        else {
            __provider = provider;
        }
        this.provider = __provider;
        this.decimals = 18;
        if (typeof wallet === "string") {
            const isPrivate = wallet.match(privatekeyRegExp);
            const isValidPrivateKey = !!isPrivate;
            const splitted = wallet.trim().split(" ");
            if (isValidPrivateKey && (wallet === null || wallet === void 0 ? void 0 : wallet.length) === walletLength) {
                this.Wallet = new ethers_1.ethers.Wallet(wallet, provider);
            }
            else if (splitted.length >= 12) {
                const fromMnemonicWallet = ethers_1.ethers.Wallet.fromMnemonic(wallet);
                const __privateKey = fromMnemonicWallet.privateKey;
                this.Wallet = new ethers_1.ethers.Wallet(__privateKey, provider);
                __classPrivateFieldSet(this, _Wallet_mnemonic, wallet, "f");
            }
        }
        else if (wallet._isSigner === true) {
            this.Wallet = wallet;
        }
    }
    get address() {
        return this.Wallet.address;
    }
    get privateKey() {
        return this.Wallet.privateKey;
    }
    get balance() {
        return new Promise((resolve, reject) => {
            this.provider.getBalance(this.address).then((bal) => {
                resolve(new Format_js_1.default.Wei(bal.toString(), 18));
            });
        });
    }
    send(amount, to, gasLimit) {
        return new Promise(async (resolve, reject) => {
            const balance = await this.balance;
            const factory = Format_js_1.default.Factory(this.decimals);
            const tokenAmount = factory(amount);
            const enoughBalance = BigInt(balance.wei) >= BigInt(tokenAmount);
            const isValidAddress = (0, checkAddress_1.default)(to);
            var tx = {};
            if (gasLimit) {
                tx.gasLimit = gasLimit;
            }
            tx.to = to;
            tx.value = factory(amount);
            if (!isValidAddress.valid) {
                reject({ msg: "Address Provided is not valid", data: isValidAddress });
                return;
            }
            if (!enoughBalance) {
                reject({ msg: "Not enough balance to contineu this transaction", transaction: tx, balance: balance });
                return;
            }
            this.Wallet.sendTransaction(tx).then((result) => {
                result.Transaction = new Transaction_js_1.default(tx.value, 18);
                resolve(result);
            })
                .catch((err) => reject(err));
            return;
        });
    }
    estimateGas(amount, to) {
        const factory = Format_js_1.default.Factory(this.decimals);
        const tx = {
            to: to,
            value: factory(amount)
        };
        return new Promise((resolve, reject) => {
            const isValidAddress = (0, checkAddress_1.default)(to);
            if (!isValidAddress) {
                reject({ msg: "Address Provided is not valid", data: isValidAddress });
                return;
            }
            this.Wallet.estimateGas(tx).then((res) => {
                resolve(new GasFormat_js_1.default.Static(tx, res));
            });
        });
    }
    Token(addr) {
        return new Token_js_1.default(this.Wallet, addr);
    }
    static get Contract() {
        return Contract_js_1.default;
    }
    static get Format() {
        return Format_js_1.default;
    }
    static get FromSigner() {
        return fromSigner_1.default;
    }
    static get Provider() {
        return Provider_js_1.default;
    }
}
exports.Wallet = Wallet;
_Wallet_mnemonic = new WeakMap();
module.exports = Wallet;
