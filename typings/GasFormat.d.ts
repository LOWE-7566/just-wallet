import Format from "./Format";
import { ITransactionConfig } from "./types";
import { BigNumberish } from "ethers";
export declare class GasFormat extends Format.Wei {
    _estimatedGas: number | BigNumberish | BigInt;
    estimatedGasInEther: string;
    estimatedGasInWei: string;
    toSpend: string;
    transactionInfo: ITransactionConfig;
    totalEthers: string;
    totalWei: string;
    constructor(tx: ITransactionConfig, estimatedGas: BigNumberish, _decimals?: number);
    get total(): any;
    get estimatedGas(): BigNumberish;
}
export default GasFormat;
//# sourceMappingURL=GasFormat.d.ts.map