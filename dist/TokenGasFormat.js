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
var _TokenStaticGasFormat_estimatedGas, _TokenGasFormat_methods;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGasFormat = exports.TokenStaticGasFormat = void 0;
const ethers_1 = require("ethers");
const Transaction_1 = __importDefault(require("./Transaction"));
class TokenStaticGasFormat {
    constructor(tx, estimatedGas, dec) {
        _TokenStaticGasFormat_estimatedGas.set(this, void 0);
        __classPrivateFieldSet(this, _TokenStaticGasFormat_estimatedGas, estimatedGas, "f");
        this.estimatedGasInEther = ethers_1.ethers.utils.formatUnits(this.estimatedGas.toString(), dec).toString();
        this.estimatedGasInWei = ethers_1.ethers.utils.parseUnits(this.estimatedGasInEther, dec).toString();
        this.toSpend = tx.value.toString();
        this.toSpendEtherFormat = ethers_1.ethers.utils.formatUnits(this.toSpend, dec).toString();
        this.transactionInfo = tx;
        this.totalToken = ethers_1.ethers.utils.formatUnits(this.toSpend, dec).toString(),
            this.totalTokenWei = ethers_1.ethers.utils.parseUnits(ethers_1.ethers.utils.formatUnits(this.toSpend, dec).toString()).toString();
        this.totalEthers = ethers_1.ethers.utils.formatEther(this.estimatedGas.toString()).toString();
        this.totalWei = ethers_1.ethers.utils.parseEther(ethers_1.ethers.utils.formatEther(this.estimatedGas.toString()).toString()).toString();
    }
    get total() {
        return `${this.estimatedGas.toString()} ${this.toSpend}`;
    }
    get estimatedGas() {
        return __classPrivateFieldGet(this, _TokenStaticGasFormat_estimatedGas, "f");
    }
}
exports.TokenStaticGasFormat = TokenStaticGasFormat;
_TokenStaticGasFormat_estimatedGas = new WeakMap();
class TokenGasFormat extends TokenStaticGasFormat {
    constructor(tx, contract, estimatedGas, dec) {
        super(tx, estimatedGas, dec);
        _TokenGasFormat_methods.set(this, void 0);
        __classPrivateFieldSet(this, _TokenGasFormat_methods, contract, "f");
    }
    send() {
        const gas = this.estimatedGasInWei;
        const Gas = ethers_1.ethers.BigNumber.from(gas);
        const gasLimit = Gas.toString();
        const transactionInfo = this.transactionInfo;
        const methods = __classPrivateFieldGet(this, _TokenGasFormat_methods, "f");
        if (gas) {
            return new Promise((resolves, rejects) => {
                methods.transfer(transactionInfo.to, transactionInfo === null || transactionInfo === void 0 ? void 0 : transactionInfo.value, { gasLimit: `${gasLimit}` }).then(function (res) {
                    res.Transaction = new Transaction_1.default(transactionInfo.value, 18);
                    resolves(res);
                })
                    .catch(function (err) { rejects(err); });
            });
        }
        else {
            return new Promise((resolves, rejects) => {
                const tx = transactionInfo;
                methods.transfer(tx.to, tx.value).then(function (res) {
                    res.Transaction = new Transaction_1.default(tx.value, 18);
                    resolves(res);
                })
                    .catch(function (err) { rejects(err); });
            });
        }
    }
    static get Static() {
        return TokenStaticGasFormat;
    }
}
exports.TokenGasFormat = TokenGasFormat;
_TokenGasFormat_methods = new WeakMap();
exports.default = TokenGasFormat;