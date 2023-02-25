"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const JsonRpcProvider = ethers_1.ethers.providers.JsonRpcProvider;
class Provider extends JsonRpcProvider {
    constructor(provider) {
        super(provider);
    }
    get isReady() {
        return new Promise(async (resolve, reject) => {
            const ready = await this.ready;
            if (ready) {
                resolve(true);
                return;
            }
            reject(false);
        });
    }
}
exports.default = Provider;
