import { ethers, ContractTransaction } from "ethers";
import Transaction from "./Transaction.js";
import GasFormat from "./TokenGasFormat.js";
import { Walletish, ITransactionConfig, WalletTransactionalNumber } from "./types";
interface TokenSendTransaction extends ContractTransaction {
    Transaction: Transaction;
}
declare class ERCTokenManeger {
    #private;
    getMetadata: any;
    constructor(walletOrProvider: any, address: string);
    get defaultMethods(): {
        address: string;
        allowance: any;
        approve: any;
        balanceOf: any;
        decimals: any;
        name: any;
        symbol: any;
        totalSupply: any;
        getMetadata: () => Promise<{
            name: any;
            symbol: any;
            decimals: any;
            totalSupply: {
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
        }>;
    };
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