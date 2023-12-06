import ContractDeployer from "./ContractDeployer.js";
import { type ContractInterface } from "ethers";
import { type Signer } from "./types";
declare class Contract {
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
    static get Deployer(): typeof ContractDeployer;
}
export default Contract;
//# sourceMappingURL=Contract.d.ts.map