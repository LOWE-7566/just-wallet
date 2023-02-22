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
var _Contract_contract;
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const Wallet_js_1 = __importDefault(require("./Wallet.js"));
const ContractDeployer_js_1 = __importDefault(require("./ContractDeployer.js"));
const EthContract = ethers_1.ethers.Contract;
class Contract {
    constructor(address, abi, signer) {
        _Contract_contract.set(this, void 0);
        const contract = new EthContract(address, abi, signer);
        __classPrivateFieldSet(this, _Contract_contract, contract, "f");
        const Keys = Object.keys(contract);
        Keys.forEach((key) => {
            const value = contract[key];
            if (key != "signer") {
                this[key] = value;
            }
        });
        this.interface = contract.interface;
        this.signer = new Wallet_js_1.default(signer.provider || signer, signer.privateKey);
        this.callStatic = contract.callStatic;
        this.estimateGas = contract.estimateGas;
        this.functions = contract.functions;
        this.populate = contract.populateTransaction;
        this.filters = contract.filters;
        this._runningEvents = contract._runningEvents;
        this._wrappedEmits = contract._wrappedEmits;
        this.address = contract.address;
        this.resolvedAddress = contract.resolvedAddress;
        const keys = Object.keys(contract.functions);
        this.call = {};
        for (var i = 0; i < keys.length; i++) {
            const functions = contract.functions;
            const key = keys[i];
            this.call[key] = contract[key];
        }
    }
    static get Deployer() {
        return ContractDeployer_js_1.default;
    }
}
_Contract_contract = new WeakMap();
exports.default = Contract;