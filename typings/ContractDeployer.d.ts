import { ethers, type ContractInterface } from "ethers";
declare const EthContract: typeof ethers.ContractFactory;
declare class ContractDeployer extends EthContract {
    constructor(abi: string, bin: ContractInterface, signer: any);
    get Deploy(): any;
}
export default ContractDeployer;
//# sourceMappingURL=ContractDeployer.d.ts.map