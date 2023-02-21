"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wallet_1 = __importDefault(require("./Wallet"));
const __mnemonic = "0x0c60e2298cdc4eacadaf0a70cac44512695cd9262fd753652f64035b96d99034";
const __address = "0x0c60e2298cdc4eacadaf0a70cac44512695cd9262fd753652f64035b96d99034";
const wallet = new Wallet_1.default(__address);
wallet.balance.then(console.log);
