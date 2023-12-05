import GasFormat from "./GasFormat";
import { ITransactionConfig, BigNumberish } from "./types";
export declare class TokenGasFormat extends GasFormat {
    toSpendEtherFormat: string;
    totalToken: string;
    totalTokenWei: string;
    _estimatedGas: any;
    constructor(tx: ITransactionConfig, estimatedGas: BigNumberish, decimals: number);
}
export default TokenGasFormat;
//# sourceMappingURL=TokenGasFormat.d.ts.map