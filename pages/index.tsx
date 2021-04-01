import { GetStaticProps } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Billboard } from "../components/billboard/billboard";
import { BILLBOARD_HEIGHT, BILLBOARD_WIDTH } from "../components/consts";
import {
  BillboardData,
  getTestBillboardData,
  getTestBillboardDataUrls,
  TileData,
  TileSchema,
} from "../components/test-data";
import { queryAllItems } from "../utils/database";

interface ServerSideProps {
  billboardData: BillboardData | null;
}

const bilboardData = (queryResult: {Items: TileSchema[]}) => {
  if (!queryResult) {
    return null;
  }

  const items = queryResult.Items.map((item) => ({
    bilboardID: item.BilboardID.S,
    index:  item.TileIndex.N,
    owner: item.owner.S,
    url: item.url.S,
    base64Url: item.DataURI.S,
  })).reduce<{[index: string]: TileData}>((data, item) => ({...data, [item.index]: item}), {});
  return Array.from({ length: BILLBOARD_HEIGHT }, (_, row) => Array.from({ length: BILLBOARD_WIDTH }, (_, col) => items[row * BILLBOARD_WIDTH + col] || null));
};

export const getServerSideProps: GetStaticProps<ServerSideProps> = async () => {

  const data = await queryAllItems();

  return {
    props: {
      billboardData: bilboardData(data as {Items: TileSchema[]}),
    },
  };
};

type IndexPageProps = ServerSideProps;

export default function IndexPage(props: IndexPageProps) {
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

  return (
    <div>
      <Link href="/about">About</Link>

      <h2>Hello </h2>

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
        </>
      )}

      {!metamask && <p>Please install MetaMask!</p>}
      { props.billboardData ? <Billboard data={props.billboardData} owner={account}/> : 'Database error'}
    </div>
  );
}
