import { BigNumber } from "ethers";
import Format from "../Format";
import { IWalletish, WalletTransactionalNumber, Walletish } from "../types";

export default function ToSendAndRecipient(amount: WalletTransactionalNumber, to: Walletish, dec?:number) {
  const factory = Format.Factory(dec || 18);
    const recipient = (to as IWalletish).address || to.toString();
    const amountToSend = (amount as Format).wei || (amount as BigNumber)._isBigNumber || typeof amount === "bigint" ? amount.toString() : factory(amount);
  return {recipient, amountToSend}
}