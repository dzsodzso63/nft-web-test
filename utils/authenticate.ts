import * as React from "react";
import { recoverPersonalSignature } from "eth-sig-util";
const MESSAGE_TO_SIGN =
  "Please Sign this signature request to authenticate the tile image upload process";

// TODO maybe use state management :DDDDDDD
var signedMessage: { current: Promise<string> | null } = { current: null };

export const useGetAuthenticatedSignature = (
  metamask: any
): (() => Promise<string>) => {
  return React.useCallback((): Promise<string> => {
    if (metamask == null) {
      console.error("metamask is not defined");
    }
    console.log("getAuthenticatedSignature", signedMessage.current);
    if (signedMessage.current == null) {
      signedMessage.current = getAuthenticatedSignature(metamask).catch(
        (error) => {
          console.error("authentication error", error);
          signedMessage.current = null;
        }
      );
      return signedMessage.current;
    } else {
      return signedMessage.current;
    }
  }, [metamask]);
};

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
