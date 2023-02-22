"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _StaticGasFormat_estimatedGas, _GasFormat_Wallet;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasFormat = exports.StaticGasFormat = void 0;
const ethers_1 = require("ethers");
const Transaction_js_1 = __importDefault(require("./Transaction.js"));
const BigNumber = ethers_1.ethers.BigNumber;
class StaticGasFormat {
    constructor(tx, estimatedGas) {
        _StaticGasFormat_estimatedGas.set(this, void 0);
        __classPrivateFieldSet(this, _StaticGasFormat_estimatedGas, estimatedGas, "f");
        this.estimatedGasInEther = ethers_1.ethers.utils.formatEther(__classPrivateFieldGet(this, _StaticGasFormat_estimatedGas, "f").toString()).toString();
        this.estimatedGasInWei = ethers_1.ethers.utils.parseEther(this.estimatedGasInEther).toString();
        this.toSpend = tx.value.toString();
        this.transactionInfo = tx;
        this.totalEthers = ethers_1.ethers.utils.formatEther(this.total.toString());
        this.totalWei = this.total.toString();
    }
    get total() {
        return BigNumber.from(this.estimatedGas).add(this.toSpend).toString();
    }
    get estimatedGas() {
        return __classPrivateFieldGet(this, _StaticGasFormat_estimatedGas, "f");
    }
}
exports.StaticGasFormat = StaticGasFormat;
_StaticGasFormat_estimatedGas = new WeakMap();
class GasFormat extends StaticGasFormat {
    constructor(tx, estimatedGas, wallet) {
        super(tx, estimatedGas);
        _GasFormat_Wallet.set(this, void 0);
        __classPrivateFieldSet(this, _GasFormat_Wallet, wallet, "f");
    }
    send() {
        const tx = this.transactionInfo;
        tx.gasLimit = BigNumber.from(this.estimatedGasInWei);
        const Wallet = __classPrivateFieldGet(this, _GasFormat_Wallet, "f");
        return new Promise((resolves, rejects) => {
            Wallet.sendTransaction(tx).then((res) => {
                res.Transaction = new Transaction_js_1.default(tx.value, 18);
                resolves(res);
            })
                .catch((err) => rejects(err));
        });
    }
    static get Static() {
        return StaticGasFormat;
    }
}
exports.GasFormat = GasFormat;
_GasFormat_Wallet = new WeakMap();
exports.default = GasFormat;
