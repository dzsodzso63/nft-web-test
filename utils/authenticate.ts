import { recoverPersonalSignature } from "eth-sig-util";
const MESSAGE_TO_SIGN = "corgi butts drive me nuts";

export const getAuthenticatedSignature = async (metamask: any) => {
  const accountAddress = metamask.selectedAddress;
  const signature = await metamask.send("personal_sign", [
    MESSAGE_TO_SIGN,
    accountAddress, //from which account should be signed. Web3, metamask will sign message by private key inconspicuously.
  ]);
  return signature.result;
};

export const authenticateSignature = (
  accountAddress: string,
  signature: string
) => {
  const recoveredSignature = recoverPersonalSignature({
    data: MESSAGE_TO_SIGN,
    sig: signature,
  });

  return accountAddress === recoveredSignature;
};
