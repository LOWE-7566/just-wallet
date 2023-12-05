import { WalletTransactionalNumber, Walletish } from "./types";
import GasFormat from "./GasFormat.js";
declare function estimateGas(amount: WalletTransactionalNumber, to: Walletish, data: any): Promise<GasFormat>;
export default estimateGas;
//# sourceMappingURL=EstimateGas.d.ts.map