import Link from "next/link";
import { useState, useEffect } from "react";
import fetch from "unfetch";
import { Billboard } from "../components/billboard/billboard";
import { BILLBOARD_HEIGHT, BILLBOARD_WIDTH } from "../components/consts";
import { getTestBillboardData } from "../components/test-data";

const jsonString = (obj: any) => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return obj;
  }
};

export default function IndexPage() {
  const [account, setAccount] = useState();
  const [metamask, setMetamask] = useState<any>(); // TODO Metamask types
  const [apiResult, setApiResult] = useState<any>(); // TODO Metamask types

  useEffect(() => {
    if (!metamask && typeof window !== "undefined") {
      setMetamask((window as any).ethereum);
    }
    if (metamask && metamask.selectedAddress) {
      setAccount(metamask.selectedAddress);
    }
  }, [metamask]);

  const fetchAPI = () => {
    setApiResult("Loading...");
    fetch("/api/image/")
      .then((r) => r.json())
      .then(setApiResult);
  };

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
                  metamask
                    .request({
                      method: "eth_requestAccounts",
                    })
                    .then(
                      (addresses: any) => addresses && setAccount(addresses[0])
                    );
                }}
              >
                Enable Ethereum
              </button>
            )}
          </p>
          <p>
            <button onClick={() => fetchAPI()}>API call test</button>
            "/api/image/"
            <br />
            <textarea
              readOnly
              value={jsonString(apiResult)}
              rows={10}
              cols={80}
            />
          </p>
        </>
      )}

      {!metamask && <p>Please install MetaMask!</p>}
      <Billboard
        data={getTestBillboardData(BILLBOARD_WIDTH, BILLBOARD_HEIGHT, 0.2)}
      />
    </div>
  );
}
