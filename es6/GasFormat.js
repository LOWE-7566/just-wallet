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
var _StaticGasFormat_estimatedGas, _GasFormat_Wallet;
import { ethers } from "ethers";
import Transaction from "./Transaction.js";
const BigNumber = ethers.BigNumber;
export class StaticGasFormat {
    constructor(tx, estimatedGas) {
        _StaticGasFormat_estimatedGas.set(this, void 0);
        __classPrivateFieldSet(this, _StaticGasFormat_estimatedGas, estimatedGas, "f");
        this.estimatedGasInEther = ethers.utils.formatEther(__classPrivateFieldGet(this, _StaticGasFormat_estimatedGas, "f").toString()).toString();
        this.estimatedGasInWei = ethers.utils.parseEther(this.estimatedGasInEther).toString();
        this.toSpend = tx.value.toString();
        this.transactionInfo = tx;
        this.totalEthers = ethers.utils.formatEther(this.total.toString());
        this.totalWei = this.total.toString();
    }
    get total() {
        return BigNumber.from(this.estimatedGas).add(this.toSpend).toString();
    }
    get estimatedGas() {
        return __classPrivateFieldGet(this, _StaticGasFormat_estimatedGas, "f");
    }
}
_StaticGasFormat_estimatedGas = new WeakMap();
export class GasFormat extends StaticGasFormat {
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
                res.Transaction = new Transaction(tx.value, 18);
                resolves(res);
            })
                .catch((err) => rejects(err));
        });
    }
    static get Static() {
        return StaticGasFormat;
    }
}
_GasFormat_Wallet = new WeakMap();
export default GasFormat;
