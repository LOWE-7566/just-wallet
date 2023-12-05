import { ethers, type ContractInterface, type BytesLike } from "ethers";
declare const EthContract: typeof ethers.ContractFactory;
declare class ContractDeployer extends EthContract {
    constructor(abi: BytesLike | string, bin: ContractInterface | string, signer: any);
    get Deploy(): any;
}
export default ContractDeployer;
//# sourceMappingURL=ContractDeployer.d.ts.map