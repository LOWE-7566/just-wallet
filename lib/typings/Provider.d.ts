import { ethers } from "ethers";
declare const JsonRpcProvider: typeof ethers.providers.JsonRpcProvider;
declare class Provider extends JsonRpcProvider {
    constructor(provider?: string);
    get isReady(): Promise<boolean>;
    Ethers(provider: any): any;
    static get Browser(): typeof ethers.providers.Web3Provider;
}
export default Provider;
//# sourceMappingURL=Provider.d.ts.map