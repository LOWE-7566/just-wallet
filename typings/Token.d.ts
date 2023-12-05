import { ContractTransaction } from "ethers";
import Transaction from "./Transaction.js";
import GasFormat from "./TokenGasFormat.js";
import { Walletish, ITransactionConfig, WalletTransactionalNumber } from "./types";
interface TokenSendTransaction extends ContractTransaction {
    Transaction: Transaction;
}
export interface Methods {
    allowance: any;
    approve: any;
    balanceOf: any;
    decimals: any;
    name: any;
    symbol: any;
    totalSupply: any;
    getMetadata: any;
    address: string;
}
declare class ERCTokenManeger {
    #private;
    defaultMethods: Methods;
    getMetadata: any;
    constructor(walletOrProvider: any, address: string);
    get metadata(): Promise<unknown>;
    get balance(): Promise<any>;
    useAs(walletOrProvider: any): ERCTokenManeger;
    useAddress(account: Walletish): ERCTokenManeger;
    approve(amount: string | number, to: string): Promise<any>;
    send(amount: WalletTransactionalNumber, to: Walletish, config?: ITransactionConfig): Promise<TokenSendTransaction>;
    estimateGas(amount: WalletTransactionalNumber, to: Walletish): Promise<GasFormat>;
}
export default ERCTokenManeger;
//# sourceMappingURL=Token.d.ts.map