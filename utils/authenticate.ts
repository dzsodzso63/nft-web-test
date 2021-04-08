import { useRecoilCallback } from "recoil";
import { recoverPersonalSignature } from "eth-sig-util";
import { signedMessage } from "../recoil/atoms";
import { getEthereumClient } from "./ethereum";

const MESSAGE_TO_SIGN =
  "Please Sign this signature request to authenticate the tile image upload process";

export const useGetAuthenticatedSignature = (): (() => Promise<string>) => {
  
  const metamask = getEthereumClient();

  return useRecoilCallback(
    ({ snapshot, set }) => async (): Promise<string> => {
      const signedMessageCurrent = await snapshot.getPromise(signedMessage);
      if (metamask == null) {
        console.error("metamask is not defined");
      }
      if (signedMessageCurrent == null) {
        const getSignaturePromise = getAuthenticatedSignature(metamask).catch(
          (error) => {
            console.error("authentication error", error);
            set(signedMessage, null);
          }
        );
        set(signedMessage, getSignaturePromise);
        return getSignaturePromise;
      } else {
        return signedMessageCurrent;
      }
    },
    [metamask]
  );
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
