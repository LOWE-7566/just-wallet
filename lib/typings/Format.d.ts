import { ethers } from "ethers";
import { IFormat } from "./types";
declare class Format implements IFormat {
    _isFormat: boolean;
    inputValue: string | number;
    wei: string;
    fixed: string;
    walletReady: string;
    moneyValue: string;
    separated: string;
    moneyValueSeparated: string;
    assetValue: string;
    decimals: number;
    constructor(str: string, decimals?: number);
    BN(): ethers.BigNumber;
    FixedBN(): ethers.BigNumber;
    toString(): string;
    static get Wei(): {
        new (value: string, _decimals?: number): {
            _isFormat: boolean;
            inputValue: string | number;
            wei: string;
            fixed: string;
            walletReady: string;
            moneyValue: string;
            separated: string;
            moneyValueSeparated: string;
            assetValue: string;
            decimals: number;
            BN(): ethers.BigNumber;
            FixedBN(): ethers.BigNumber;
            toString(): string;
            value: any;
        };
        readonly Wei: any;
        Factory(dec: number): {
            (number: any): any;
            Format(number: string | number): Format;
        };
    };
    static Factory(dec: number): {
        (number: any): any;
        Format(number: string | number): Format;
    };
    set value(value: any);
    get value(): any;
}
export default Format;
//# sourceMappingURL=Format.d.ts.map