import Link from "next/link";
import { useState, useEffect } from "react";

export default function IndexPage() {
  const [account, setAccount] = useState();
  const [metamask, setMetamask] = useState();

  useEffect(() => {
    if (!metamask && (typeof window !== "undefined")) {
      setMetamask(window.ethereum);
    }
    if (metamask && metamask.selectedAddress) {
      setAccount(metamask.selectedAddress);
    }
  }, [metamask]);

  return (
    <div>
      <Link href="/about">About</Link>

      <h2>Hello köcsögök</h2>

      {metamask && (
        <>
          <p>Metamask installed.</p>
          <p>Network version: {metamask.networkVersion}</p>
          <p>ETH Address: {account}</p>
          <p>
            {!account && (
              <button
                className="enableEthereumButton"
                onClick={() => {
                  metamask.request({
                    method: "eth_requestAccounts"
                  }).then((addresses) => addresses && setAccount(addresses[0]));
                }}
              >
                Enable Ethereum
              </button>
            )}
          </p>
        </>
      )}

      {!metamask && <p>Please install MetaMask!</p>}
    </div>
  );
}
