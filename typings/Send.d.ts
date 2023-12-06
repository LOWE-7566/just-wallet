import { WalletTransactionalNumber, Walletish, ITransactionConfig, Prettify } from "./types";
import Transaction from "./Transaction";
import { Transaction as ETHtransaction } from "ethers";
export interface SendTransaction extends Prettify<ETHtransaction> {
    Transaction: Transaction;
}
declare function send(amount: WalletTransactionalNumber, to: Walletish, data: any, config?: string | ITransactionConfig): Promise<SendTransaction>;
export default send;
//# sourceMappingURL=Send.d.ts.map