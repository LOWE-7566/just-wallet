import TokenWallet from "./Token.js";
import GasFormat from "./GasFormat.js";
import { Walletish, WalletTransactionalNumber, ITransactionConfig } from "./types";
export declare class FromSignerWallet {
    #private;
    decimals: number;
    constructor(signer: any);
    get balance(): Promise<unknown>;
    get signer(): any;
    get address(): Promise<unknown>;
    switchSigner(signer: any): void;
    useAs(signer: any): FromSignerWallet;
    send(amount: WalletTransactionalNumber, to: Walletish, config?: string | ITransactionConfig): Promise<import("./Send").SendTransaction>;
    estimateGas(amount: WalletTransactionalNumber, to: Walletish): Promise<GasFormat>;
    Token(addr: any): TokenWallet;
    static isValidAddress(address: string): import("./types").isValidAddressInterface;
}
export default FromSignerWallet;
//# sourceMappingURL=fromSigner.d.ts.map