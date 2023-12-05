import { WalletTransactionalNumber } from "./types";
import Format from "./Format";
declare class Transaction extends Format.Wei {
    amount: number | string;
    stringify: string;
    from: string;
    to: string;
    done: boolean;
    constructor(value: WalletTransactionalNumber, decimals: number, from: string, to: string);
}
export default Transaction;
//# sourceMappingURL=Transaction.d.ts.map