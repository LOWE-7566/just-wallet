import { BigNumber } from "ethers";

function BN(numberAsString:string){
   return BigNumber.from(numberAsString);
}

export default BN;