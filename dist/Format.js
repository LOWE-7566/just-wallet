"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const trim_js_1 = __importDefault(require("./trim.js"));
const utils = ethers_1.ethers.utils;
const BigNumber = ethers_1.ethers.BigNumber;
class Format {
    constructor(str, decimals) {
        const value = str.replaceAll(/-|,/g, "");
        this.decimals = decimals ? decimals : 18;
        this.inputValue = value || 0;
        this.assetValue = "0";
        this.wei = utils.parseUnits(value, this.decimals).toString();
        this.fixed = trim_js_1.default.removedot(utils.formatUnits(this.wei, this.decimals));
        const maxSplited = this.fixed.split(".");
        const whole = maxSplited[0];
        if (maxSplited.length > 1) {
            const dec = (0, trim_js_1.default)(maxSplited[1], 9);
            this.walletReady = `${whole}.${dec}`;
            this.moneyValue = `${whole}.${(0, trim_js_1.default)((0, trim_js_1.default)(dec, 2))}`;
            const biglocale = BigInt(whole).toLocaleString();
            this.separated = `${biglocale}.${(0, trim_js_1.default)(dec)}`;
            this.moneyValueSeparated = `${biglocale}.${(0, trim_js_1.default)(dec, 2)}`;
        }
        else {
            this.walletReady = this.fixed;
            this.moneyValue = `${this.fixed}.00`;
            const biglocale = BigInt(whole).toLocaleString();
            this.separated = biglocale;
            this.moneyValueSeparated = `${biglocale}.00`;
        }
    }
    operationSupport() {
        return BigNumber.from(this.wei);
    }
    parseOperationSupport() {
        return BigNumber.from(this.fixed);
    }
    static get Wei() {
        class FormatWie extends Format {
            constructor(value, dec) {
                const parsedValue = value.replaceAll(/-|,/g, "");
                const wei = utils.formatUnits(parsedValue, dec);
                super(wei, dec);
                this.inputValue = value;
            }
        }
        return FormatWie;
    }
    static Factory(dec) {
        function parse(number) {
            number = number.toString().replaceAll(/-|,/g, "");
            return utils.parseUnits(number, dec || 18);
        }
        parse.Format = function (number) {
            const newFactory = new Format(number.toString(), dec || 18);
            newFactory.inputValue = number;
            return newFactory;
        };
        return parse;
    }
    set value(value) {
        this.assetValue = value;
    }
    get value() {
        const __value = new Format(this.assetValue, 2);
        const wei = BigInt(this.wei);
        const __valueWei = BigInt(__value.wei);
        const totalValue = wei * __valueWei;
        const totalValueFormatFixed = new Format.Wei(totalValue.toString(), this.decimals + 2).fixed;
        const totalValueFormat = new Format(totalValueFormatFixed, 2);
        return totalValueFormat;
    }
}
exports.default = Format;
