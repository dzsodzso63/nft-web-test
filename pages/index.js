import Link from "next/link";
import { useState, useEffect } from "react";

export default function IndexPage() {
  const metamask = typeof window !== "undefined" && window.ethereum;

  const [account, setAccount] = useState(0);

  useEffect(() => {
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
            {!metamask.selectedAddress && (
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
