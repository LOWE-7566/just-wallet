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
var _ERCTokenManeger_wallet, _ERCTokenManeger_contract;
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const Format_js_1 = __importDefault(require("./Format.js"));
const Transaction_js_1 = __importDefault(require("./Transaction.js"));
const TokenGasFormat_js_1 = __importDefault(require("./TokenGasFormat.js"));
const abi = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`;
class ERCTokenManeger {
    constructor(provider, wallet, address) {
        _ERCTokenManeger_wallet.set(this, void 0);
        _ERCTokenManeger_contract.set(this, void 0);
        __classPrivateFieldSet(this, _ERCTokenManeger_wallet, new ethers_1.ethers.Wallet(wallet.privateKey, provider), "f");
        __classPrivateFieldSet(this, _ERCTokenManeger_contract, new ethers_1.ethers.Contract(address, abi, __classPrivateFieldGet(this, _ERCTokenManeger_wallet, "f") || provider), "f");
        this.defaultMethods = {
            address: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").address,
            allowance: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").allowance,
            approve: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").approve,
            balanceOf: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").balanceOf,
            decimals: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals,
            name: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").name,
            symbol: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").symbol,
            totalSupply: __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").totalSupply,
            getMetadata: async () => {
                const name = await __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").name();
                const symbol = await __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").symbol();
                const decimals = await __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals();
                const totalSupply = await __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").totalSupply();
                return { name, symbol, decimals, totalSupply };
            }
        };
    }
    get address() {
        return __classPrivateFieldGet(this, _ERCTokenManeger_wallet, "f").address;
    }
    get metadata() {
        return new Promise((resolve, reject) => {
            this.getMetadata().then((data) => {
                resolve(data);
            });
        });
    }
    get balance() {
        const address = __classPrivateFieldGet(this, _ERCTokenManeger_wallet, "f").address;
        const decimals = this.defaultMethods.decimals;
        const balanceOf = this.defaultMethods.balanceOf;
        return new Promise((resolve, reject) => {
            try {
                decimals().then((decimal) => {
                    balanceOf(address).then((bal) => resolve(new Format_js_1.default.Wei(bal.toString(), decimal.toString())));
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    async send(amount, to) {
        const decimals = await __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals();
        const factory = Format_js_1.default.Factory(parseInt(decimals));
        var tx = {};
        if (typeof amount === "object") {
            const config = amount;
            amount = factory(config.amount);
            to = config.to;
        }
        else {
            to = to;
            amount = factory(amount);
        }
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").transfer(to, amount).then((c) => {
                const Transaction = new Transaction_js_1.default(amount, decimals);
                resolve(Object.assign(Object.assign({}, c), { Transaction: Transaction }));
            }).catch((err) => reject(err));
        });
    }
    async estimateGas(amount, to) {
        const decimals = await __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals();
        const factory = Format_js_1.default.Factory(parseInt(decimals));
        const tx = {
            to: to,
            value: factory(amount)
        };
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").estimateGas.transfer(tx.to, tx.value)
                .then((res) => {
                resolve(new TokenGasFormat_js_1.default.Static(tx, res, decimals));
            });
        });
    }
    async estimateBeforeSend(amount, to) {
        const decimals = await __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").decimals();
        const factory = Format_js_1.default.Factory(parseInt(decimals));
        const tx = {
            to: to,
            value: factory(amount)
        };
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _ERCTokenManeger_contract, "f").estimateGas.transfer(tx.to, tx.value)
                .then((res) => {
                resolve(new TokenGasFormat_js_1.default(tx, this.defaultMethods, res, decimals));
            });
        });
    }
}
_ERCTokenManeger_wallet = new WeakMap(), _ERCTokenManeger_contract = new WeakMap();
exports.default = ERCTokenManeger;
