import { WalletTransactionalNumber, Walletish, ITransactionConfig } from "./types";
import Transaction from "./Transaction";
import { Transaction as ETHtransaction } from "ethers";
export interface SendTransaction extends ETHtransaction {
    Transaction: Transaction;
}
declare function send(amount: WalletTransactionalNumber, to: Walletish, data: any, config?: string | ITransactionConfig): Promise<SendTransaction>;
export default send;
//# sourceMappingURL=Send.d.ts.map