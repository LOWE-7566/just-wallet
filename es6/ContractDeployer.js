import { ethers } from "ethers";
const Wallet = ethers.Wallet;
const EthContract = ethers.ContractFactory;
class ContractDeployer extends EthContract {
    constructor(abi, bin, signer) {
        super(abi, bin, signer);
    }
    get Deploy() {
        return this.deploy;
    }
}
export default ContractDeployer;
