import { recoverPersonalSignature } from "eth-sig-util";
const MESSAGE_TO_SIGN =
  "Please Sign this signature request to authenticate the tile image upload process";

// TODO maybe use state management :DDDDDDD
var signedMessage: { current: Promise<string> | null } = { current: null };

export const getAuthenticatedSignature = async (metamask: any) => {
  if (signedMessage.current != null) {
    return signedMessage.current;
  }
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
