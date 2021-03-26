import Link from "next/link";

export default function IndexPage() {
  const metamask = window.ethereum;

  return (
    <div>
      Hello köcsögök. <Link href="/about">About</Link>
      {metamask && (
        <>
          <p>Metamask installed.</p>
          <p>Network version: {metamask.networkVersion}</p>
          <p>ETH Address: {metamask.selectedAddress}</p>
          <p>
            {!metamask.selectedAddress && (
              <button
                class="enableEthereumButton"
                onClick={() => {
                  metamask.request({
                    method: "eth_requestAccounts"
                  });
                }}
              >
                Enable Ethereum
              </button>
            )}
          </p>
        </>
      )}
    </div>
  );
}
