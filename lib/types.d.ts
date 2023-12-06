import { Transaction as Transaction$1, ContractInterface, ethers as ethers$1, Signer as Signer$1, BigNumber, BigNumberish as BigNumberish$1 } from 'ethers';

declare class Format$1 implements IFormat {
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
    constructor(str: string, decimals?: number);
    BN(): any;
    FixedBN(): any;
    toString(): string;
    static get Wei(): {
        new (value: string, _decimals?: number): {
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
            BN(): any;
            FixedBN(): any;
            toString(): string;
            value: any;
        };
        readonly Wei: any;
        Factory(dec: number): {
            (number: any): any;
            Format(number: string | number): Format$1;
        };
    };
    static Factory(dec: number): {
        (number: any): any;
        Format(number: string | number): Format$1;
    };
    set value(value: any);
    get value(): any;
}
//# sourceMappingURL=Format.d.ts.map

declare class Transaction extends Format$1.Wei {
    amount: number | string;
    stringify: string;
    from: string;
    to: string;
    done: boolean;
    constructor(value: WalletTransactionalNumber, decimals: number, from: string, to: string);
}
//# sourceMappingURL=Transaction.d.ts.map

declare class GasFormat extends Format$1.Wei {
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

declare class TokenGasFormat extends GasFormat {
    toSpendEtherFormat: string;
    totalToken: string;
    totalTokenWei: string;
    _estimatedGas: any;
    constructor(tx: ITransactionConfig, estimatedGas: BigNumberish, decimals: number);
}

interface TokenSendTransaction extends Prettify<Transaction> {
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
                BN(): any;
                FixedBN(): any;
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
    estimateGas(amount: WalletTransactionalNumber, to: Walletish): Promise<TokenGasFormat>;
}
//# sourceMappingURL=Token.d.ts.map

interface SendTransaction extends Prettify<Transaction$1> {
    Transaction: Transaction;
}

declare class FromSignerWallet {
    #private;
    decimals: number;
    constructor(signer: any);
    get balance(): Promise<unknown>;
    get signer(): any;
    get address(): Promise<unknown>;
    switchSigner(signer: any): void;
    useAs(signer: any): FromSignerWallet;
    send(amount: WalletTransactionalNumber, to: Walletish, config?: string | ITransactionConfig): Promise<SendTransaction>;
    estimateGas(amount: WalletTransactionalNumber, to: Walletish): Promise<GasFormat>;
    Token(addr: any): ERCTokenManeger;
    static isValidAddress(address: string): isValidAddressInterface;
}

declare const EthContract: typeof ethers$1.ContractFactory;
declare class ContractDeployer$1 extends EthContract {
    constructor(abi: string, bin: ContractInterface, signer: any);
    get Deploy(): any;
}
//# sourceMappingURL=ContractDeployer.d.ts.map

declare class Contract$1 {
    #private;
    interface: any;
    signer: Signer | undefined;
    callStatic: any;
    estimateGas: any;
    functions: any;
    populate: any;
    filters: any;
    _runningEvents: any;
    _wrappedEmits: any;
    address: any;
    resolvedAddress: any;
    call: any;
    constructor(address: string, abi: ContractInterface, signer: any);
    static get Deployer(): typeof ContractDeployer$1;
}
//# sourceMappingURL=Contract.d.ts.map

declare const JsonRpcProvider: typeof ethers$1.providers.JsonRpcProvider;
declare class Provider$2 extends JsonRpcProvider {
    constructor(provider?: string);
    get isReady(): Promise<boolean>;
    Ethers(provider: any): any;
    static get Web3(): typeof ethers$1.providers.Web3Provider;
}
//# sourceMappingURL=Provider.d.ts.map

declare const ETHProvider: typeof ethers$1.providers.Provider;
type WalletTransactionalNumber = string | typeof BigNumber | BigNumberish$1 | BigNumberish | BigInt | Format$1;
type Walletish = IWalletish | Wallet$1 | typeof ethers$1.Wallet | string;
type EthersProvider = typeof ETHProvider;
type Providerish = string | Provider$2 | EthersProvider;
type BigNumberish = BigNumberish$1 | string;
type Wallet$1 = FETHWallet;
type Provider$1 = Provider$2 | EthersProvider;
type Signer = Wallet$1 | typeof Signer$1 | Provider$1;
interface ITransactionConfig {
    to: string;
    nonce?: number;
    gasLimit?: WalletTransactionalNumber;
    maxFeePerGas?: WalletTransactionalNumber;
    maxPriorityFeePerGas?: WalletTransactionalNumber;
    value: string;
}
interface IFormat {
    _isFormat: boolean;
    decimals: number;
    inputValue: string | number;
    wei: string;
    fixed: string;
    walletReady: string;
    moneyValue: string;
    separated: string;
    moneyValueSeparated: string;
    assetValue: string;
    BN(): typeof ethers$1.BigNumber;
    FixedBN(): typeof ethers$1.BigNumber;
    set value(value: any);
    get value(): BigInt;
}
interface IWalletish {
    address: string;
    privateKey: string;
    provider: Provider$1;
}
interface isValidAddressInterface {
    valid: boolean;
    value: string;
    address?: string;
}
declare type Prettify<T> = {
    [K in keyof T]: T[K];
};

declare function BN$1(numberAsString: string): BigNumber;
//# sourceMappingURL=BN.d.ts.map

declare class FETHWallet {
    #private;
    mnemonic: any;
    decimals: number;
    _isWallet: boolean;
    constructor(wallet: IWalletish, provider: Providerish);
    getPrivatekey(candidate: string): string | void;
    validPrivatekey(candidate: string): boolean;
    get provider(): any;
    get Wallet(): any;
    get address(): string;
    get privateKey(): any;
    get balance(): Promise<IFormat>;
    switchAccount(wallet: IWalletish): void;
    switchNetwork(providerStringOrProvider: string): void;
    useAs(wallet: IWalletish): FETHWallet;
    useAt(provider: string | Providerish): FETHWallet;
    send(amount: WalletTransactionalNumber, to: IWalletish, config?: string | ITransactionConfig): Promise<SendTransaction>;
    estimateGas(amount: WalletTransactionalNumber, to: IWalletish): Promise<GasFormat>;
    Token(addr: Contract$1 | ethers$1.Contract): ERCTokenManeger;
    static get Format(): typeof Format$1;
    static get FromSigner(): typeof FromSignerWallet;
    static get Provider(): typeof Provider$2;
    static isValidAddress(address: string): isValidAddressInterface;
    get ethers(): typeof ethers$1;
    static get utils(): {
        BN: typeof BN$1;
    };
}

declare function isValidAddress$1(address: string): isValidAddressInterface;
//# sourceMappingURL=checkAddress.d.ts.map

declare const Wallet: typeof FETHWallet;
declare const Format: typeof Format$1;
declare const BN: typeof BN$1;
declare const ethersUtils: typeof ethers$1.utils;
declare const Provider: typeof Provider$2;
declare const ContractDeployer: typeof ContractDeployer$1;
declare const Contract: typeof Contract$1;
declare const ethers: typeof ethers$1;
declare const isValidAddress: typeof isValidAddress$1;

export { BN, Contract, ContractDeployer, Format, Provider, Wallet, ethers, ethersUtils, isValidAddress };
//# sourceMappingURL=types.d.ts.map
