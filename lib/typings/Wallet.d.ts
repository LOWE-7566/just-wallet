import { ethers } from "ethers";
import Format from "./Format.js";
import FETHProvider from "./Provider.js";
import Contract from "./Contract.js";
import FromSigner from "./fromSigner.js";
import TokenWallet from "./Token.js";
import { WalletTransactionalNumber, Walletish, Providerish, IFormat, ITransactionConfig } from "./types";
import BN from "./utils/BN.js";
export declare class FETHWallet {
    #private;
    mnemonic: any;
    decimals: number;
    _isWallet: boolean;
    constructor(wallet: Walletish, provider: Providerish);
    get provider(): any;
    get Wallet(): any;
    get address(): string;
    get privateKey(): any;
    get balance(): Promise<IFormat>;
    switchAccount(wallet: Walletish): void;
    switchNetwork(providerStringOrProvider: string): void;
    useAs(wallet: Walletish): FETHWallet;
    useAt(provider: string | Providerish): FETHWallet;
    send(amount: WalletTransactionalNumber, to: Walletish, config?: string | ITransactionConfig): Promise<import("./Send.js").SendTransaction>;
    estimateGas(amount: WalletTransactionalNumber, to: Walletish): Promise<import("./GasFormat.js").GasFormat>;
    Token(addr: Contract | ethers.Contract): TokenWallet;
    static get Format(): typeof Format;
    static get FromSigner(): typeof FromSigner;
    static get Provider(): typeof FETHProvider;
    static isValidAddress(address: string): import("./types").isValidAddressInterface;
    get ethers(): typeof ethers;
    static get utils(): {
        BN: typeof BN;
    };
}
export default FETHWallet;
//# sourceMappingURL=Wallet.d.ts.map