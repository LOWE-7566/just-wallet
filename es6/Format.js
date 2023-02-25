import { ethers } from "ethers";
import trim from "./trim.js";
const utils = ethers.utils;
const BigNumber = ethers.BigNumber;
class Format {
    constructor(str, decimals) {
        const value = str.replaceAll(/-|,/g, "");
        this.decimals = decimals ? decimals : 18;
        this.inputValue = value || 0;
        this.wei = utils.parseUnits(value, this.decimals).toString();
        this.fixed = trim.removedot(utils.formatUnits(this.wei, this.decimals));
        const maxSplited = this.fixed.split(".");
        const whole = maxSplited[0];
        if (maxSplited.length > 1) {
            const dec = trim(maxSplited[1], 9);
            this.walletReady = `${whole}.${dec}`;
            this.moneyValue = `${whole}.${trim(trim(dec, 2))}`;
            const biglocale = BigInt(whole).toLocaleString();
            this.separated = `${biglocale}.${trim(dec)}`;
            this.moneyValueSeparated = `${biglocale}.${trim(dec, 2)}`;
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
    parseOperationSupport(number) {
        const decimal = this.decimals;
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
}
export default Format;
