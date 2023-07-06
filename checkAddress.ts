import { isValidAddressInterface } from "./types"
import { ArgurmentError, ExecutionError } from "./utils/Error.js";

function isValidAddress(address:string):isValidAddressInterface{
   if(typeof address !== 'string'){
      console.log(address);
      throw new ArgurmentError("FETHWallet.addressValidator", undefined , "to", address,"string");
   }
  const addressRegExp:RegExp = /^0x[a-fA-F0-9]{40}$/g;
  const match = address.trim().match(addressRegExp) || "";
  const valid = match && match.length > 0 ? true : false;
  const value = address;
  const validAddress =  match ? match[0] : undefined;
  return {address : validAddress, value,valid}
}

export default isValidAddress;